import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import { fetchGetApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { accommodation_info } from '../../../src/utils/admin_items';

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
import { RootState } from '../../../src/store';

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

const AdminAccommodationInfo = () => {
  const user = useSelector((state: RootState) => state.userReducer);
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
    if (user.uid > 0) {
      getTableItems();
      setFirst(true);
    }
  }, [user]);

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
        modal_confirm.openModalConfirm(`?????? [${target.label}] ????????? ?????????????????????????`, () =>
          deleteAccommodation(target.id),
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
      modal_alert.openModalAlert('????????? ???????????? ????????????.');
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
    const response = await fetchPostApi(`/admin/${user.uid}/accommodation/${id}/delete`, {});
    if (response == 200 || response == 204) {
      modal_alert.openModalAlert('????????? ?????????????????????.');
    } else {
      modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
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
      const update_res = await fetchPostApi(`/admin/${user.uid}/accommodation/${target.id}/season`, {
        season: season_data,
      });
      if (update_res) {
        getTableItems();
        clearPeakSeasonModal();
        modal_alert.openModalAlert('????????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
      }
    }
  };

  const updateServiceInfo = async (service_info: ServiceInfoType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/admin/${user.uid}/accommodation/${target.id}/info`, {
        ...service_info,
      });
      if (update_res.affected == 1) {
        getTableItems();
        clearServiceInfoModal();
        modal_alert.openModalAlert('?????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
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
      setOrderContents({ visible: true, list: tmp_list, title: '?????? ?????? ??????' });
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
      modal_upload.openModalUpload('?????? ????????? ??????', 'accommodation', new_images, target.id);
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
        const exposure_images = [];

        const delete_res = await fetchPostApi(`/images/accommodation/${target_idx}/delete`, {});

        for (const item of modal_upload.data.image_list) {
          if (item.file) exposure_images.push(item.file);
        }

        const exposure_image_data = await setImageFormData(
          [{ target_id: target_idx, files: exposure_images }],
          'accommodation',
        );

        const upload_res = await fetchFileApi('/upload/image', exposure_image_data);

        if (upload_res.length > 0) {
          modal_alert.openModalAlert('?????? ????????? ????????? ?????????????????????.');
        } else {
          modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
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
          title = '????????? ??????';
          target_string = 'label';
          break;
        case 3:
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
      const url = `/admin/${user.uid}/accommodation/${target.id}/info`;

      const update_res = await fetchPostApi(url, { [target_string]: value });

      if (update_res.affected == 1) {
        modal_alert.openModalAlert('????????? ?????????????????????.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('????????? ?????? ????????? ?????????????????????.');
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
          entrance: room.entrance,
          leaving: room.leaving,
        };
      });

      const rooms_payload = [];
      const res_rooms: RoomType[] = await fetchPostApi(
        `/admin/${user.uid}/accommodation/${target.id}/rooms`,
        add_room_data,
      );
      for (const room of rooms) {
        const target_room = res_rooms.find(room_item => room_item.label == room.label);
        const room_images = [];
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
        modal_alert.openModalAlert('?????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????? ????????? ?????????????????????.');
      }
      setAddRoomContents({
        visible: false,
        rooms_num: 0,
        upload_idx: null,
      });
      getTableItems();
    }
  };

  const getTableItems = async () => {
    const accommodation: AccommodationListType = await fetchGetApi(
      `/admin/${user.uid}/accommodation?page=${data.per_page}`,
    );

    const count = accommodation.count;
    const rows = accommodation.rows;

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
        contact: x.contact,
        site: x.site,
        kakao_chat: x.kakao_chat,
        peak_season: x.accommodation_peak_season,
        rooms: x.accommodation_rooms,
        rooms_num: x.accommodation_rooms.length,
        created_at: getDate(x.created_at),
        images: x.accommodation_images,
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

      const response = await fetchPostApi(`/admin/${user.uid}/accommodation/${target.id}/rooms/order`, change_data);
      if (response) {
        getTableItems();
        setOrderContents({ visible: false, title: '', list: [] });
        modal_alert.openModalAlert('?????? ????????? ?????????????????????.');
      } else {
        modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
      }
    } else {
      modal_alert.openModalAlert('????????? ?????? ?????????????????????.');
    }
  };

  const updateAddress = async (address: ResponsePostcodeDataType) => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      const update_res = await fetchPostApi(`/admin/${user.uid}/accommodation/${target.id}/info`, {
        ...address,
      });
      if (update_res.affected == 1) {
        getTableItems();
        setPostcodeVisible(false);
        modal_alert.openModalAlert('????????? ?????????????????????.');
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

export default AdminAccommodationInfo;
