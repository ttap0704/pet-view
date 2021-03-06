import React from 'react';

import { Box } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ModalContext } from '../../../src/provider/ModalProvider';
import { getDate, setFileToImage, setImageFormData } from '../../../src/utils/tools';
import { fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import validation from '../../../src/utils/validation';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import ImageBox from '../../../src/components/image/ImageBox';
import Button from '../../../src/components/button/Button';
import ButtonUpload from '../../../src/components/button/ButtonUpload';
import UtilBox from '../../../src/components/common/UtilBox';
import FormPostcode from '../../../src/components/form/FormPostcode';
import FormAddRoom from '../../../src/components/form/FormAddRoom';
import Textarea from '../../../src/components/textarea/Textarea';
import ChevronDivder from '../../../src/components/common/ChevronDivder';
import InputOutlined from '../../../src/components/input/InputOutlined';
import FormPeakSeason from '../../../src/components/form/FormPeakSeason';
import FormServiceInfo from '../../../src/components/form/FormServiceInfo';

import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalRoomPrice from '../../../src/components/modal/ModalRoomPrice';
import ModalRoomTime from '../../../src/components/modal/ModalRoomTime';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import ModalRadio from '../../../src/components/modal/ModalRadio';

const AdminAccommodationRegistration = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { modal_upload, modal_confirm, modal_alert, modal_notice } = useContext(ModalContext);
  const router = useRouter();

  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [peakSeason, setPeakSeason] = useState<string[][]>([
    ['07-15', '08-24'],
    ['12-20', '02-20'],
  ]);
  const [address, setAddress] = useState<FinalPostcodeDataType>({
    zonecode: '',
    sido: '',
    sigungu: '',
    bname: '',
    road_address: '',
    building_name: '',
    detail_address: '',
  });
  const [radioContents, setRadioContents] = useState<RadioModalContentsDataType>({
    visible: false,
    title: '???????????? ??????',
    contents: [
      {
        label: '??????',
        id: 1,
      },
      {
        label: '??????/?????????',
        id: 2,
      },
      {
        label: '??????/?????????',
        id: 3,
      },
      {
        label: '??????',
        id: 4,
      },
    ],
  });

  const [accommodationLabel, setAccommodationLabel] = useState('');
  const [accommodationType, setAccommodationType] = useState({
    type: 0,
    value: '',
  });
  const [introduction, setIntroduction] = useState('');
  const [serviceInfo, setServiceInfo] = useState<ServiceInfoType>({
    contact: '',
    site: '',
    kakao_chat: '',
  });
  const [savedRoomsTime, setSavedRoomsTime] = useState({
    all: false,
    contents: {
      entrance: '',
      leaving: '',
    },
  });
  const [roomTimeContents, setRoomTimeContents] = useState({
    visible: false,
    contents: {
      entrance: '',
      leaving: '',
    },
    current_room_idx: 0,
  });
  const [roomPriceContents, setRoomPriceContents] = useState({
    visible: false,
    contents: {
      normal_price: '',
      normal_weekend_price: '',
      peak_price: '',
      peak_weekend_price: '',
    },
    current_room_idx: 0,
  });
  const [rooms, setRooms] = useState<AddRoomContentsType[]>([
    {
      label: '',
      normal_price: '',
      normal_weekend_price: '',
      peak_price: '',
      peak_weekend_price: '',
      standard_num: '',
      maximum_num: '',
      image_list: [],
      entrance: '',
      leaving: '',
    },
  ]);

  const setPrevieImages = () => {
    if (modal_upload.data.type == 'rooms') {
      setRooms(state => {
        return [
          ...state.map((room, idx) => {
            if (idx == modal_upload.data.target_idx) {
              return {
                ...room,
                image_list: modal_upload.data.image_list,
                cur_num: 0,
              };
            } else {
              return room;
            }
          }),
        ];
      });
    } else {
      setExposureImages([...modal_upload.data.image_list]);
    }

    modal_upload.closeModalUpload();
  };

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>, type: string, idx: number) => {
    const value = e.target.value;
    setRooms(state => {
      return [
        ...state.map((room, room_idx) => {
          if (room_idx == idx) {
            return {
              ...room,
              [`${type}`]: value,
            };
          } else {
            return room;
          }
        }),
      ];
    });
  };

  const setRoomPriceModal = (idx: number) => {
    const target = rooms[idx];
    setRoomPriceContents({
      visible: true,
      current_room_idx: idx,
      contents: {
        normal_price: target.normal_price,
        normal_weekend_price: target.normal_weekend_price,
        peak_price: target.peak_price,
        peak_weekend_price: target.peak_weekend_price,
      },
    });
  };

  const clearRoomPriceModal = () => {
    setRoomPriceContents({
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

  const setRoomPrice = (data: { [key: string]: number }) => {
    const tmp_rooms = [...rooms];
    tmp_rooms[roomPriceContents.current_room_idx] = { ...tmp_rooms[roomPriceContents.current_room_idx], ...data };
    setRooms([...tmp_rooms]);
    clearRoomPriceModal();
  };

  const setRoomTimeModal = (idx: number) => {
    const target = rooms[idx];
    setRoomTimeContents({
      visible: true,
      current_room_idx: idx,
      contents: {
        entrance: target.entrance,
        leaving: target.leaving,
      },
    });
  };

  const clearRoomTimeModal = () => {
    setRoomTimeContents({
      visible: false,
      current_room_idx: 0,
      contents: {
        entrance: '',
        leaving: '',
      },
    });
  };

  const setRoomTime = (data: { [key: string]: string }, check_all: boolean) => {
    setSavedRoomsTime({
      all: check_all,
      contents: {
        entrance: check_all ? data.entrance : '',
        leaving: check_all ? data.leaving : '',
      },
    });
    const tmp_rooms = [...rooms];
    if (check_all) {
      for (let i = 0, leng = tmp_rooms.length; i < leng; i++) {
        tmp_rooms[i].entrance = data.entrance;
        tmp_rooms[i].leaving = data.leaving;
      }
    } else {
      tmp_rooms[roomPriceContents.current_room_idx] = { ...tmp_rooms[roomPriceContents.current_room_idx], ...data };
    }

    setRooms([...tmp_rooms]);
    clearRoomTimeModal();
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        label: '',
        normal_price: '',
        normal_weekend_price: '',
        peak_price: '',
        peak_weekend_price: '',
        standard_num: '',
        maximum_num: '',
        image_list: [],
        entrance: savedRoomsTime.all ? savedRoomsTime.contents.entrance : '',
        leaving: savedRoomsTime.all ? savedRoomsTime.contents.leaving : '',
      },
    ]);
  };

  const deleteRoom = (idx: number) => {
    const tmp_rooms = [...rooms];
    tmp_rooms.splice(idx, 1);
    setRooms([...tmp_rooms]);
  };

  const addSeason = () => {
    const today = getDate(`${new Date()}`).slice(5, 10);
    setPeakSeason([...peakSeason, [today, today]]);
  };

  const setType = async (item: { label: string; id: number | string }) => {
    setAccommodationType({
      value: item.label,
      type: Number(item.id),
    });
    setRadioContents({ ...radioContents, visible: false });
  };

  const clearSeason = () => {
    setPeakSeason([
      ['07-15', '08-24'],
      ['12-20', '02-20'],
    ]);
  };

  const onChangePeakSeason = (parent_idx: number, children_idx: number, date: string) => {
    const tmp_season = [...peakSeason];
    tmp_season[parent_idx][children_idx] = date;
    setPeakSeason([...tmp_season]);
  };

  const deleteSeason = (parent_idx: number) => {
    const tmp_season = [...peakSeason];
    tmp_season.splice(parent_idx, 1);
    setPeakSeason([...tmp_season]);
  };

  const updateInfo = (key: ServiceContents, value: string) => {
    const tmp_info = { ...serviceInfo };
    tmp_info[key] = value;
    setServiceInfo({ ...tmp_info });
  };

  const validatecreated_ata = () => {
    let alert_message = '';

    let rooms_vali = true;
    for (const room of rooms) {
      const room_image_vali = validation.image_list(room.image_list);
      const room_info_vali = validation.room(room);

      if (!room_image_vali || !room_info_vali) {
        rooms_vali = false;
        break;
      }
    }
    if (!rooms_vali) {
      alert_message = '????????? ?????? ????????? ??????????????????.\r\n????????? ?????? ????????? ?????????????????????.';
    }
    const season_vali = validation.season(peakSeason);
    if (!season_vali) {
      alert_message = '???????????? ????????? ????????????.\r\n???????????? ?????? ??????????????????.';
    }
    const introduction_vali = validation.label(introduction);
    if (!introduction_vali) {
      alert_message = '1??? ????????? ???????????? ????????? ??????????????????.';
    }
    const service_info_vali = validation.service(serviceInfo);
    if (!service_info_vali) {
      alert_message = '1??? ????????? ?????? ????????? ??????????????????.';
    }
    const service_info_concact_vali = validation.number(serviceInfo.contact);
    if (!service_info_concact_vali && serviceInfo.contact.length > 0) {
      alert_message = '?????? ??????????????? ???????????? ??????????????????.';
    }
    const address_vali = validation.address(address);
    if (!address_vali) {
      alert_message = '????????? ????????? ??????????????????.';
    }
    const type_vali = validation.type(accommodationType);
    if (!type_vali) {
      alert_message = '????????? ????????? ??????????????????.';
    }
    const title_vali = validation.label(accommodationLabel);
    if (!title_vali) {
      alert_message = '?????????????????? ??????????????????.';
    }
    const exposure_image_vali = validation.image_list(exposureImages);
    if (!exposure_image_vali) {
      alert_message = '1??? ????????? ?????????????????? ??????????????????.';
    }

    return { pass: alert_message.length == 0, message: alert_message };
  };

  const handleAccommodationType = () => {
    setRadioContents({ ...radioContents, visible: true });
  };

  const createAccommodation = async () => {
    const validate = validatecreated_ata();
    if (!validate.pass) {
      modal_alert.openModalAlert(validate.message, true);
      return;
    }

    const rooms_data = [
      ...rooms.map((room, room_idx) => {
        return {
          label: room.label,
          normal_price: room.normal_price,
          normal_weekend_price: room.normal_weekend_price,
          peak_price: room.peak_price,
          peak_weekend_price: room.peak_weekend_price,
          standard_num: room.standard_num,
          maximum_num: room.maximum_num,
          entrance: room.entrance,
          leaving: room.leaving,
          seq: room_idx,
        };
      }),
    ];

    const tmp_address: { [key: string]: string | null } = {};
    for (const [key, val] of Object.entries(address)) {
      if (val.length > 0) {
        tmp_address[key] = val;
      }
    }

    const tmp_service_info: { [key: string]: string | null } = {};
    for (const [key, val] of Object.entries(serviceInfo)) {
      if (val.length > 0) {
        tmp_service_info[key] = val;
      }
    }

    const accom_data = {
      peak_season: peakSeason.map(item => ({ start: item[0], end: item[1] })),
      rooms: [...rooms_data],
      accommodation: {
        ...tmp_address,
        ...tmp_service_info,
        label: accommodationLabel,
        type: accommodationType.type,
        introduction,
      },
    };

    const accommodation: CreateAccommodationResponse = await fetchPostApi(
      `/admin/${user.uid}/accommodation`,
      accom_data,
    );

    const accommodation_id = accommodation.id;

    const exposure_images = [];
    for (const item of exposureImages) {
      if (item.file) exposure_images.push(item.file);
    }

    const rooms_payload = [];
    for (const room of rooms) {
      const res_room = accommodation.rooms.find(room_item => room_item.label == room.label);
      const room_images = [];
      for (const room_item of room.image_list) {
        if (room_item.file) room_images.push(room_item.file);
      }
      if (res_room) {
        rooms_payload.push({ target_id: res_room.id, files: room_images });
      }
    }

    const exposure_image_data = await setImageFormData(
      [{ target_id: accommodation_id, files: exposure_images }],
      'accommodation',
    );
    const rooms_image_data = await setImageFormData(rooms_payload, 'rooms', accommodation_id);

    const upload_exposure_response = await fetchFileApi('/upload/image', exposure_image_data);
    const upload_rooms_response = await fetchFileApi('/upload/image', rooms_image_data);

    if (upload_exposure_response.length > 0 && upload_rooms_response.length > 0) {
      modal_notice.openModalNotice('??????????????? ??????????????? ?????????????????????.\r\n?????? ???????????? ???????????????.', () => {
        router.push(`/admin/accommodation/info`);
      });
    }
  };

  return (
    <>
      <ContainerRegistrationItem title='??????????????? ??????'>
        <ImageBox slide={true} type='accommodation' imageList={exposureImages} count={true} />
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}>
          <ButtonUpload
            title='??????????????? ??????'
            onClick={() => modal_upload.openModalUpload('?????? ????????? ?????????', 'accommodation', exposureImages, 0)}
          />
        </UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='???????????? ??????'>
        <InputOutlined
          placeholder='?????????????????? ??????????????????.'
          value={accommodationLabel}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAccommodationLabel(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='???????????? ??????'>
        <InputOutlined
          placeholder='???????????? ????????? ??????????????????.'
          value={accommodationType.value}
          onClick={handleAccommodationType}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='?????? ??????'>
        <FormPostcode
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress({ ...address, detail_address: e.target.value })
          }
          onChangeAddress={data => setAddress({ ...address, ...data })}
          address={address}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='???????????? ??????'>
        <FormServiceInfo data={serviceInfo} onChangeInfo={updateInfo} type='accommodation' />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='???????????? ??????'>
        <Textarea
          placeholder='??????????????? ?????? ???????????? ??????????????????.'
          value={introduction}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ChevronDivder />
      <ContainerRegistrationItem title='????????? ??????'>
        <FormPeakSeason data={peakSeason} onDateChange={onChangePeakSeason} onDelete={deleteSeason} />
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem', gap: '0.5rem' }}>
          <Button color='blue' variant='outlined' onClick={clearSeason}>
            ?????? ?????????
          </Button>
          <Button color='blue' variant='contained' onClick={addSeason}>
            ?????? ??????
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='?????? ??????'>
        {rooms.map((room, room_idx) => {
          return (
            <FormAddRoom
              onChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) => handleRoomInput(e, type, room_idx)}
              key={`add_room_form_${room_idx}`}
              room_idx={room_idx}
              imageList={room.image_list}
              mode='edit'
              onClickPriceButton={() => setRoomPriceModal(room_idx)}
              onClickTimeButton={() => setRoomTimeModal(room_idx)}
              contents={room}
              onDelete={deleteRoom}
            />
          );
        })}
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' variant='contained' onClick={addRoom}>
            ?????? ??????
          </Button>
        </UtilBox>
        <UtilBox>
          <Button
            color='orange'
            variant='contained'
            onClick={() => modal_confirm.openModalConfirm(`??????????????? ?????????????????????????`, createAccommodation)}
          >
            ???????????? ??????
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>

      <ModalUpload onUpload={setPrevieImages} />
      <ModalRoomPrice
        visible={roomPriceContents.visible}
        contents={roomPriceContents.contents}
        onClose={() => clearRoomPriceModal()}
        onUpdatePrice={setRoomPrice}
      />
      <ModalRoomTime
        visible={roomTimeContents.visible}
        contents={roomTimeContents.contents}
        onClose={() => clearRoomTimeModal()}
        onUpdateTime={setRoomTime}
      />
      <ModalRadio
        visible={radioContents.visible}
        title={radioContents.title}
        contents={radioContents.contents}
        onClose={() => setRadioContents({ ...radioContents, visible: false })}
        onCompleteUpdate={setType}
      />
    </>
  );
};

export default AdminAccommodationRegistration;
