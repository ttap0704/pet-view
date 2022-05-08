import { GetServerSideProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { setImageArray, setImageFormData } from '../../../src/utils/tools';
import { restaurant_category } from '../../../src/utils/manage_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalAddEntireMenu from '../../../src/components/modal/ModalAddEntireMenu';
import Modalorder from '../../../src/components/modal/ModalOrder';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';

interface EntireMenuModalContentsType {
  visible: boolean;
  type: string;
  mode: string;
  category: AddEntireMenuContentsType[];
}

const ManageAccommodationCategory = () => {
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload } = useContext(ModalContext);

  const [firstUpdate, setFirstUpdate] = useState(false);
  const [curOrderModalType, setCurOrderModalType] = useState('');
  const [entireMenuContents, setEntireMenuContents] = useState<EntireMenuModalContentsType>({
    visible: false,
    type: '',
    mode: '',
    category: [],
  });
  const [categoryContents, setCategoryContents] = useState<ChildrenDataType>(restaurant_category);
  const [orderContents, setOrderContents] = useState<orderContents>({
    visible: false,
    list: [],
    title: '',
  });

  useEffect(() => {
    if (firstUpdate) {
      getTableItems();
    }
  }, [data.per_page]);

  useEffect(() => {
    getTableItems();
    setFirstUpdate(true);
  }, []);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        modal_edit.openModalEdit('카테고리명 수정', target.category, 'category', 'input');
      } else if (target_idx == 1) {
        setAddEntireMenuContents();
      } else if (target_idx == 2) {
        setOrderModalContents();
      } else if (target_idx == 3) {
        modal_confirm.openModalConfirm(`정말 [${target.category}] 카테고리를 삭제하시겠습니까?`, () =>
          deleteCategory(target.restaurant_id, target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      const target = data.table_items[data.clicked_row_button_idx];
      const category_data: AddEntireMenuContentsType[] = [
        {
          category: target.category,
          menu: target.menu.map((menu: EntireMenuType) => {
            return { label: menu.label, price: menu.price };
          }),
        },
      ];
      setEntireMenuContents({ visible: true, type: 'category', mode: 'read', category: category_data });
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const setAddEntireMenuContents = () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const category_data: AddEntireMenuContentsType[] = [
        {
          category: target.category,
          menu: [{ label: '', price: '' }],
        },
      ];

      setEntireMenuContents({ visible: true, type: 'entire_menu', mode: 'add', category: category_data });
    }
  };

  const deleteCategory = async (restaurant_id: number, id: number) => {
    const response = await fetchDeleteApi(`/manager/1/restaurant/${restaurant_id}/category/${id}`);
    if (response == 200) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };

  const addEntireMenu = async (category: AddEntireMenuContentsType[]) => {
    const target = data.table_items.find(item => item.checked);

    if (target) {
      const menu = [...category[0].menu];
      const res = await fetchPostApi(`/manager/1/restaurant/${target.restaurant_id}/category/${target.id}/menu`, {
        menu,
      });

      if (res) {
        modal_alert.openModalAlert('전체메뉴 등록이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 등록이 실패되었습니다.');
      }

      getTableItems();
      setEntireMenuContents({ visible: false, type: '', mode: '', category: [] });
    }
  };

  const setOrderModalContents = () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      let tmp_list = [];
      let title = '';

      setCurOrderModalType('menu');
      title = '카테고리 순서 변경';
      tmp_list = target.menu.map((menu: EntireMenuType, menu_idx: number) => {
        return {
          label: menu.label,
          origin: menu_idx,
          number: menu_idx + 1,
        };
      });
      setOrderContents({ visible: true, list: tmp_list, title: '메뉴 순서 변경' });
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      let url = `/manager/1/restaurant/${target.restaurant_id}/category/${target.id}`;
      const status = await fetchPatchApi(url, { target: target_string, value });

      if (status == 200) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async () => {
    const category: EntireMenuCategoryListType = await fetchGetApi(
      `/manager/1/restaurant/category?page=${data.per_page}`,
    );

    const count = category.count;
    const rows = category.rows;

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        category: x.category,
        restaurant_id: x.restaurant_id,
        restaurant_label: x.restaurant_label,
        menu: x.menu,
        menu_num: x.menu.length,
        checked: false,
      });
    }

    setCategoryContents({
      ...categoryContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  const completeChangeOrder = async (list: OrderListDataType[]) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      let change_data = [];
      if (curOrderModalType == 'menu') {
        for (const data of list) {
          const cur_menu = target.menu.find((item: EntireMenuType) => item.label == data.label);
          if (cur_menu) {
            change_data.push({
              id: cur_menu.id,
              seq: Number(data.number) - 1,
            });
          }
        }
      }
      const response = await fetchPostApi(
        `/manager/1/restaurant/${target.restaurant_id}/entire_menu/order`,
        change_data,
      );
      if (response) {
        modal_alert.openModalAlert(`${orderContents.title}이 완료되었습니다.`);
        getTableItems();
        setOrderContents({ visible: false, title: '', list: [] });
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
      }
    } else {
      modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
    }
  };

  return (
    <>
      <Table contents={categoryContents} />
      <Modalorder
        visible={orderContents.visible}
        title={orderContents.title}
        list={orderContents.list}
        onClose={() => setOrderContents({ visible: false, title: '', list: [] })}
        onChange={(list: OrderListDataType[]) => completeChangeOrder(list)}
      />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalAddEntireMenu
        visible={entireMenuContents.visible}
        type={entireMenuContents.type}
        mode={entireMenuContents.mode}
        category={entireMenuContents.category}
        onClose={() => setEntireMenuContents({ visible: false, type: '', mode: '', category: [] })}
        onComplete={addEntireMenu}
      />
    </>
  );
};

export default ManageAccommodationCategory;
