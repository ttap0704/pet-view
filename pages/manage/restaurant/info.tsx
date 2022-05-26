import { GetServerSideProps, GetServerSidePropsContext, GetStaticProps, NextPageContext } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { restaurant_info } from '../../../src/utils/manage_items';

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
import wrapper from '../../../src/store/configureStore';
import { Context } from 'next-redux-wrapper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

const ManageRestaurantInfo = () => {
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
        modal_confirm.openModalConfirm(`정말 [${target.label}] 업소를 삭제하시겠습니까?`, () =>
          deleteRestaurant(target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      const target = data.table_items[data.clicked_row_button_idx];
      if (data.clicked_row_button_key == 'introduction') {
        modal_edit.openModalEdit('소개', target[data.clicked_row_button_key], '', 'textarea', true);
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
      modal_alert.openModalAlert('등록된 이미지가 없습니다.');
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
      const cur_num = Number(target.exposure_menu_num.replace('개', ''));

      if (Number(cur_num) >= 5) {
        modal_alert.openModalAlert('대표메뉴는 총 5개까지 등록이 가능합니다.');
        return;
      }

      setExposureMenuContents({ visible: true, cur_num: cur_num });
    }
  };

  const deleteRestaurant = async (id: number) => {
    const response = await fetchDeleteApi(`/admin/${user.uid}/restaurant/${id}`);
    if (response == 200 || response == 204) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };

  const createExposureMenu = async (exposure_menu: AddExposureMenuContentsType[]) => {
    const target = data.table_items.find(item => item.checked);

    const payload = exposure_menu.map(item => {
      return {
        label: item.label,
        price: Number(item.price),
        comment: item.comment,
      };
    });
    // /:manager/restaurant/:id/:menu
    if (target) {
      const restaurant_id = target.id;

      const res_exposure_menu: ExposureMenuType[] = await fetchPostApi(
        `/admin/${user.uid}/restaurant/${restaurant_id}/exposure_menu`,
        payload,
      );

      const exposure_menu_images_payload = [];
      for (const menu of exposure_menu) {
        const res_menu = res_exposure_menu.find(item => item.label == menu.label);
        let menu_images = [];
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
        modal_alert.openModalAlert('대표메뉴 등록이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 등록이 실패되었습니다.');
      }

      getTableItems();
      setExposureMenuContents({ visible: false, cur_num: 0 });
    }
  };

  const createCategory = async (category: AddEntireMenuContentsType[]) => {
    const target = data.table_items.find(item => item.checked);

    if (target) {
      const res = await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/category`, category);

      if (res) {
        modal_alert.openModalAlert('카테고리 등록이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 등록이 실패되었습니다.');
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
          title = '대표메뉴 순서 변경';
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
          title = '카테고리 순서 변경';
          tmp_list = target.entire_menu_category.map((category: EntireMenuCategoryType, category_idx: number) => {
            return {
              label: category.category,
              origin: category_idx,
              number: category_idx + 1,
            };
          });
          break;
      }
      setOrderContents({ visible: true, list: tmp_list, title: '객실 순서 변경' });
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
      modal_upload.openModalUpload('대표 이미지 수정', 'restaurant', new_images, target.id);
    }
  };

  const updateExposureImages = async () => {
    const target_idx = modal_upload.data.target_idx;
    const type = modal_upload.data.type;

    if (target_idx != null && target_idx >= 0) {
      if (type == 'restaurant') {
        let exposure_images = [];

        const delete_res = await fetchDeleteApi(`/image/restaurant/${target_idx}`);

        for (const item of modal_upload.data.image_list) {
          if (item.file) exposure_images.push(item.file);
        }

        const exposure_image_data = await setImageFormData(
          [{ target_id: target_idx, files: exposure_images }],
          'restaurant',
        );

        const upload_res = await fetchFileApi('/upload/image', exposure_image_data);

        if ((delete_res == 200 || delete_res == 204) && upload_res.length > 0) {
          modal_alert.openModalAlert('대표 이미지 수정이 완료되었습니다.');
        } else {
          modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
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
    let format = '';

    if (target) {
      switch (index) {
        case 4:
          value = target.label;
          title = '업소명 수정';
          target_string = 'label';
          break;
        case 6:
          value = target.introduction;
          title = '소개 수정';
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
      let url = `/admin/${user.uid}/restaurant/${target.id}`;

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
    console.log('getTableItems');
    const restaurant: RestaurantListType = await fetchGetApi(`/admin/${user.uid}/restaurant?page=${data.per_page}`);

    const count = restaurant.count;
    const rows = restaurant.rows;

    let tmp_table_items = [];
    for (let x of rows) {
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
        created_at: getDate(x.createdAt),
        images: x.restaurant_images,
        exposure_menu: x.exposure_menu,
        exposure_menu_num: x.exposure_menu.length + '개',
        entire_menu_category: x.entire_menu_category,
        category_num: x.entire_menu_category.length + '개',
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
      let change_data = [];
      if (curOrderModalType == 'exposure_menu') {
        for (const data of list) {
          const cur_menu = target.exposure_menu.find((item: ExposureMenuType) => item.label == data.label);
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
            (item: EntireMenuCategoryType) => item.category == data.label,
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
      const update_res = await await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/address`, { address });
      if (update_res) {
        getTableItems();
        setPostcodeVisible(false);
        modal_alert.openModalAlert('주소가 변경되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
      }
    }
  };

  const updateServiceInfo = async (service_info: ServiceInfoType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/admin/${user.uid}/restaurant/${target.id}/service`, {
        service_info,
      });
      if (update_res) {
        getTableItems();
        clearServiceInfoModal();
        modal_alert.openModalAlert('추가 정보가 변경되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
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

export default ManageRestaurantInfo;
