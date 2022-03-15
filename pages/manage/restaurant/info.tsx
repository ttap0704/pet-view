import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { restaurant_info } from '../../../src/utils/manage_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalAddRoom from '../../../src/components/modal/ModalAddRoom';
import ModalAddExposureMenu from '../../../src/components/modal/ModalAddExposureMenu';
import ModalAddEntireMenu from '../../../src/components/modal/ModalAddEntireMenu';
import Modalorder from '../../../src/components/modal/ModalOrder';
import ModalPostcodeForm from '../../../src/components/modal/ModalPostcodeForm';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';

interface AddRoomContents {
  visible: boolean;
  rooms_num: number;
  upload_idx: number | null;
}

interface orderContents {
  visible: boolean;
  list: OrderListDataType[];
  title: string;
}

const ManageAccommodationInfo = (props: { list: RestaurantListType; style: { [key: string]: string } }) => {
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload } = useContext(ModalContext);

  const [postcodeVisible, setPostcodeVisible] = useState<boolean>(false);
  const [exposureMenuContents, setExposureMenuContents] = useState({
    visible: false,
    cur_num: 0,
  });
  const [entireMenuContents, setEntireMenuContents] = useState({
    visible: false,
    type: '',
  });
  const [infoContents, setInfoContents] = useState<ChildrenDataType>(restaurant_info);
  const [orderContents, setOrderContents] = useState<orderContents>({
    visible: false,
    list: [],
    title: '',
  });

  useEffect(() => {
    console.log(props.list);
    getTableItems(props.list);
  }, []);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        setExposureMenuModal();
      } else if (target_idx == 1) {
        setEntireMenuContents({ visible: true, type: 'category' });
      } else if ([2, 4].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 3) {
        setPostcodeVisible(true);
      } else if (target_idx == 5) {
        setUploadModal();
      } else if (target_idx == 6) {
        modal_confirm.openModalConfirm(`정말 [${target.label}] 업소를 삭제하시겠습니까?`, () =>
          deleteRestaurant(target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      modal_edit.openModalEdit(
        '소개',
        data.table_items[data.clicked_row_button_idx][data.clicked_row_button_key],
        '',
        'textarea',
        true,
      );
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

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
    const response = await fetchDeleteApi(`/manager/1/restaurant/${id}`);
    if (response == 200) {
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
        `/manager/1/restaurant/${restaurant_id}/exposure_menu`,
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

  const createCategory = (data: AddEntireMenuContentsType[]) => {
    console.log(data);
  };

  const setOrderModalContents = () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const tmp_list: OrderListDataType[] = target.rooms.map((room: RoomType, room_idx: number) => {
        return {
          label: room.label,
          origin: room_idx,
          number: room_idx + 1,
        };
      });
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
      if (type == 'accommodation') {
        let exposure_images = [];

        const delete_res = await fetchDeleteApi(`/image/accommodation/${target_idx}`);

        for (const item of modal_upload.data.image_list) {
          if (item.file) exposure_images.push(item.file);
        }

        const exposure_image_data = await setImageFormData(
          [{ target_id: target_idx, files: exposure_images }],
          'accommodation',
        );

        const upload_res = await fetchFileApi('/upload/image', exposure_image_data);

        console.log(delete_res);
        console.log(upload_res);
        if (delete_res == 200 && upload_res.length > 0) {
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
    console.log(target);

    let value = '';
    let title = '';
    let target_string = '';
    let type: 'input' | 'textarea' = 'input';
    let format = '';

    if (target) {
      switch (index) {
        case 2:
          value = target.label;
          title = '업소명 수정';
          target_string = 'label';
          break;
        case 4:
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
      let url = `/manager/1/restaurant/${target.id}`;

      const status = await fetchPatchApi(url, { target: target_string, value });

      if (status == 200) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async (list?: RestaurantListType) => {
    let count = 0;
    let rows = [];
    if (list) {
      count = list.count;
      rows = list.rows;
    } else {
      const accommodation: RestaurantListType = await fetchGetApi(`/manager/1/restaurant?page=${data.per_page}`);

      count = accommodation.count;
      rows = accommodation.rows;
    }

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
        exposure_menu_num: x.exposure_menu.length + '개',
        category_num: x.entire_menu_category.length + '개',
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
      const rooms = target.rooms;
      const change_data = [];
      for (const data of list) {
        const cur_room = rooms.find((item: RoomType) => item.label == data.label);
        if (cur_room) {
          change_data.push({
            id: cur_room.id,
            seq: Number(data.number) - 1,
          });
        }
      }

      const response = await fetchPostApi(`/manager/1/restaurant/${target.id}/rooms/order`, change_data);
      if (response) {
        getTableItems();
        setOrderContents({ visible: false, title: '', list: [] });
        modal_alert.openModalAlert('객실 순서가 변경되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
      }
    } else {
      modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
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
        onClose={() => setEntireMenuContents({ visible: false, type: '' })}
        onComplete={createCategory}
      />
      <ModalPostcodeForm
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={(address: ResponsePostcodeDataType) => console.log(address)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data: RestaurantListType = await fetchGetApi(`/manager/1/restaurant`);

  return {
    props: {
      list: data,
    },
  };
};

export default ManageAccommodationInfo;