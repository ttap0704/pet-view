import React from 'react';

import { Box } from '@mui/material';
import { useState, useContext, useEffect } from 'react';

import { ModalContext } from '../../../src/provider/ModalProvider';
import { setFileArray, setFileToImage, setImageFormData } from '../../../src/utils/tools';
import { fetchFileApi, fetchPostApi } from '../../../src/utils/api';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import ImageBox from '../../../src/components/image/ImageBox';
import Button from '../../../src/components/button/Button';
import ButtonUpload from '../../../src/components/button/ButtonUpload';
import UtilBox from '../../../src/components/common/UtilBox';
import FormPostcode from '../../../src/components/form/FormPostcode';
import FormAddRoom from '../../../src/components/form/FormAddRoom';
import Textarea from '../../../src/components/textarea/Textarea';
import ChevronDivder from '../../../src/components/common/ChevronDivder';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import InputOutlined from '../../../src/components/input/InputOutlined';

interface CreateAccommodationResponse {
  accommodation_id: number;
  rooms: {
    accommodation_id: number;
    createdAt: string;
    id: number;
    label: string;
    maximum_num: string;
    price: string;
    seq: number;
    standard_num: string;
    updatedAt: string;
  }[];
}

const ManageAccommodationRegistration = () => {
  const { modal_upload, modal_confirm } = useContext(ModalContext);

  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [address, setAddress] = useState<FinalPostcodeDataType>({
    zonecode: '',
    sido: '',
    sigungu: '',
    bname: '',
    road_address: '',
    building_name: '',
    detail_address: '',
  });

  const [accommodationLabel, setAccommodationLabel] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [rooms, setRooms] = useState<AddRoomContentsType[]>([
    {
      label: '',
      price: '',
      standard_num: '',
      maximum_num: '',
      image_list: [],
    },
  ]);

  useEffect(() => {
    if (modal_confirm.data.confirm) {
      switch (modal_confirm.data.target) {
        case 'upload_image':
          setPrevieImages();
          break;
        case 'create_accommodation':
          console.log(modal_confirm.data.target);
          createAccommodation();
          break;
        default:
          break;
      }
    }
  }, [modal_confirm.data.confirm]);

  const setPrevieImages = () => {
    console.log(modal_upload.data.image_list);
    if (modal_upload.data.type == 'room') {
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

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        label: '',
        price: '',
        standard_num: '',
        maximum_num: '',
        image_list: [],
      },
    ]);
  };

  const createAccommodation = async () => {
    const rooms_data = [
      ...rooms.map((room, room_idx) => {
        return {
          label: room.label,
          price: room.price,
          standard_num: room.standard_num,
          maximum_num: room.maximum_num,
          seq: room_idx,
        };
      }),
    ];

    const accom_data = {
      ...address,
      label: accommodationLabel,
      introduction,
      manager: 1,
      rooms: [...rooms_data],
    };
    const accommodation: CreateAccommodationResponse = await fetchPostApi(`/manager/1/accommodation`, accom_data);
    const accommodation_id = accommodation.accommodation_id;

    let exposure_images = [];
    for (const item of exposureImages) {
      if (item.file) exposure_images.push(item.file);
    }

    let rooms_payload = [];
    for (const room of rooms) {
      const res_room = accommodation.rooms.find(room_item => room_item.label == room.label);
      let room_images = [];
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
    console.log(upload_exposure_response);
    console.log(upload_rooms_response);
  };

  return (
    <>
      <ContainerRegistrationItem title='대표이미지 등록'>
        <ImageBox slide={true} type='accommodation' imageList={exposureImages} />
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}>
          <ButtonUpload
            title='대표이미지 등록'
            onClick={() => modal_upload.openModalUpload('대표 이미지 업로드', 'accommodation', exposureImages, 0)}
          />
        </UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='숙박업소 이름'>
        <InputOutlined
          placeholder='숙박업소명을 작성해주세요..'
          value={accommodationLabel}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAccommodationLabel(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='주소 등록'>
        <FormPostcode
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress({ ...address, detail_address: e.target.value })
          }
          onChangeAddress={data => setAddress({ ...address, ...data })}
          address={address}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='숙박업소 소개'>
        <Textarea
          placeholder='숙박업소에 대해 자유롭게 작성해주세요.'
          value={introduction}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ChevronDivder />
      <ContainerRegistrationItem title='객실 등록'>
        {rooms.map((room, room_idx) => {
          return (
            <FormAddRoom
              onChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) => handleRoomInput(e, type, room_idx)}
              key={`add_room_form_${room_idx}`}
              room_idx={room_idx}
              imageList={room.image_list}
            />
          );
        })}
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' variant='contained' onClick={addRoom}>
            객실 추가
          </Button>
        </UtilBox>
        <UtilBox>
          <Button
            color='orange'
            variant='contained'
            onClick={() => modal_confirm.openModalConfirm(`숙박업소를 등록하시겠습니까?`, 'create_accommodation')}
          >
            숙박업소 등록
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>

      <ModalUpload />
    </>
  );
};

export default ManageAccommodationRegistration;
