import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { accommodation_rooms } from '../../../src/utils/manage_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalAddRoom from '../../../src/components/modal/ModalAddRoom';
import ModalOrder from '../../../src/components/modal/ModalOrder';
import ModalPostcodeForm from '../../../src/components/modal/ModalPostcodeForm';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';

interface AddRoomContents {
  visible: boolean;
  rooms_num: number;
  upload_idx: number | null;
}

interface OrderContents {
  visible: boolean;
  list: OrderListDataType[];
  title: string;
}

const ManageAccommodationRooms = (props: { list: AccommodationRoomsListType; style: { [key: string]: string } }) => {
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload } = useContext(ModalContext);

  const [roomContents, setRoomContents] = useState<ChildrenDataType>(accommodation_rooms);
  const [first, setFirst] = useState(false);

  useEffect(() => {
    if (first) {
      getTableItems();
    }
  }, [data.per_page]);

  useEffect(() => {
    getTableItems(props.list);
    setFirst(true);
  }, []);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if ([0, 1, 2, 3].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 4) {
        setUploadModal();
      } else if (target_idx == 5) {
        const accommodation_id = target.accommodation_id;
        modal_confirm.openModalConfirm(`정말 [${target.label}] 객실를 삭제하시겠습니까?`, () =>
          deleteRoom(accommodation_id, target.id),
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
      console.log(data.clicked_row_button_idx, data.clicked_row_button_key);
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const deleteRoom = async (accommodation_id: number, id: number) => {
    const response = await fetchDeleteApi(`/manager/1/accommodation/${accommodation_id}/rooms/${id}`);
    if (response == 200) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
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
      modal_upload.openModalUpload('객실 이미지 수정', 'rooms', new_images, target.id);
    }
  };

  const updateExposureImages = async () => {
    const target = data.table_items.find(item => item.checked);
    const target_idx = modal_upload.data.target_idx;
    const type = modal_upload.data.type;

    if (target && target_idx != null && target_idx >= 0) {
      const accommodation_id = target.accommodation_id;
      let room_images = [];

      const delete_res = await fetchDeleteApi(`/image/rooms/${target_idx}`);

      for (const item of modal_upload.data.image_list) {
        if (item.file) room_images.push(item.file);
      }

      const room_image_data = await setImageFormData(
        [{ target_id: target_idx, files: room_images }],
        'rooms',
        accommodation_id,
      );

      const upload_res = await fetchFileApi('/upload/image', room_image_data);

      console.log(delete_res);
      console.log(upload_res);
      if (delete_res == 200 && upload_res.length > 0) {
        modal_alert.openModalAlert('객실 이미지 수정이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
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
    let type: 'input' | 'textarea' = 'input';
    let format = '';
    let end = '';

    if (target) {
      switch (index) {
        case 0:
          value = target.label;
          title = '객실명 수정';
          target_string = 'label';
          break;
        case 1:
          value = target.standard_num;
          title = '기준 인원 수정';
          target_string = 'standard_num';
          end = '명';
          break;
        case 2:
          value = target.maximum_num;
          title = '최대 인원 수정';
          target_string = 'maximum_num';
          end = '명';
          break;
        case 3:
          value = target.price;
          title = '가격 수정';
          target_string = 'price';
          end = '원';
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
      let url = `/manager/1/accommodation/${accommodation_id}/rooms/${target.id}`;
      if (target_string == 'price') {
        value = `${value}`.replace(/\,/g, '');
      }

      const status = await fetchPatchApi(url, { target: target_string, value });

      if (status == 200) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async (list?: AccommodationRoomsListType) => {
    let count = 0;
    let rows = [];
    if (list) {
      count = list.count;
      rows = list.rows;
    } else {
      const accommodation: AccommodationRoomsListType = await fetchGetApi(
        `/manager/1/accommodation/rooms?page=${data.per_page}`,
      );

      count = accommodation.count;
      rows = accommodation.rows;
    }

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        maximum_num: x.maximum_num,
        standard_num: x.standard_num,
        label: x.label,
        accommodation_label: x.accommodation_label,
        accommodation_id: x.accommodation_id,
        price: Number(x.price).toLocaleString(),
        images: x.rooms_images,
        additional_info: x.additional_info,
        amenities: x.amenities,
        created_at: getDate(x.createdAt),
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data: AccommodationRoomsListType = await fetchGetApi(`/manager/1/accommodation/rooms`);

  return {
    props: {
      list: data,
    },
  };
};

export default ManageAccommodationRooms;
