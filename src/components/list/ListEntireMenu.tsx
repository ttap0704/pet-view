import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RiCloseCircleFill } from 'react-icons/ri';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import InputOutlined from '../input/InputOutlined';

interface ListContents extends AddEntireMenuContentsType {
  visible: boolean;
}

interface ListEntireMenuProps {
  entireMenu: AddEntireMenuContentsType[];
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    idx: number,
    children_type?: string,
    children_idx?: number,
  ) => void;
  onAddMenu?: (idx: number) => void;
  onDeleteMenu?: (idx: number, children?: number) => void;
  mode: string;
  type?: string;
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

  '&.hide': {
    display: 'block',
    height: '3rem',
    overflowY: 'hidden',
  },
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
  const type = props.type;

  const [entireMenu, setEntireMenu] = useState<ListContents[]>([]);
  useEffect(() => {
    const tmp_entire_menu = entire_menu.map(item => {
      return {
        ...item,
        visible: false,
      };
    });

    setEntireMenu(tmp_entire_menu);
  }, [entire_menu]);

  const setVisibleCategory = (idx: number) => {
    const tmp_entire_menu = [...entireMenu];
    tmp_entire_menu[idx].visible = !tmp_entire_menu[idx].visible;
    setEntireMenu([...tmp_entire_menu]);
  };

  return (
    <MenuBox>
      {entireMenu.map((category, category_idx) => {
        return (
          <ListParentBox
            key={`category_${category_idx}`}
            className={mode != 'add' && !category.visible ? 'hide' : 'view'}
          >
            <ContentsBox>
              {mode == 'add' ? (
                <InputOutlined
                  readOnly={type == 'entire_menu' ? true : false}
                  value={category.category}
                  className='none'
                  height='2rem'
                  placeholder='카테고리를 입력해주세요.'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange ? onChange(e, 'category', category_idx) : false;
                  }}
                />
              ) : (
                <Typography sx={{ paddingLeft: '1rem' }}>{category.category}</Typography>
              )}

              {mode == 'add' && type == 'category' ? (
                <>
                  <CustomIconButton
                    onClick={() => {
                      onAddMenu ? onAddMenu(category_idx) : false;
                    }}
                  >
                    <HiOutlinePlusCircle />
                  </CustomIconButton>
                  <CustomIconButton
                    onClick={() => {
                      onDeleteMenu ? onDeleteMenu(category_idx) : false;
                    }}
                  >
                    <RiCloseCircleFill />
                  </CustomIconButton>
                </>
              ) : (
                <Box sx={{ paddingRight: '0.5rem' }}>
                  <CustomIconButton
                    onClick={() => {
                      setVisibleCategory(category_idx);
                    }}
                  >
                    {category.visible ? <FaChevronUp /> : <FaChevronDown />}
                  </CustomIconButton>
                </Box>
              )}
            </ContentsBox>
            {category.menu.map((menu, menu_idx) => {
              return (
                <ListChildrenBox key={`category_${category_idx}_menu_${menu_idx}`}>
                  <ContentsBox>
                    {mode == 'add' ? (
                      <>
                        <InputOutlined
                          value={menu.label}
                          className='none'
                          width='40%'
                          height='2rem'
                          placeholder='메뉴를 입력해주세요.'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChange ? onChange(e, 'menu', category_idx, 'label', menu_idx) : false
                          }
                        />
                        <ContentsBox sx={{ width: '40%', justifyContent: 'flex-end' }}>
                          <InputOutlined
                            value={menu.price}
                            className='none'
                            width='70%'
                            endAdornment='원'
                            height='2rem'
                            format='price'
                            placeholder='가격을 입력해주세요.'
                            align='right'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              onChange ? onChange(e, 'menu', category_idx, 'price', menu_idx) : false
                            }
                          />
                          {mode == 'add' ? (
                            <CustomIconButton
                              onClick={() => (onDeleteMenu ? onDeleteMenu(category_idx, menu_idx) : false)}
                            >
                              <RiCloseCircleFill />
                            </CustomIconButton>
                          ) : null}
                        </ContentsBox>
                      </>
                    ) : (
                      <>
                        <Typography sx={{ paddingLeft: '1rem' }}>{menu.label}</Typography>
                        <Typography sx={{ paddingRight: '1rem' }}>{Number(menu.price).toLocaleString()} 원</Typography>
                      </>
                    )}
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
