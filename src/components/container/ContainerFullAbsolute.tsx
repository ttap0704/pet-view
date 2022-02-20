import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FullAbsoluteContainerProps {
  children: React.ReactNode;
}

const CustomBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function FullAbsoluteContainer(props: FullAbsoluteContainerProps) {
  const children = props.children;

  return <CustomBox>{children}</CustomBox>;
}

export default FullAbsoluteContainer;
