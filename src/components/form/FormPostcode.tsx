import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

import Button from '../button/Button';
import ModalPostcode from '../modal/ModalPostcode';
import { Box } from '@mui/material';
import InputOutlined from '../input/InputOutlined';

interface PostcodeFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAddress: (data: ResponsePostcodeDataType) => void;
  address: FinalPostcodeDataType;
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

function PostcodeForm(props: PostcodeFormProps) {
  const onChange = props.onChange;
  const onChangeAddress = props.onChangeAddress;
  const address = props.address;

  const [postcodeVisible, setPostcodeVisible] = useState(false);

  return (
    <>
      <FormContainer>
        <FormItems>
          <InputOutlined width='70%' readOnly={true} placeholder='우편번호' value={address.zonecode} />
          <Button onClick={() => setPostcodeVisible(true)} color='blue' variant='contained'>
            우편번호 검색
          </Button>
        </FormItems>
        <FormItems>
          <InputOutlined readOnly={true} placeholder='주소' value={address.road_address} />
        </FormItems>
        <FormItems>
          <InputOutlined width='70%' placeholder='상세주소' value={address.detail_address} onChange={onChange} />
          <InputOutlined width='calc(30% - 1rem)' placeholder='참고항목' readOnly={true} value={address.bname} />
        </FormItems>
      </FormContainer>
      <ModalPostcode
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={data => onChangeAddress(data)}
      />
    </>
  );
}

export default PostcodeForm;
