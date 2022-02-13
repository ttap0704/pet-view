import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '../button/Button';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const CustomBox = styled(Box)(() => ({
  position: 'sticky',
  top: 0,
  '.MuiPaper-root': {
    transition: '0.35s',
    backgroundColor: 'var(--orange)',
    boxShadow: 'none',
  },

  '&.sticky': {
    '.MuiPaper-root': {
      backgroundColor: 'var(--white)',
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',

      '.MuiToolbar-root': {
        '.MuiBox-root': {
          color: 'var(--orange)',
        },
      },
    },
  },
}));

const LogoBox = styled(Box)(() => ({
  width: '10%',
}));

const MenuBox = styled(Box)(() => ({
  padding: '0',
  a: {
    padding: '0.75rem 1.5rem',
  },
}));

const CustomToolbar = styled(Toolbar)(() => ({
  padding: '0 1rem !important',
  width: '100%',
  maxWidth: '62rem',
  margin: '0 auto !important',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
}));

function AppHeader() {
  const [sticky, setSticky] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const isSticky = () => {
    const scrollTop = window.scrollY;

    if (scrollTop == 0) {
      setSticky(false);
    } else if (scrollTop != 0 && sticky == false) {
      setSticky(true);
    }
  };

  const Menu = () => {
    const header_items = [
      {
        label: 'HOME',
        path: '/',
      },
      {
        label: '숙박업소',
        path: '/accommodation',
      },
      {
        label: '음식점',
        path: '/restaurant',
      },
      {
        label: '로그인',
        path: '/',
      },
    ];

    return (
      <>
        {header_items.map((item, idx) => {
          return (
            <Link href={item.path} key={`header_menu_${idx}`}>
              {item.label}
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <CustomBox className={sticky ? 'sticky' : ''}>
      <AppBar position='static'>
        <CustomToolbar>
          <LogoBox>logo</LogoBox>
          <MenuBox>
            <Menu />
          </MenuBox>
        </CustomToolbar>
      </AppBar>
    </CustomBox>
  );
}

export default AppHeader;
