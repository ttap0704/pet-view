import React from 'react';

import { Box } from '@mui/material';
import { useState, useContext, useEffect } from 'react';

import { ModalContext } from '../../../src/provider/ModalProvider';
import { setFileArray } from '../../../src/utils/tools';

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

const ManageAccommodationRegistration = () => {
  const { modal_upload, modal_confirm } = useContext(ModalContext);

  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [regiData, setRegiData] = useState({
    introduction: '',
  });
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
      <ContainerRegistrationItem title='주소 등록'>
        <FormPostcode />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='숙박업소 소개'>
        <Textarea
          placeholder='숙박업소에 대해 자유롭게 작성해주세요.'
          value={regiData.introduction}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setRegiData({ ...regiData, introduction: e.target.value })
          }
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
      </ContainerRegistrationItem>

      <ModalUpload />
    </>
  );
};

export default ManageAccommodationRegistration;
