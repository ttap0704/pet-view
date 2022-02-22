import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ModalDefaultProps {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  bottom: boolean;
  white: boolean;
}

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  height: 'auto',
}));

function ModalDefault(props: ModalDefaultProps) {
  const visible = props.visible;
  const children = props.children;
  const onClose = props.onClose;
  const bottom = props.bottom;
  const white = props.white;

  return (
    <Modal open={visible} onClose={onClose} BackdropProps={{ style: white ? { backgroundColor: 'transparent' } : {} }}>
      <ModalBox sx={{ top: bottom ? '75%' : '50%' }}>{children}</ModalBox>
    </Modal>
  );
}

export default ModalDefault;
