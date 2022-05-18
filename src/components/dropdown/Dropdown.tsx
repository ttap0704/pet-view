import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '../button/Button';
import { ButtonProps } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },

    '.MuiList-root': {
      maxHeight: '13rem',
    },
  },
}));

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
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        {items.map((data, index) => {
          return (
            <MenuItem onClick={() => handleItemClick(index)} disableRipple key={`dropdown_item_${data}_${index}`}>
              {data}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};

export default CustomDropdown;
