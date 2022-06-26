import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

interface SideMenuType {
  [key: string]: { label: string; children: { label: string; path: string }[]; path: string | null };
}

const MenuBox = styled(Box)(({ theme }) => ({
  width: '20vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  borderRight: '1px solid',
  borderColor: theme.palette.gray_4.main,
}));

const SideMenuLogoBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  '.MuiTreeItem-content': {
    height: '3rem',
    '.MuiTreeItem-iconContainer': {
      svg: {
        width: '0.75rem',
        height: '0.75rem',
      },
    },
    '.MuiTreeItem-label': {
      fontSize: '1rem',
    },
  },
}));

const AdminSideMenu = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userReducer);
  const [rootPath, setRootPath] = useState('');

  const [currentSideMenu, setCurrentSideMenu] = useState<SideMenuType>({});
  const admin_side_menu_items: SideMenuType = {
    index: {
      label: '홈',
      children: [],
      path: '/admin',
    },
    accommodation: {
      label: '매장 관리',
      children: [
        {
          label: '숙박업소 등록',
          path: '/admin/accommodation/registration',
        },
        {
          label: '숙박업소 관리',
          path: '/admin/accommodation/info',
        },
        {
          label: '객실 관리',
          path: '/admin/accommodation/room',
        },
      ],
      path: null,
    },
    restaurant: {
      label: '매장 관리',
      children: [
        {
          label: '음식점 등록',
          path: '/admin/restaurant/registration',
        },
        {
          label: '음식점 관리',
          path: '/admin/restaurant/info',
        },
        {
          label: '대표메뉴 관리',
          path: '/admin/restaurant/exposure-menu',
        },
        {
          label: '카테고리 관리',
          path: '/admin/restaurant/category',
        },
        {
          label: '전체메뉴 관리',
          path: '/admin/restaurant/entire-menu',
        },
      ],
      path: null,
    },
    notice: {
      label: '공지사항/이벤트',
      children: [],
      path: '/admin/notice',
    },
    app: {
      label: '사용자 페이지',
      children: [],
      path: '/',
    },
  };

  const super_side_menu_items: SideMenuType = {
    index: {
      label: '홈',
      children: [],
      path: '/super',
    },
    users: {
      label: '유저 관리',
      children: [],
      path: '/super/users',
    },
    report: {
      label: '신고 접수',
      children: [],
      path: '/super/report',
    },
    product: {
      label: '매장 관리',
      children: [
        {
          label: '숙박업소 관리',
          path: '/super/product/accommodation',
        },
        {
          label: '음식점 관리',
          path: '/super/product/restaurant',
        },
      ],
      path: null,
    },
    notice: {
      label: '공지사항',
      children: [
        {
          label: '공지사항 등록',
          path: '/super/notice/registration',
        },
        {
          label: '공지사항 관리',
          path: '/super/notice/manage',
        },
      ],
      path: null,
    },
  };

  useEffect(() => {
    const root_path = router.pathname.split('/')[1];
    setRootPath(root_path);
  }, [router.pathname]);

  useEffect(() => {
    if (rootPath.indexOf('admin') >= 0) {
      if (user && user.type == 1) {
        // delete side_menu_items.accommodation;
      } else if (user.type == 2) {
        delete admin_side_menu_items.restaurant;
      }
      setCurrentSideMenu({ ...admin_side_menu_items });
    } else {
      setCurrentSideMenu({ ...super_side_menu_items });
    }
  }, [user, rootPath]);

  const setTreeItems = () => {
    return Object.keys(currentSideMenu).map((key, idx) => {
      let contents: React.ReactNode | null = null;
      if (currentSideMenu[key].children) {
        contents = currentSideMenu[key].children.map((item2, idx2) => {
          return (
            <CustomTreeItem
              key={`tree_items_${idx}_children_${idx2}`}
              nodeId={`tree_items_${idx}_children_${idx2}`}
              label={item2.label}
              onClick={() => router.push(item2.path)}
            />
          );
        });
      }
      return (
        <CustomTreeItem
          key={`tree_items_${idx}`}
          nodeId={`tree_items_${idx}`}
          label={currentSideMenu[key].label}
          onClick={() => (currentSideMenu[key].path ? router.push(`${currentSideMenu[key].path}`) : false)}
        >
          {contents}
        </CustomTreeItem>
      );
    });
  };

  return (
    <MenuBox>
      <SideMenuLogoBox>Logo</SideMenuLogoBox>
      <TreeView defaultCollapseIcon={<FaChevronDown />} defaultExpandIcon={<FaChevronRight />}>
        {setTreeItems()}
      </TreeView>
    </MenuBox>
  );
};

export default AdminSideMenu;
