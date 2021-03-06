import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { accommodation_rooms } from '../../../src/utils/admin_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalRoomPrice from '../../../src/components/modal/ModalRoomPrice';
import ModalRoomTime from '../../../src/components/modal/ModalRoomTime';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

const AdminAccommodationRooms = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload, modal_image_detail } = useContext(ModalContext);

  const [roomContents, setRoomContents] = useState<ChildrenDataType>(accommodation_rooms);
  const [roomTimeContents, setRoomTimeContents] = useState({
    mode: '',
    visible: false,
    contents: {
      entrance: '',
      leaving: '',
    },
    current_room_idx: 0,
  });
  const [roomPriceContents, setRoomPriceContents] = useState({
    mode: '',
    visible: false,
    contents: {
      normal_price: '',
      normal_weekend_price: '',
      peak_price: '',
      peak_weekend_price: '',
    },
    current_room_idx: 0,
  });
  const [first, setFirst] = useState(false);

  useEffect(() => {
    if (first) {
      getTableItems();
    }
  }, [data.per_page]);

  useEffect(() => {
    if (user.uid > 0) {
      getTableItems();
      setFirst(true);
    }
  }, [user]);

  useEffect(() => {
    const dropdown_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && dropdown_idx != null && dropdown_idx >= 0) {
      if ([0, 1, 2].includes(dropdown_idx)) {
        setModalEdit();
      } else if (dropdown_idx == 3) {
        const edit_idx = data.table_items.findIndex(item => item == target);
        setRoomTimeModal('edit', edit_idx);
      } else if (dropdown_idx == 4) {
        const edit_idx = data.table_items.findIndex(item => item == target);
        setRoomPriceModal('edit', edit_idx);
      } else if (dropdown_idx == 5) {
        setUploadModal();
      } else if (dropdown_idx == 6) {
        const accommodation_id = target.accommodation_id;
        modal_confirm.openModalConfirm(`?????? [${target.label}] ????????? ?????????????????????????`, () =>
          deleteRoom(accommodation_id, target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      if (data.clicked_row_button_key == 'images') {
        setExposureImageDetail(data.clicked_row_button_idx);
      } else if (data.clicked_row_button_key == 'price') {
        setRoomPriceModal('read', data.clicked_row_button_idx);
      } else if (data.clicked_row_button_key == 'room_time') {
        setRoomTimeModal('read', data.clicked_row_button_idx);
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
    modal_image_detail.openModalImageDetail('rooms', image_list);
  };

  const setRoomPriceModal = (mode: string, idx: number) => {
    const target = data.table_items[idx];
    if (target) {
      setRoomPriceContents({
        mode: mode,
        visible: true,
        current_room_idx: idx,
        contents: {
          normal_price: target.normal_price,
          normal_weekend_price: target.normal_weekend_price,
          peak_price: target.peak_price,
          peak_weekend_price: target.peak_weekend_price,
        },
      });
    }
  };

  const clearRoomPriceModal = () => {
    setRoomPriceContents({
      mode: '',
      visible: false,
      current_room_idx: 0,
      contents: {
        normal_price: '',
        normal_weekend_price: '',
        peak_price: '',
        peak_weekend_price: '',
      },
    });
  };

  const setRoomTimeModal = (mode: string, idx: number) => {
    const target = data.table_items[idx];
    if (target) {
      setRoomTimeContents({
        mode: mode,
        visible: true,
        current_room_idx: idx,
        contents: {
          entrance: target.entrance,
          leaving: target.leaving,
        },
      });
    }
  };

  const clearRoomTimeModal = () => {
    setRoomTimeContents({
      mode: '',
      visible: false,
      current_room_idx: 0,
      contents: {
        entrance: '',
        leaving: '',
      },
    });
  };

  const updateRoomInfo = async (update_data: { [key: string]: string | number }, type: string) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const accommodation_id = target.accommodation_id;
      const id = target.id;
      const update_res = await fetchPostApi(
        `/admin/${user.uid}/accommodation/${accommodation_id}/rooms/${id}/info`,
        update_data,
      );

      if (update_res) {
        let title = '';
        if (type == 'price') {
          title = '?????? ????????? ?????????????????????.';
        } else {
          title = '??????/?????? ?????? ????????? ?????????????????????.';
        }

        modal_alert.openModalAlert(title);
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }
      getTableItems();
      if (type == 'price') {
        clearRoomPriceModal();
      } else {
        clearRoomTimeModal();
      }
    }
  };

  const deleteRoom = async (accommodation_id: number, id: number) => {
    const response = await fetchPostApi(`/admin/${user.uid}/accommodation/${accommodation_id}/rooms/${id}/delete`, {});
    if (response == 200 || response == 204) {
      modal_alert.openModalAlert('????????? ?????????????????????.');
    } else {
      modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
    }
    getTableItems();
  };

  const setUploadModal = async () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const images = target.images.map((item: { file_name: string }) => {
        return {
          file_name: item.file_name,
        };
      });
      const new_images = await setImageArray(images, true, 'rooms');
      modal_upload.openModalUpload('?????? ????????? ??????', 'rooms', new_images, target.id);
    }
  };

  const updateExposureImages = async () => {
    const target = data.table_items.find(item => item.checked);
    const target_idx = modal_upload.data.target_idx;
    const type = modal_upload.data.type;

    if (target && target_idx != null && target_idx >= 0) {
      const accommodation_id = target.accommodation_id;
      const room_images = [];

      const delete_res = await fetchPostApi(`/images/rooms/${target_idx}/delete`, {});

      for (const item of modal_upload.data.image_list) {
        if (item.file) room_images.push(item.file);
      }

      const room_image_data = await setImageFormData(
        [{ target_id: target_idx, files: room_images }],
        'rooms',
        accommodation_id,
      );

      const upload_res = await fetchFileApi('/upload/image', room_image_data);

      if (upload_res.length > 0) {
        modal_alert.openModalAlert('?????? ????????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }
      getTableItems();
      modal_upload.closeModalUpload();
    }
  };

  const setModalEdit = () => {
    const index = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);

    let value = '';
    let title = '';
    let target_string = '';
    const type: 'input' | 'textarea' = 'input';
    const format = '';
    let end = '';

    if (target) {
      switch (index) {
        case 0:
          value = target.label;
          title = '????????? ??????';
          target_string = 'label';
          break;
        case 1:
          value = target.standard_num;
          title = '?????? ?????? ??????';
          target_string = 'standard_num';
          end = '???';
          break;
        case 2:
          value = target.maximum_num;
          title = '?????? ?????? ??????';
          target_string = 'maximum_num';
          end = '???';
          break;
        case 3:
          value = target.price;
          title = '?????? ??????';
          target_string = 'price';
          end = '???';
          break;
      }

      modal_edit.openModalEdit(title, value, target_string, type, false, '', end);
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      const accommodation_id = target.accommodation_id;
      const url = `/admin/${user.uid}/accommodation/${accommodation_id}/rooms/${target.id}/info`;
      if (['standard_num', 'maximum_num'].includes(target_string)) {
        value = Number(value);
      }

      const update_res = await fetchPostApi(url, { [target_string]: value });

      if (update_res.affected > 0) {
        modal_alert.openModalAlert('????????? ?????????????????????.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
      }
    }
  };

  const getTableItems = async () => {
    const accommodation: AccommodationRoomsListType = await fetchGetApi(
      `/admin/${user.uid}/accommodation/rooms?page=${data.per_page}`,
    );

    const count = accommodation.count;
    const rows = accommodation.rows;

    const tmp_table_items = [];
    for (const x of rows) {
      tmp_table_items.push({
        id: x.id,
        maximum_num: x.maximum_num,
        standard_num: x.standard_num,
        label: x.label,
        accommodation_label: x.accommodation_label,
        accommodation_id: x.accommodation_id,
        normal_price: Number(x.normal_price).toLocaleString(),
        normal_weekend_price: Number(x.normal_weekend_price).toLocaleString(),
        peak_price: Number(x.peak_price).toLocaleString(),
        peak_weekend_price: Number(x.peak_weekend_price).toLocaleString(),
        images: x.rooms_images,
        entrance: x.entrance,
        leaving: x.leaving,
        additional_info: x.additional_info,
        amenities: x.amenities,
        created_at: getDate(x.created_at),
        checked: false,
      });
    }

    setRoomContents({
      ...roomContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={roomContents} />
      <ModalUpload onUpload={updateExposureImages} />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalRoomPrice
        mode={roomPriceContents.mode}
        visible={roomPriceContents.visible}
        contents={roomPriceContents.contents}
        onClose={() => clearRoomPriceModal()}
        onUpdatePrice={(data: { [key: string]: number }) => updateRoomInfo(data, 'price')}
      />
      <ModalRoomTime
        mode={roomTimeContents.mode}
        visible={roomTimeContents.visible}
        contents={roomTimeContents.contents}
        onClose={() => clearRoomTimeModal()}
        onUpdateTime={(data: { [key: string]: string }) => updateRoomInfo(data, 'time')}
        type='edit'
      />
    </>
  );
};

export default AdminAccommodationRooms;
