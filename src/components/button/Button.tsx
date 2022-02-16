import * as React from 'react';

import { Button as MuiButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(MuiButton)(({ theme }) => ({
  boxShadow: 'none',
  fontSize: '1rem',
  '&:hover': {
    boxShadow: 'none',
  },
}));

function Button(props: ButtonProps) {
  const variant = props.variant;
  const color = props.color;
  const children = props.children;
  const startIcon = props.startIcon;
  const endIcon = props.endIcon;
  const sx = props.sx;
  const onClick = props.onClick;
  return (
    <CustomButton variant={variant} color={color} startIcon={startIcon} endIcon={endIcon} sx={sx} onClick={onClick}>
      {children}
    </CustomButton>
  );
}

export default Button;
