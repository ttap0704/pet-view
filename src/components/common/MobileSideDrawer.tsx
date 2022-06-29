import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box, styled } from '@mui/material';
import Button from '../button/Button';

interface MobileSideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '10rem',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 4,
}));

const MenuBox = styled(Box)(({ theme }) => ({
  width: '80vw',
  padding: '1rem',
  height: '100%',
}));

function MobileSideDrawer(props: MobileSideDrawerProps) {
  const open = props.open;
  const onClose = props.onClose;

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    if (!open) {
      onClose();
    }
  };

  return (
    <SwipeableDrawer anchor='right' open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <MenuBox>
        <ProfileBox>hi</ProfileBox>
        <Button variant='contained' color='orange' sx={{ width: '100%' }}>
          로그인
        </Button>
      </MenuBox>
    </SwipeableDrawer>
  );
}

export default MobileSideDrawer;
