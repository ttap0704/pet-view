import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';

const ModalCheckContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '27.5rem',
  height: 'auto',
  padding: '1rem',
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '1rem',
}));

const ModalCheckContentsTitleBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '100%',
  height: '7rem',
  color: theme.palette.black.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  p: {
    whiteSpace: 'pre-wrap',
  },
}));

interface ModalCheckContentsProps {
  visible: boolean;
  contents: string;
  onClose: () => void;
}

function ModalCheckContents(props: ModalCheckContentsProps) {
  const visible = props.visible;
  const contents = props.contents;
  const onClose = props.onClose;

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ModalCheckContentsBox>
          <ModalCheckContentsTitleBox>
            <Typography>{contents}</Typography>
          </ModalCheckContentsTitleBox>
        </ModalCheckContentsBox>
      </ModalDefault>
    </>
  );
}

export default ModalCheckContents;
