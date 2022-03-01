import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ConatinerListProps {
  children: React.ReactNode;
}

const CustomContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > div': {
    '&:not(:last-of-type)': {
      marginBottom: '1.5rem',
    },
  },
}));

function ConatinerList(props: ConatinerListProps) {
  const children = props.children;

  return <CustomContainer>{children}</CustomContainer>;
}

export default ConatinerList;
