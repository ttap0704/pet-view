import * as React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomContainerModalContents = styled(Box)(({ theme }) => ({
  width: 'auto',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

function ContainerModalContents(props: { children: React.ReactNode }) {
  const children = props.children;
  return (
    <>
      <CustomContainerModalContents>{children}</CustomContainerModalContents>
    </>
  );
}

export default ContainerModalContents;
