import * as React from 'react';
import { useContext } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';

interface ModalEditprops {
  visible: boolean;
  title: string;
}

const ModalEditBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: 'auto',
  height: '4rem',
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '1rem',
}));

function ModalEdit(props: ModalEditprops) {
  const visible = props.visible;
  const title = props.title;
  return (
    <>
      <ModalDefault
        bottom={false}
        white={true}
        visible={false}
        onClose={() => {
          return;
        }}
      >
        <ContainerModalContents>
          <LabelModal
            title={title}
            onClose={() => {
              return;
            }}
          />
          hihi
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalEdit;
