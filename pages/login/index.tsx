import Box from '@mui/material/Box';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const LoginBox = styled(Box)(({ theme }) => ({
  width: '60%',
  margin: '0 auto !important',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 6,
}));

const LoginIndex = () => {
  return (
    <>
      <LoginBox>hihi</LoginBox>
    </>
  );
};

export default LoginIndex;
