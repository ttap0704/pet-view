import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';

const ModalConfirmBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '27.5rem',
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
  height: '7rem',
  color: theme.palette.black.main,
  display: 'flex',
  flexDirection: 'column',
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

const NoticeTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.orange.main,
}));

function ModalConfirm() {
  const { modal_confirm } = useContext(ModalContext);

  const cancelConfrim = () => {
    if (modal_confirm.cancelModalConfirm) {
      modal_confirm.cancelModalConfirm();
    }
    modal_confirm.closeModalConfirm();
  };

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
            {modal_confirm.data.title.indexOf('삭제') >= 0 ? (
              <NoticeTypography sx={{ fontSize: '0.9rem' }}>(삭제된 데이터는 복구되지 않습니다.)</NoticeTypography>
            ) : null}
          </ModalConfirmTitleBox>
          <ModalConfirmButtonBox>
            <Button className='fill' onClick={modal_confirm.checkModalConfirm}>
              확인
            </Button>
            <Button className='fill' color='gray_1' onClick={cancelConfrim}>
              취소
            </Button>
          </ModalConfirmButtonBox>
        </ModalConfirmBox>
      </ModalDefault>
    </>
  );
}

export default ModalConfirm;
