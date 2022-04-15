import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface RegistrationItemContainerProps extends BoxProps {
  title: string;
  children: React.ReactNode;
}

const CustomBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '0.5rem',
  marginBottom: '3rem',
}));

const ChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const RegistrationItemContainer = (props: RegistrationItemContainerProps) => {
  const title = props.title;
  const children = props.children;
  const sx = props.sx;

  return (
    <CustomBox>
      <Typography component='h3'>{title}</Typography>
      <ChildrenBox sx={{ ...sx }}>{children}</ChildrenBox>
    </CustomBox>
  );
};

export default RegistrationItemContainer;
