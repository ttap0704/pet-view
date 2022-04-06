import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import { ModalContext } from '../../provider/ModalProvider';

const ModalAlertBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: 'auto',
  padding: '2rem 4rem',
  backgroundColor: theme.palette.gray_1.main,
  color: theme.palette.white.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '1rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
}));

function ModalAlert() {
  const { modal_alert } = useContext(ModalContext);

  return (
    <>
      <ModalDefault
        bottom={modal_alert.data.center ? false : true}
        white={true}
        visible={modal_alert.data.visible}
        onClose={() => modal_alert.closeModalAlert()}
      >
        <ModalAlertBox>
          <Typography>{modal_alert.data.title}</Typography>
        </ModalAlertBox>
      </ModalDefault>
    </>
  );
}

export default ModalAlert;
