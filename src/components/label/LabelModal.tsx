import * as React from 'react';
import { useContext } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RiCloseCircleFill } from 'react-icons/ri';

interface LabelModalProps {
  title: string;
  onClose: () => void;
}

const LabelModalBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: theme.palette.gray_4.main,
  padding: '0 1rem',

  '.MuiIconButton-root': {
    svg: {
      width: '1.5rem',
      height: '1.5rem',
    },
  },
}));

function LabelModal(props: LabelModalProps) {
  const title = props.title;
  const onClose = props.onClose;

  return (
    <LabelModalBox>
      <Typography component='h3'>{title}</Typography>
      <IconButton onClick={onClose}>
        <RiCloseCircleFill />
      </IconButton>
    </LabelModalBox>
  );
}

export default LabelModal;
