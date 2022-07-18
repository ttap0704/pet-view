import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchPostApi } from '../../../src/utils/api';
import { restaurant_entire_menu } from '../../../src/utils/admin_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalRadio from '../../../src/components/modal/ModalRadio';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

const AdminRestaurantEntireMenu = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert } = useContext(ModalContext);

  const [firstUpdate, setFirstUpdate] = useState(false);
  const [infoContents, setInfoContents] = useState<ChildrenDataType>(restaurant_entire_menu);
  const [radioContents, setRadioContents] = useState<RadioModalContentsDataType>({
    visible: false,
    title: '',
    contents: [],
  });

  useEffect(() => {
    if (firstUpdate) {
      getTableItems();
    }
  }, [data.per_page]);

  useEffect(() => {
    if (user.uid > 0) {
      getTableItems();
      setFirstUpdate(true);
    }
  }, [user]);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if ([0, 1].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 2) {
        setRadioModalContents(target.restaurant_id);
      } else if (target_idx == 3) {
        modal_confirm.openModalConfirm(`정말 [${target.label}] 메뉴를 삭제하시겠습니까?`, () =>
          deleteEntireMenu(target.restaurant_id, target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  const setRadioModalContents = async (restaurant_id: number) => {
    const category_list: EntireMenuCategoryResponse[] = await fetchGetApi(
      `/admin/${user.uid}/restaurant/${restaurant_id}/category`,
    );
    const radio_data = category_list.map(item => {
      return {
        id: item.id,
        label: item.category,
      };
    });
    setRadioContents({ visible: true, title: '카테고리 수정', contents: radio_data });
  };

  const clearRadioModalContents = () => {
    setRadioContents({ visible: false, title: '', contents: [] });
  };

  const deleteEntireMenu = async (restaurant_id: number, id: number) => {
    const delete_res = await fetchPostApi(
      `/admin/${user.uid}/restaurant/${restaurant_id}/entire_menu/${id}/delete`,
      {},
    );
    if (delete_res) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };
  const setModalEdit = () => {
    const index = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);

    let value = '';
    let title = '';
    let target_string = '';
    const type: 'input' | 'textarea' = 'input';

    if (target) {
      switch (index) {
        case 0:
          value = target.label;
          title = '메뉴 수정';
          target_string = 'label';
          break;
        case 1:
          value = target.price.replace(' 원', '');
          title = '가격 수정';
          target_string = 'price';
          break;
      }

      modal_edit.openModalEdit(title, value, target_string, type);
    }
  };

  const editMenuCategory = async (item: { label: string; id: number | string }) => {
    const target = data.table_items.find(item => item.checked);

    if (target) {
      const url = `/admin/${user.uid}/restaurant/${target.restaurant_id}/entire_menu/${target.id}/category`;

      const update_res = await fetchPostApi(url, { category_id: item.id });

      if (update_res.affected == 1) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }

      clearRadioModalContents();
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      const url = `/admin/${user.uid}/restaurant/${target.restaurant_id}/entire_menu/${target.id}/info`;
      const cur_value = target_string == 'price' ? Number(`${value}`.replace(/[,]/gi, '')) : value;
      const update_res = await fetchPostApi(url, { [target_string]: cur_value });

      if (update_res.affected == 1) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async () => {
    const restaurant: EntireMenuListType = await fetchGetApi(
      `/admin/${user.uid}/restaurant/entire_menu?page=${data.per_page}`,
    );

    const count = restaurant.count;
    const rows = restaurant.rows;

    const tmp_table_items = [];
    for (const x of rows) {
      tmp_table_items.push({
        id: x.id,
        category_label: x.category_label,
        label: x.label,
        price: Number(x.price).toLocaleString() + ' 원',
        restaurant_id: x.restaurant_id,
        restaurant_label: x.restaurant_label,
        checked: false,
      });
    }

    setInfoContents({
      ...infoContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={infoContents} />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalRadio
        visible={radioContents.visible}
        title={radioContents.title}
        contents={radioContents.contents}
        onClose={clearRadioModalContents}
        onCompleteUpdate={editMenuCategory}
      />
    </>
  );
};

export default AdminRestaurantEntireMenu;
