import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box, BoxProps, styled } from '@mui/material';
import Button from '../button/Button';

interface DrawerDefaultProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchor: 'left' | 'right' | 'top' | 'bottom';
}

function DrawerDefault(props: DrawerDefaultProps) {
  const open = props.open;
  const onClose = props.onClose;
  const children = props.children;
  const anchor = props.anchor;

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
    <SwipeableDrawer anchor={anchor} open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      {children}
    </SwipeableDrawer>
  );
}

export default DrawerDefault;
