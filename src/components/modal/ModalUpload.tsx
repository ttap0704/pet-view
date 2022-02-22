import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import ModalTitle from './ModalTitle';
import { ModalContext } from '../../provider/ModalProvider';
import ImageBox from '../image/ImageBox';
import OrderList from '../common/OrderList';

const ModalUploadBox = styled(Box)(({ theme }) => ({
  width: '50rem',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.orange.main,
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalUploadContents = styled(Box)(({ theme }) => ({
  width: '50rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '2rem 1rem',
}));

function ModalUpload() {
  const { modal_upload } = useContext(ModalContext);

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_upload.data.visible}
        onClose={() => {
          return;
        }}
      >
        <ModalUploadBox>
          <ModalTitle title={modal_upload.data.title} />
          <ModalUploadContents>
            <ImageBox type={modal_upload.data.type} imageList={modal_upload.data.image_list} slide={true} />
            <OrderList data={[{ label: 'test', number: 1 }]} />
          </ModalUploadContents>
        </ModalUploadBox>
      </ModalDefault>
    </>
  );
}

export default ModalUpload;
