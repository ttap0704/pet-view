import Link from 'next/link';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { RiCloseCircleFill } from 'react-icons/ri';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import InputOutlined from '../input/InputOutlined';

interface ListEntireMenuProps {
  entireMenu: AddEntireMenuContentsType[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    idx: number,
    children_type?: string,
    children_idx?: number,
  ) => void;
  onAddMenu: (idx: number) => void;
  onDeleteMenu: (idx: number, children?: number) => void;
  mode: string;
}

const MenuBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',

  '& > div:not(:last-of-type)': {
    borderBottom: 0,
  },
}));

const ListParentBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  backgroundColor: theme.palette.gray_6.main,
  border: '1px solid',
  borderColor: theme.palette.gray_5.main,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ListChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '3rem',
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 0 0 1.5rem',
}));

const ContentsBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  width: '2.125rem',
  height: '2.125rem',
  svg: {
    width: '100%',
    height: '100%',
  },
}));

const ListEntireMenu = (props: ListEntireMenuProps) => {
  const entire_menu = props.entireMenu;
  const onChange = props.onChange;
  const onAddMenu = props.onAddMenu;
  const onDeleteMenu = props.onDeleteMenu;
  const mode = props.mode;

  return (
    <MenuBox>
      {entire_menu.map((category, category_idx) => {
        return (
          <ListParentBox key={`category_${category_idx}`}>
            <ContentsBox>
              <InputOutlined
                readOnly={mode == 'read' ? true : false}
                value={category.category}
                className='none'
                height='2rem'
                placeholder='카테고리를 입력해주세요.'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, 'category', category_idx)}
              />
              {mode == 'add' ? (
                <>
                  <CustomIconButton onClick={() => onAddMenu(category_idx)}>
                    <HiOutlinePlusCircle />
                  </CustomIconButton>
                  <CustomIconButton onClick={() => onDeleteMenu(category_idx)}>
                    <RiCloseCircleFill />
                  </CustomIconButton>
                </>
              ) : null}
            </ContentsBox>
            {category.menu.map((menu, menu_idx) => {
              return (
                <ListChildrenBox key={`category_${category_idx}_menu_${menu_idx}`}>
                  <ContentsBox>
                    <InputOutlined
                      readOnly={mode == 'read' ? true : false}
                      value={menu.label}
                      className='none'
                      width='40%'
                      height='2rem'
                      placeholder='메뉴를 입력해주세요.'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e, 'menu', category_idx, 'label', menu_idx)
                      }
                    />
                    <ContentsBox sx={{ width: '40%', justifyContent: 'flex-end' }}>
                      <InputOutlined
                        readOnly={mode == 'read' ? true : false}
                        value={menu.price}
                        className='none'
                        width='70%'
                        endAdornment='원'
                        height='2rem'
                        placeholder='가격을 입력해주세요.'
                        align='right'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange(e, 'menu', category_idx, 'price', menu_idx)
                        }
                      />
                      {mode == 'add' ? (
                        <>
                          <CustomIconButton onClick={() => onDeleteMenu(category_idx, menu_idx)}>
                            <RiCloseCircleFill />
                          </CustomIconButton>
                        </>
                      ) : null}
                    </ContentsBox>
                  </ContentsBox>
                </ListChildrenBox>
              );
            })}
          </ListParentBox>
        );
      })}
    </MenuBox>
  );
};

export default ListEntireMenu;
