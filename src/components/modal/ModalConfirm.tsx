import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';

const ModalConfirmBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '25rem',
  height: 'auto',
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '1rem',
}));

const ModalConfirmTitleBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '100%',
  height: '5rem',
  color: theme.palette.black.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalConfirmButtonBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function ModalConfirm() {
  const { modal_confirm } = useContext(ModalContext);

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_confirm.data.visible}
        onClose={() => modal_confirm.closeModalConfirm()}
      >
        <ModalConfirmBox>
          <ModalConfirmTitleBox>
            <Typography>{modal_confirm.data.title}</Typography>
          </ModalConfirmTitleBox>
          <ModalConfirmButtonBox>
            <Button className='fill' onClick={modal_confirm.checkModalConfirm}>
              확인
            </Button>
            <Button className='fill' color='gray_1' onClick={modal_confirm.closeModalConfirm}>
              취소
            </Button>
          </ModalConfirmButtonBox>
        </ModalConfirmBox>
      </ModalDefault>
    </>
  );
}

export default ModalConfirm;
