import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HiChevronDoubleDown } from 'react-icons/hi';

const DividerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '10rem',
  color: theme.palette.gray_2.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    width: '6rem',
    height: '6rem',
  },
}));

function ChevronDivder() {
  return (
    <DividerContainer>
      <HiChevronDoubleDown />
    </DividerContainer>
  );
}

export default ChevronDivder;
