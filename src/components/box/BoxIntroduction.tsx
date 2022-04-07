import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
  overflowY: 'auto',
  borderRadius: 6,
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  padding: '0.5rem',
  fontSize: '1rem',
  whiteSpace: 'pre-wrap',
}));

function BoxIntroduction(props: { introduction: string }) {
  const introduction = props.introduction;
  return <CustomBox>{introduction}</CustomBox>;
}

export default BoxIntroduction;
