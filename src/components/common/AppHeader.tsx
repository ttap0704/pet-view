import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '../button/Button';
import Link from 'next/link';

import { styled } from '@mui/material/styles';

const CustomBox = styled(Box)(({ theme }) => ({
  '.MuiPaper-root': {
    backgroundColor: 'var(--orange) !important',
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  width: '10%',
}));

const MenuBox = styled(Box)(({ theme }) => ({
  '.MuiButton-root': {
    padding: '0',
    a: {
      padding: '0.75rem 1.5rem',
    },
  },
}));

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  padding: '0 1rem !important',
  width: '100%',
  maxWidth: '62rem',
  margin: '0 auto !important',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
}));

function AppHeader() {
  return (
    <CustomBox sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <CustomToolbar>
          <LogoBox>logo</LogoBox>
          <MenuBox>
            <Button color='white'>
              <Link href='/manage'>매니지</Link>
            </Button>
          </MenuBox>
        </CustomToolbar>
      </AppBar>
    </CustomBox>
  );
}

export default AppHeader;
