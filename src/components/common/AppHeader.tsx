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
import DrawerMobileSideMenu from '../drawer/DrawerMobileSideMenu';
import Button from '../button/Button';

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
  textAlign: 'center',
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

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  height: '4rem',
  '& > div': {
    height: '4rem',
    minHeight: 'unset',
  },
}));

function AppHeader() {
  const user = useSelector((state: RootState) => state.userReducer);

  const [sticky, setSticky] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
        label: '일상',
        path: '/daily',
      },
      {
        label: '더보기',
        path: '',
        children: ['로그인', '공지사항', '일상 공유'],
      },
    ];

    useEffect(() => {
      if (user.uid > 0 && header_items[3].children) {
        header_items[3].children[0] = '내 정보';
        header_items[3].children[3] = '로그아웃';
      }
    }, [user]);

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
              <Button disableRipple onClick={() => setDrawerOpen(true)} key={`header_menu_${idx}`}>
                더보기
              </Button>
            );
          }
        })}
      </>
    );
  };

  return (
    <>
      <CustomBox className={sticky && !user.is_mobile ? 'sticky' : ''}>
        <CustomAppBar position='static'>
          <CustomToolbar sx={{ justifyContent: !user.is_mobile ? 'space-between' : 'center' }}>
            <LogoBox>logo</LogoBox>
            {user.is_mobile ? null : (
              <MenuBox>
                <Menu />
              </MenuBox>
            )}
          </CustomToolbar>
        </CustomAppBar>
      </CustomBox>
      <DrawerMobileSideMenu
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
      />
    </>
  );
}

export default AppHeader;
