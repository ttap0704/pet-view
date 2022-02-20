import { Box } from '@mui/material';
import { useState } from 'react';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import ImageBox from '../../../src/components/image/ImageBox';
import ButtonUpload from '../../../src/components/button/ButtonUpload';
import UtilBox from '../../../src/components/common/UtilBox';
import FormPostcode from '../../../src/components/form/FormPostcode';
import Textarea from '../../../src/components/textarea/Textarea';
import React from 'react';

const ManageAccommodationRegistration = () => {
  const [regiData, setRegiData] = useState({
    introduction: '',
  });
  const test = () => {
    console.log('test');
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
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}></UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='숙박업소 소개'>
        <Textarea
          placeholder='숙박업소에 대해 자유롭게 작성해주세요.'
          value={regiData.introduction}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setRegiData({ ...regiData, introduction: e.target.value })
          }
        />
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}></UtilBox>
      </ContainerRegistrationItem>
    </>
  );
};

export default ManageAccommodationRegistration;
