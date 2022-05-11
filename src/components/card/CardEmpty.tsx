import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const EmptyBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '10rem',
  padding: '1rem',
  borderRadius: 6,
  border: '1px solid',
  borderColor: theme.palette.gray_3.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
}));

function CardEmpty() {
  return <EmptyBox>등록된 장소가 없습니다.</EmptyBox>;
}

export default CardEmpty;
