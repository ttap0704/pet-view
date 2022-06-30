import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { styled } from '@mui/material';
import { GiDogHouse, GiHamburgerMenu } from 'react-icons/gi';
import { IoBedSharp } from 'react-icons/io5';
import { RiRestaurantFill } from 'react-icons/ri';
import { TbMessage2 } from 'react-icons/tb';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DrawerMobileSideMenu from '../drawer/DrawerMobileSideMenu';

const NavigationWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '5rem',
  position: 'fixed',
  bottom: '-5px',
  borderTop: '1px solid',
  borderColor: theme.palette.gray_6.main,
}));

const NavigationButton = styled(BottomNavigationAction)(({ theme }) => ({
  width: '20%',
  minWidth: 'unset',
  padding: 0,
  svg: {
    width: '1.5rem',
    height: '1.5rem',
  },
  span: {
    fontSize: '0.7rem',
  },

  '&.Mui-selected': {
    color: theme.palette.orange.main,
  },
}));

export default function MobileBottomNavigation() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobile_nav_items = [
    {
      label: 'HOME',
      icon: <GiDogHouse />,
      path: '/',
    },
    {
      label: '숙박업소',
      icon: <IoBedSharp />,
      path: '/accommodation',
    },
    {
      label: '음식점',
      icon: <RiRestaurantFill />,
      path: '/restaurant',
    },
    {
      label: '일상',
      icon: <TbMessage2 />,
      path: '/daily',
    },
    {
      label: '더보기',
      icon: <GiHamburgerMenu />,
      path: null,
    },
  ];

  useEffect(() => {
    const path = router.pathname;
    setCurMenu(path);
  }, [router.pathname]);

  const setCurMenu = (path: string) => {
    let cur_nav_value = 0;
    if (path.includes('accommodation')) {
      cur_nav_value = 1;
    } else if (path.includes('restaurant')) {
      cur_nav_value = 2;
    } else if (path.includes('daily')) {
      cur_nav_value = 3;
    }

    setValue(cur_nav_value);
  };

  const movePage = (path: string | null) => {
    if (path) {
      router.push(path);
    } else {
      setValue(4);
      setDrawerOpen(true);
    }
  };

  return (
    <>
      <NavigationWrapper>
        <BottomNavigation
          showLabels
          value={value}
          // onChange={(event, newValue) => {
          //   console.log(newValue);
          //   setValue(newValue);
          // }}
        >
          {mobile_nav_items.map((nav_item, nav_idx) => {
            return (
              <NavigationButton
                key={`nav_item_${nav_idx}`}
                onClick={() => movePage(nav_item.path)}
                label={nav_item.label}
                icon={nav_item.icon}
                disableRipple
              />
            );
          })}
        </BottomNavigation>
      </NavigationWrapper>
      <DrawerMobileSideMenu
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setCurMenu(router.pathname);
        }}
      />
    </>
  );
}
