import React from 'react';

import { Box } from '@mui/material';
import { useState } from 'react';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import ImageBox from '../../../src/components/image/ImageBox';
import Button from '../../../src/components/button/Button';
import ButtonUpload from '../../../src/components/button/ButtonUpload';
import UtilBox from '../../../src/components/common/UtilBox';
import FormPostcode from '../../../src/components/form/FormPostcode';
import FormAddRoom from '../../../src/components/form/FormAddRoom';
import Textarea from '../../../src/components/textarea/Textarea';
import ChevronDivder from '../../../src/components/common/ChevronDivder';

const ManageAccommodationRegistration = () => {
  const [regiData, setRegiData] = useState({
    introduction: '',
  });
  const [rooms, setRooms] = useState([
    {
      label: '',
      price: '',
      standard_num: '',
      maximum_num: '',
    },
  ]);

  const test = () => {
    console.log('test');
  };

  const test11 = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const valye = e.target.value;
    console.log(valye, type);
  };

  return (
    <>
      <ContainerRegistrationItem title='대표이미지 등록'>
        <ImageBox slide={true} type='accommodation' />
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}>
          <ButtonUpload title='대표이미지 등록' onClick={test} />
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
        {/* {rooms.map((rooms, room_idx) => {})} */}
        <FormAddRoom onChange={test11} />;
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' variant='contained'>
            객실 추가
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>
    </>
  );
};

export default ManageAccommodationRegistration;
