import Link from 'next/link';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Divider } from '@mui/material';

import InputOutlined from '../input/InputOutlined';

interface ListEntireMenuProps {
  entireMenu: {
    category: string;
    menu: {
      label: string;
      price: string;
      comment: string;
    }[];
  }[];
}

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const MenuBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  borderColor: theme.palette.gray_2.main,
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

const ListEntireMenu = (prosp: ListEntireMenuProps) => {
  const entire_menu = prosp.entireMenu;

  console.log(entire_menu);

  return (
    <MenuBox>
      <TreeView defaultCollapseIcon={<FaChevronDown />} defaultExpandIcon={<FaChevronRight />}>
        {entire_menu.map((category, category_idx) => {
          return (
            <CustomTreeItem
              key={`tree_items_${category_idx}`}
              nodeId={`tree_items_${category_idx}`}
              label={category.category}
            >
              {category.menu.map((menu, menu_idx) => {
                return (
                  <CustomTreeItem
                    key={`tree_items_${category_idx}_menu_${menu_idx}`}
                    nodeId={`tree_items_${category_idx}_menu_${menu_idx}`}
                    label={menu.label}
                  ></CustomTreeItem>
                );
              })}
            </CustomTreeItem>
          );
        })}
      </TreeView>
    </MenuBox>
  );
};

export default ListEntireMenu;
