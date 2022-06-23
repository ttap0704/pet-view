import * as React from 'react';
import { useState, useEffect } from 'react';

import Button from '../button/Button';
import { ButtonProps } from '@mui/material';
import DropdownMenu from '../common/DropdownMenu';

interface MenuButtonPropsStateType {
  variant: ButtonProps['variant'];
  color: ButtonProps['color'];
}

interface DropdownProps {
  items: string[];
  buttonDisabled: boolean;
  onClick: (idx: number) => void;
  title?: string;
  variant?: ButtonProps['variant'];
}

const CustomDropdown = (props: DropdownProps) => {
  const items: string[] = props.items;
  const disabled = props.buttonDisabled;
  const title = props.title;
  const variant = props.variant;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuButtonProps, setMenuButtonProps] = useState<MenuButtonPropsStateType>({
    variant: variant ?? 'contained',
    color: 'blue',
  });
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  function handleClose() {
    setAnchorEl(null);
  }

  function handleItemClick(idx: number) {
    props.onClick(idx);
    handleClose();
  }

  return (
    <>
      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant={menuButtonProps.variant}
        disableElevation
        onClick={handleClick}
        disabled={disabled}
        color={menuButtonProps.color}
        disableRipple={true}
      >
        {title ? title : '편집'}
      </Button>
      <DropdownMenu open={open} anchorEl={anchorEl} onClick={handleItemClick} onClose={handleClose} items={items} />
    </>
  );
};

export default CustomDropdown;
