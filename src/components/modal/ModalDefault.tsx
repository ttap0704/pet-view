import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';

interface ModalDefaultProps {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  bottom: boolean;
  white: boolean;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  height: 'auto',
};

function ModalDefault(props: ModalDefaultProps) {
  const visible = props.visible;
  const children = props.children;
  const onClose = props.onClose;
  const bottom = props.bottom;
  const white = props.white;

  useEffect(() => {
    if (bottom) {
      style.top = '75%';
    } else {
      style.top = '50%';
    }

    console.log(style);
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose} BackdropProps={{ style: white ? { backgroundColor: 'transparent' } : {} }}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}

export default ModalDefault;
