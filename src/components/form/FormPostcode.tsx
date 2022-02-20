import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

import Button from '../button/Button';
import ModalPostcode from '../modal/ModalPostcode';
import { Box } from '@mui/material';
import InputOutlined from '../input/InputOutlined';

interface FinalPostcodeDataType {
  zonecode: string;
  sido: string;
  sigungu: string;
  bname: string;
  road_address: string;
  building_name: string;
  detail_address: string;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'space-between',
  justifyContent: 'center',
  gap: '0.5rem',
}));

const FormItems = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'row',
  alignContent: 'space-between',
  gap: '1rem',
}));

function PostcodeForm() {
  const [postcodeVisible, setPostcodeVisible] = useState(false);
  const [address, setAddress] = useState<FinalPostcodeDataType>({
    zonecode: '',
    sido: '',
    sigungu: '',
    bname: '',
    road_address: '',
    building_name: '',
    detail_address: '',
  });

  const openModalPostcode = () => {
    setPostcodeVisible(true);
  };

  const setDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, detail_address: e.target.value });
  };

  return (
    <>
      <FormContainer>
        <FormItems>
          <InputOutlined width='70%' readOnly={true} placeholder='우편번호' value={address.zonecode} />
          <Button onClick={openModalPostcode} color='blue' variant='contained'>
            우편번호 검색
          </Button>
        </FormItems>
        <FormItems>
          <InputOutlined readOnly={true} placeholder='주소' value={address.road_address} />
        </FormItems>
        <FormItems>
          <InputOutlined
            width='70%'
            placeholder='상세주소'
            value={address.detail_address}
            onChange={setDetailAddress}
          />
          <InputOutlined width='calc(30% - 1rem)' placeholder='참고항목' readOnly={true} value={address.bname} />
        </FormItems>
      </FormContainer>
      <ModalPostcode
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={data => setAddress({ ...address, ...data })}
      />
    </>
  );
}

export default PostcodeForm;
