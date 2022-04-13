import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { accommodation_info } from '../../../src/utils/manage_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalAddRoom from '../../../src/components/modal/ModalAddRoom';
import Modalorder from '../../../src/components/modal/ModalOrder';
import ModalPostcodeForm from '../../../src/components/modal/ModalPostcodeForm';
import ModalPeakSeason from '../../../src/components/modal/ModalPeakSeason';
import ModalServiceInfo from '../../../src/components/modal/ModalServiceInfo';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';

interface AddRoomContents {
  visible: boolean;
  rooms_num: number;
  upload_idx: number | null;
}

interface PeakSeasonModalContentsType {
  visible: boolean;
  data: string[][];
  mode: string;
}

const ManageAccommodationInfo = (props: { list: AccommodationListType; style: { [key: string]: string } }) => {
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload, modal_image_detail } = useContext(ModalContext);

  const [first, setFirst] = useState(false);
  const [postcodeVisible, setPostcodeVisible] = useState<boolean>(false);
  const [addRoomContents, setAddRoomContents] = useState<AddRoomContents>({
    visible: false,
    rooms_num: 0,
    upload_idx: null,
  });
  const [infoContents, setInfoContents] = useState<ChildrenDataType>(accommodation_info);
  const [serviceInfoModalContents, setServiceInfoModalContents] = useState({
    visible: false,
    contents: {
      contact: '',
      site: '',
      kakao_chat: '',
    },
    mode: '',
  });
  const [peakSeasonModalContents, setPeakSeasonModalContents] = useState<PeakSeasonModalContentsType>({
    visible: false,
    data: [],
    mode: '',
  });
  const [orderContents, setOrderContents] = useState<orderContents>({
    visible: false,
    list: [],
    title: '',
  });

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
      if (target_idx == 0) {
        setAddRoomModalContents();
      } else if ([1, 3].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 2) {
        setPostcodeVisible(true);
      } else if (target_idx == 4) {
        setUploadModal();
      } else if (target_idx == 5) {
        const service_data = {
          contact: target.contact,
          site: target.site,
          kakao_chat: target.kakao_chat,
        };
        setServiceInfoModal(service_data, 'edit');
      } else if (target_idx == 6) {
        setOrderModalContents();
      } else if (target_idx == 7) {
        setPeakSeasonModal(target.peak_season, 'edit');
      } else if (target_idx == 8) {
        modal_confirm.openModalConfirm(`정말 [${target.label}] 업소를 삭제하시겠습니까?`, () =>
          deleteAccommodation(target.id),
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
      } else if (data.clicked_row_button_key == 'peak_season') {
        setPeakSeasonModal(target.peak_season, 'read');
      } else if (data.clicked_row_button_key == 'service_info') {
        const service_info_data = {
          contact: target.contact,
          site: target.site,
          kakao_chat: target.kakao_chat,
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
    modal_image_detail.openModalImageDetail('accommodation', image_list);
  };

  const deleteAccommodation = async (id: number) => {
    const response = await fetchDeleteApi(`/manager/1/accommodation/${id}`);
    if (response == 200) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };

  const setPeakSeasonModal = (data: PeakSeasonType[], mode: string) => {
    const tmp_season_data: string[][] = [];
    for (const x of data) {
      tmp_season_data.push([x.start, x.end]);
    }

    setPeakSeasonModalContents({
      visible: true,
      data: tmp_season_data,
      mode,
    });
  };

  const setServiceInfoModal = (info: ServiceInfoType, mode: string) => {
    setServiceInfoModalContents({
      visible: true,
      contents: info,
      mode: mode,
    });
  };

  const updatePeakSeason = async (season_data: { start: string; end: string }[]) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/manager/1/accommodation/${target.id}/season`, {
        season: season_data,
      });
      if (update_res) {
        getTableItems();
        clearPeakSeasonModal();
        modal_alert.openModalAlert('성수기 기간이 변경되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
      }
    }
  };

  const updateServiceInfo = async (service_info: ServiceInfoType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/manager/1/accommodation/${target.id}/service`, {
        service_info,
      });
      if (update_res) {
        getTableItems();
        clearServiceInfoModal();
        modal_alert.openModalAlert('문의 정보가 변경되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패되었습니다.');
      }
    }
  };

  const clearPeakSeasonModal = () => {
    setPeakSeasonModalContents({
      visible: false,
      data: [],
      mode: '',
    });
  };

  const clearServiceInfoModal = () => {
    setServiceInfoModalContents({
      visible: false,
      contents: {
        contact: '',
        site: '',
        kakao_chat: '',
      },
      mode: '',
    });
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
      const new_images = await setImageArray(images, true, 'accommodation');
      modal_upload.openModalUpload('대표 이미지 수정', 'accommodation', new_images, target.id);
    }
  };

  const setAddRoomModalContents = () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      setAddRoomContents({
        ...addRoomContents,
        visible: true,
        rooms_num: target.rooms_num,
      });
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
      } else {
        setAddRoomContents({ ...addRoomContents, upload_idx: target_idx });
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

    if (target) {
      switch (index) {
        case 1:
          value = target.label;
          title = '업소명 수정';
          target_string = 'label';
          break;
        case 3:
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
      let url = `/manager/1/accommodation/${target.id}`;

      const status = await fetchPatchApi(url, { target: target_string, value });

      if (status == 200) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const addRoom = async (rooms: AddRoomContentsType[]) => {
    const target = data.table_items.find(item => item.checked);

    if (target) {
      const add_room_data = rooms.map(room => {
        return {
          label: room.label,
          standard_num: room.standard_num,
          maximum_num: room.maximum_num,
          normal_price: Number(room.normal_price),
          normal_weekend_price: Number(room.normal_weekend_price),
          peak_price: Number(room.peak_price),
          peak_weekend_price: Number(room.peak_weekend_price),
          accommodation_id: target.id,
        };
      });

      let rooms_payload = [];
      const res_rooms: RoomType[] = await fetchPostApi(`/manager/1/accommodation/${target.id}/rooms`, add_room_data);
      for (const room of rooms) {
        const target_room = res_rooms.find(room_item => room_item.label == room.label);
        let room_images = [];
        for (const room_item of room.image_list) {
          if (room_item.file) room_images.push(room_item.file);
        }
        if (target_room) {
          rooms_payload.push({ target_id: target_room.id, files: room_images });
        }
      }

      const rooms_image_data = await setImageFormData(rooms_payload, 'rooms', target.id);
      const upload_rooms_response = await fetchFileApi('/upload/image', rooms_image_data);
      if (res_rooms.length > 0 && upload_rooms_response.length > 0) {
        modal_alert.openModalAlert('객실 등록이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 객실 등록이 실패되었습니다.');
      }
      setAddRoomContents({
        visible: false,
        rooms_num: 0,
        upload_idx: null,
      });
      getTableItems();
    }
  };

  const getTableItems = async (list?: AccommodationListType) => {
    let count = 0;
    let rows = [];
    if (list) {
      count = list.count;
      rows = list.rows;
    } else {
      const accommodation: AccommodationListType = await fetchGetApi(`/manager/1/accommodation?page=${data.per_page}`);

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
        contact: x.contact,
        site: x.site,
        kakao_chat: x.kakao_chat,
        peak_season: x.accommodation_peak_season,
        rooms: x.accommodation_rooms,
        rooms_num: x.accommodation_rooms.length,
        created_at: getDate(x.createdAt),
        images: x.accommodation_images,
        checked: false,
      });
    }

    console.log(tmp_table_items);
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

      const response = await fetchPostApi(`/manager/1/accommodation/${target.id}/rooms/order`, change_data);
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

  const updateAddress = async (address: ResponsePostcodeDataType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await await fetchPostApi(`/manager/1/accommodation/${target.id}/address`, { address });
      if (update_res) {
        getTableItems();
        setPostcodeVisible(false);
        modal_alert.openModalAlert('주소가 변경되었습니다.');
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
      <ModalAddRoom
        visible={addRoomContents.visible}
        rooms_num={addRoomContents.rooms_num}
        upload_idx={addRoomContents.upload_idx}
        onClose={() => setAddRoomContents({ visible: false, rooms_num: 0, upload_idx: null })}
        onAddRoom={addRoom}
        onChangeImage={() => setAddRoomContents({ ...addRoomContents, upload_idx: null })}
      />
      <ModalPostcodeForm
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={(address: ResponsePostcodeDataType) => updateAddress(address)}
      />
      <ModalPeakSeason
        visible={peakSeasonModalContents.visible}
        data={peakSeasonModalContents.data}
        mode={peakSeasonModalContents.mode}
        onUpdateSeason={updatePeakSeason}
        onClose={clearPeakSeasonModal}
      />
      <ModalServiceInfo
        visible={serviceInfoModalContents.visible}
        contents={serviceInfoModalContents.contents}
        mode={serviceInfoModalContents.mode}
        type='accommodation'
        onUpdateInfo={updateServiceInfo}
        onClose={clearServiceInfoModal}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data: AccommodationListType = await fetchGetApi(`/manager/1/accommodation`);

  return {
    props: {
      list: data,
    },
  };
};

export default ManageAccommodationInfo;
