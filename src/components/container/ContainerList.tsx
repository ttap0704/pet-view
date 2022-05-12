import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ContainerListProps {
  children: React.ReactNode;
}

const CustomContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '42rem',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  '& > div': {
    width: '100%',
    '&:not(:last-of-type)': {
      marginBottom: '1.5rem',
    },
  },
}));

function ContainerList(props: ContainerListProps) {
  const children = props.children;

  return <CustomContainer>{children}</CustomContainer>;
}

export default ContainerList;
