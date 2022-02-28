import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import ModalDefault from './ModalDefault';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface ModalPostcodeProps {
  visible: boolean;
  onClose: () => void;
  onChangeAddress: (address: ResponsePostcodeDataType) => void;
}

interface PostcodeDataType {
  zonecode: string;
  sido: string;
  sigungu: string;
  bname: string;
  roadAddress: string;
  buildingName: string;
}

const PostcodeConatiner = styled(Box)(({ theme }) => ({
  width: '500px',
  '& > div': {
    height: '445px !important',
  },
}));

const ModalPostcode = (props: ModalPostcodeProps) => {
  const visible = props.visible;
  const onClose = props.onClose;
  const onChangeAddress = props.onChangeAddress;

  const onCompletePost = (data: PostcodeDataType) => {
    const f_data = {
      zonecode: data.zonecode,
      sido: data.sido,
      sigungu: data.sigungu,
      bname: data.bname,
      road_address: data.roadAddress,
      building_name: data.buildingName,
    };

    onChangeAddress(f_data);
    onClose();
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <PostcodeConatiner>
          <DaumPostcode autoClose onComplete={onCompletePost} />
        </PostcodeConatiner>
      </ModalDefault>
    </>
  );
};

export default ModalPostcode;
