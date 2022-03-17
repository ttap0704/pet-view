import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Divider } from '@mui/material';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const MenuBox = styled(Box)(({ theme }) => ({
  width: '20vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  borderRight: '1px solid',
  borderColor: theme.palette.gray_2.main,
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

const ManageSideMenu = () => {
  const router = useRouter();

  const side_menu_items: {
    [key: string]: { label: string; children: { label: string; path: string }[]; path: string | null };
  } = {
    index: {
      label: '관리자 메인',
      children: [],
      path: '/manage',
    },
    accommodation: {
      label: '매장 관리',
      children: [
        {
          label: '숙박업소 등록',
          path: '/manage/accommodation/registration',
        },
        {
          label: '숙박업소 관리',
          path: '/manage/accommodation/info',
        },
        {
          label: '객실 관리',
          path: '/manage/accommodation/room',
        },
      ],
      path: null,
    },
    restaurant: {
      label: '매장 관리',
      children: [
        {
          label: '음식점 등록',
          path: '/manage/restaurant/registration',
        },
        {
          label: '음식점 관리',
          path: '/manage/restaurant/info',
        },
        {
          label: '대표메뉴 관리',
          path: '/manage/restaurant/exposure-menu',
        },
        {
          label: '카테고리 관리',
          path: '/manage/restaurant/category',
        },
        {
          label: '전체메뉴 관리',
          path: '/manage/restaurant/entire-menu',
        },
      ],
      path: null,
    },
  };

  const setTreeItems = () => {
    return Object.keys(side_menu_items).map((key, idx) => {
      let contents: React.ReactNode | null = null;
      if (side_menu_items[key].children) {
        contents = side_menu_items[key].children.map((item2, idx2) => {
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
          label={side_menu_items[key].label}
          onClick={() => (side_menu_items[key].path ? router.push(`${side_menu_items[key].path}`) : false)}
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

export default ManageSideMenu;
