import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { restaurant_info } from '../../../src/utils/admin_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalAddExposureMenu from '../../../src/components/modal/ModalAddExposureMenu';
import ModalAddEntireMenu from '../../../src/components/modal/ModalAddEntireMenu';
import Modalorder from '../../../src/components/modal/ModalOrder';
import ModalServiceInfo from '../../../src/components/modal/ModalServiceInfo';
import ModalPostcodeForm from '../../../src/components/modal/ModalPostcodeForm';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

const AdminRestaurantInfo = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload, modal_image_detail } = useContext(ModalContext);

  const [firstUpdate, setFirstUpdate] = useState(false);
  const [curOrderModalType, setCurOrderModalType] = useState('');
  const [postcodeVisible, setPostcodeVisible] = useState<boolean>(false);
  const [exposureMenuContents, setExposureMenuContents] = useState({
    visible: false,
    cur_num: 0,
  });
  const [entireMenuContents, setEntireMenuContents] = useState({
    visible: false,
    type: '',
  });
  const [serviceInfoModalContents, setServiceInfoModalContents] = useState({
    visible: false,
    contents: {
      contact: '',
      site: '',
      kakao_chat: '',
      open: '',
      close: '',
      last_order: '',
    },
    mode: '',
  });
  const [infoContents, setInfoContents] = useState<ChildrenDataType>(restaurant_info);
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
    if (user.uid > 0 && !firstUpdate) {
      getTableItems();
      setFirstUpdate(true);
    }
  }, [user]);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        setExposureMenuModal();
      } else if ([1, 3].includes(target_idx)) {
        setOrderModalContents(target_idx);
      } else if (target_idx == 2) {
        setEntireMenuContents({ visible: true, type: 'category' });
      } else if ([4, 6].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 5) {
        setPostcodeVisible(true);
      } else if (target_idx == 7) {
        setUploadModal();
      } else if (target_idx == 8) {
        const service_data = {
          contact: target.contact,
          site: target.site,
          kakao_chat: target.kakao_chat,
          open: target.open,
          close: target.close,
          last_order: target.last_order,
        };
        setServiceInfoModal(service_data, 'edit');
      } else if (target_idx == 9) {
        modal_confirm.openModalConfirm(`?????? [${target.label}] ????????? ?????????????????????????`, () =>
          deleteRestaurant(target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      const target = data.table_items[data.clicked_row_button_idx];
      if (data.clicked_row_button_key == 'introduction') {
        modal_edit.openModalEdit('??????', target[data.clicked_row_button_key], '', 'textarea', true);
      } else if (data.clicked_row_button_key == 'image') {
        setExposureImageDetail(data.clicked_row_button_idx);
      } else if (data.clicked_row_button_key == 'service_info') {
        const service_info_data = {
          contact: target.contact,
          site: target.site,
          kakao_chat: target.kakao_chat,
          open: target.open,
          close: target.close,
          last_order: target.last_order,
        };

        setServiceInfoModal(service_info_data, 'read');
      }
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const setExposureImageDetail = async (idx: number) => {
    if (data.table_items[idx].images.length == 0) {
      modal_alert.openModalAlert('????????? ???????????? ????????????.');
      return;
    }

    const tmp_image_list = data.table_items[idx].images.map((item: ImageType) => {
      return {
        file_name: item.file_name,
      };
    });
    const image_list = await setImageArray(tmp_image_list);
    modal_image_detail.openModalImageDetail('restaurant', image_list);
  };

  const setExposureMenuModal = () => {
    const target = data.table_items.find(item => item.checked);

    if (target) {
      const cur_num = Number(target.exposure_menu_num.replace('???', ''));

      if (Number(cur_num) >= 5) {
        modal_alert.openModalAlert('??????????????? ??? 5????????? ????????? ???????????????.');
        return;
      }

      setExposureMenuContents({ visible: true, cur_num: cur_num });
    }
  };

  const deleteRestaurant = async (id: number) => {
    const response = await fetchPostApi(`/admin/${user.uid}/restaurant/${id}/delete`, {});
    if (response) {
      modal_alert.openModalAlert('????????? ?????????????????????.');
    } else {
      modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
    }
    getTableItems();
  };

  const createExposureMenu = async (exposure_menu: AddExposureMenuContentsType[]) => {
    const target = data.table_items.find(item => item.checked);

    const payload = exposure_menu.map(item => {
      return {
        label: item.label,
        price: Number(item.price.replace(/[,]/gi, '')),
        comment: item.comment,
      };
    });

    if (target) {
      const restaurant_id = target.id;

      const res_exposure_menu: ExposureMenuType[] = await fetchPostApi(
        `/admin/${user.uid}/restaurant/${restaurant_id}/exposure_menu`,
        payload,
      );

      const exposure_menu_images_payload = [];
      for (const menu of exposure_menu) {
        const res_menu = res_exposure_menu.find(item => item.label == menu.label);
        const menu_images = [];
        if (menu.image_list && menu.image_list.length > 0 && menu.image_list[0].file) {
          menu_images.push(menu.image_list[0].file);
        }

        if (res_menu) {
          exposure_menu_images_payload.push({ target_id: res_menu.id, files: menu_images });
        }
      }

      const exposure_menu_image_data = await setImageFormData(
        exposure_menu_images_payload,
        'exposure_menu',
        restaurant_id,
      );

      const upload_exposure_menu_response = await fetchFileApi('/upload/image', exposure_menu_image_data);

      if (upload_exposure_menu_response.length > 0) {
        modal_alert.openModalAlert('???????????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }

      getTableItems();
      setExposureMenuContents({ visible: false, cur_num: 0 });
    }
  };

  const createCategory = async (category: AddEntireMenuContentsType[]) => {
    const target = data.table_items.find(item => item.checked);
    const payload = [];
    for (const item of category) {
      const tmp_payload = {
        ...item,
        menu: item.menu.map(menu_item => ({ ...menu_item, price: Number(`${menu_item.price}`.replace(/[,]/gi, '')) })),
      };

      payload.push(tmp_payload);
    }

    if (target) {
      const res = await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/category`, payload);

      if (res) {
        modal_alert.openModalAlert('???????????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }

      getTableItems();
      setEntireMenuContents({ visible: false, type: '' });
    }
  };

  const setOrderModalContents = (idx: number) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      let tmp_list = [];
      let title = '';
      switch (idx) {
        case 1:
          setCurOrderModalType('exposure_menu');
          title = '???????????? ?????? ??????';
          tmp_list = target.exposure_menu.map((menu: ExposureMenuType, menu_idx: number) => {
            return {
              label: menu.label,
              origin: menu_idx,
              number: menu_idx + 1,
            };
          });
          break;
        case 3:
          setCurOrderModalType('category');
          title = '???????????? ?????? ??????';
          tmp_list = target.entire_menu_category.map((category: EntireMenuCategoryType, category_idx: number) => {
            return {
              label: category.category,
              origin: category_idx,
              number: category_idx + 1,
            };
          });
          break;
      }
      setOrderContents({ visible: true, list: tmp_list, title });
    }
  };

  const setUploadModal = async () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const images = target.images.map((item: { file_name: string }) => {
        return {
          file_name: item.file_name,
        };
      });
      const new_images = await setImageArray(images, true, 'restaurant');
      modal_upload.openModalUpload('?????? ????????? ??????', 'restaurant', new_images, target.id);
    }
  };

  const updateExposureImages = async () => {
    const target_idx = modal_upload.data.target_idx;
    const type = modal_upload.data.type;

    if (target_idx != null && target_idx >= 0) {
      if (type == 'restaurant') {
        const exposure_images = [];

        const delete_res = await fetchPostApi(`/images/restaurant/${target_idx}/delete`, {});

        for (const item of modal_upload.data.image_list) {
          if (item.file) exposure_images.push(item.file);
        }

        const exposure_image_data = await setImageFormData(
          [{ target_id: target_idx, files: exposure_images }],
          'restaurant',
        );

        const upload_res = await fetchFileApi('/upload/image', exposure_image_data);

        if (upload_res.length > 0) {
          modal_alert.openModalAlert('?????? ????????? ????????? ?????????????????????.');
        } else {
          modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
        }
        getTableItems();
        modal_upload.closeModalUpload();
      }
    }
  };

  const setModalEdit = () => {
    const index = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);

    let value = '';
    let title = '';
    let target_string = '';
    let type: 'input' | 'textarea' = 'input';
    const format = '';

    if (target) {
      switch (index) {
        case 4:
          value = target.label;
          title = '????????? ??????';
          target_string = 'label';
          break;
        case 6:
          value = target.introduction;
          title = '?????? ??????';
          target_string = 'introduction';
          type = 'textarea';
          break;
      }

      modal_edit.openModalEdit(title, value, target_string, type);
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      const url = `/admin/${user.uid}/restaurant/${target.id}/info`;

      const update_res = await fetchPostApi(url, { [target_string]: value });

      if (update_res.affected == 1) {
        modal_alert.openModalAlert('????????? ?????????????????????.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }
    }
  };

  const getTableItems = async () => {
    const restaurant: RestaurantListType = await fetchGetApi(`/admin/${user.uid}/restaurant?page=${data.per_page}`);

    const count = restaurant.count;
    const rows = restaurant.rows;

    const tmp_table_items = [];
    for (const x of rows) {
      tmp_table_items.push({
        id: x.id,
        address: `${x.sido} ${x.sigungu} ${x.bname}`,
        bname: x.bname,
        building_name: x.building_name,
        detail_address: x.detail_address,
        introduction: x.introduction,
        label: x.label,
        sido: x.sido,
        sigungu: x.sigungu,
        zonecode: x.zonecode,
        created_at: getDate(x.created_at),
        images: x.restaurant_images,
        exposure_menu: x.exposure_menu,
        exposure_menu_num: x.exposure_menu.length + '???',
        entire_menu_category: x.entire_menu_category,
        category_num: x.entire_menu_category.length + '???',
        contact: x.contact,
        site: x.site,
        kakao_chat: x.kakao_chat,
        open: x.open,
        close: x.close,
        last_order: x.last_order,
        checked: false,
      });
    }

    setInfoContents({
      ...infoContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  const completeChangeOrder = async (list: OrderListDataType[]) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const change_data = [];
      if (curOrderModalType == 'exposure_menu') {
        for (const data of list) {
          const cur_menu = target.exposure_menu.find((item: ExposureMenuType) => item.seq == data.origin);
          if (cur_menu) {
            change_data.push({
              id: cur_menu.id,
              seq: Number(data.number) - 1,
            });
          }
        }
      } else if (curOrderModalType == 'category') {
        for (const data of list) {
          const cur_category = target.entire_menu_category.find(
            (item: EntireMenuCategoryType) => item.seq == data.origin,
          );
          if (cur_category) {
            change_data.push({
              id: cur_category.id,
              seq: Number(data.number) - 1,
            });
          }
        }
      }

      const response = await fetchPostApi(
        `/admin/${user.uid}/restaurant/${target.id}/${curOrderModalType}/order`,
        change_data,
      );
      if (response) {
        modal_alert.openModalAlert(`${orderContents.title}??? ?????????????????????.`);
        getTableItems();
        setOrderContents({ visible: false, title: '', list: [] });
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
      }
    } else {
      modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
    }
  };

  const setServiceInfoModal = (info: ServiceInfoType, mode: string) => {
    setServiceInfoModalContents({
      visible: true,
      contents: {
        ...info,
        open: `${info.open ?? ''}`,
        close: `${info.close ?? ''}`,
        last_order: `${info.last_order ?? ''}`,
      },
      mode: mode,
    });
  };

  const clearServiceInfoModal = () => {
    setServiceInfoModalContents({
      visible: false,
      contents: {
        contact: '',
        site: '',
        kakao_chat: '',
        open: '',
        close: '',
        last_order: '',
      },
      mode: '',
    });
  };

  const updateAddress = async (address: ResponsePostcodeDataType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/info`, { ...address });
      if (update_res) {
        getTableItems();
        setPostcodeVisible(false);
        modal_alert.openModalAlert('????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
      }
    }
  };

  const updateServiceInfo = async (service_info: ServiceInfoType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/info`, {
        ...service_info,
      });
      if (update_res) {
        getTableItems();
        clearServiceInfoModal();
        modal_alert.openModalAlert('?????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
      }
    }
  };

  return (
    <>
      <Table contents={infoContents} />
      <ModalUpload onUpload={updateExposureImages} />
      <Modalorder
        visible={orderContents.visible}
        title={orderContents.title}
        list={orderContents.list}
        onClose={() => setOrderContents({ visible: false, title: '', list: [] })}
        onChange={(list: OrderListDataType[]) => completeChangeOrder(list)}
      />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalAddExposureMenu
        visible={exposureMenuContents.visible}
        curNumber={exposureMenuContents.cur_num}
        onClose={() => setExposureMenuContents({ visible: false, cur_num: 0 })}
        onComplete={createExposureMenu}
      />
      <ModalAddEntireMenu
        visible={entireMenuContents.visible}
        type={entireMenuContents.type}
        mode='add'
        onClose={() => setEntireMenuContents({ visible: false, type: '' })}
        onComplete={createCategory}
      />
      <ModalPostcodeForm
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={(address: ResponsePostcodeDataType) => updateAddress(address)}
      />
      <ModalServiceInfo
        visible={serviceInfoModalContents.visible}
        contents={serviceInfoModalContents.contents}
        mode={serviceInfoModalContents.mode}
        type='restaurant'
        onUpdateInfo={updateServiceInfo}
        onClose={clearServiceInfoModal}
      />
    </>
  );
};

export default AdminRestaurantInfo;
