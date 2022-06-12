import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Dropdown from '../dropdown/Dropdown';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const CustomBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  '.MuiPaper-root': {
    transition: '0.35s',
    backgroundColor: theme.palette.orange.main,
    boxShadow: 'none',
  },

  '&.sticky': {
    '.MuiPaper-root': {
      backgroundColor: theme.palette.white.main,
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',

      '.MuiToolbar-root': {
        '.MuiBox-root': {
          color: theme.palette.orange.main,
          'a, button': {
            color: theme.palette.orange.main,
          },
        },
      },
    },
  },
}));

const LogoBox = styled(Box)(() => ({
  width: '10%',
}));

const MenuBox = styled(Box)(({ theme }) => ({
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  'a, button': {
    width: 'auto',
    padding: '0.75rem 1rem',
    color: theme.palette.white.main,
    backgroundColor: 'transparent',

    '&:hover, &:focus': {
      backgroundColor: 'unset',
    },
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
  const user = useSelector((state: RootState) => state.userReducer);

  const [sticky, setSticky] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  }, []);

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
        label: '더보기',
        path: '',
        children: ['후원하기', '관리자'],
      },
    ];

    const moveMorePage = (idx: number) => {
      if (idx == 0) {
      } else {
        if (user && Number(user.uid) > 0) {
          router.push('/admin');
        } else {
          router.push('/admin/login');
        }
      }
    };

    return (
      <>
        {header_items.map((item, idx) => {
          if (!item.children) {
            return (
              <Link href={item.path} key={`header_menu_${idx}`}>
                {item.label}
              </Link>
            );
          } else {
            return (
              <Dropdown
                items={item.children}
                title='더보기'
                buttonDisabled={false}
                onClick={moveMorePage}
                key={`header_menu_${idx}`}
              />
            );
          }
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
