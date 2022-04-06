import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import { ModalContext } from '../../provider/ModalProvider';

const ModalNoticeBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  padding: '2rem 4rem',
  border: '4px solid',
  borderColor: theme.palette.orange.main,
  backgroundColor: theme.palette.white.main,
  color: theme.palette.gray_1.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '1rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
}));

function ModalNotice() {
  const { modal_notice } = useContext(ModalContext);

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_notice.data.visible}
        onClose={() => {
          return;
        }}
      >
        <ModalNoticeBox>
          <Typography>{modal_notice.data.title}</Typography>
        </ModalNoticeBox>
      </ModalDefault>
    </>
  );
}

export default ModalNotice;
