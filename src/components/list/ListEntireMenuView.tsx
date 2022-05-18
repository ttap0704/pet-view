import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface ListEntireMenuViewProps {
  entireMenu: AddEntireMenuContentsType[];
}

const TitleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  height: '3rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: '500',
  svg: {
    width: '1.2rem',
    height: '1.2rem',
  },
}));

const ContentsBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '3rem',
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'space-between',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 4,
}));

const MenuContents = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '1rem 0',
  borderTop: '1px solid',
  borderColor: theme.palette.gray_5.main,
}));

const ListUl = styled('ul')(({ theme }) => ({
  width: '100%',
  minHeight: '3rem',
  '&:not(:last-of-type)': {
    marginBottom: '0.5rem',
  },
}));

const ListLi = styled('li')(({ theme }) => ({
  width: '100%',
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  listStyleType: 'circle',
  listStylePosition: 'inside',

  '&:first-of-type': {
    marginTop: '0.125rem',
  },
}));

const ListEntireMenuView = (props: ListEntireMenuViewProps) => {
  const entire_menu = props.entireMenu;
  const [entireMenu, setEntireMenu] = useState<AddEntireMenuContentsType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEntireMenu([...entire_menu]);
  }, [entire_menu]);

  return (
    <ContentsBox>
      <TitleBox onClick={() => setOpen(!open)}>
        {open ? (
          <>
            접기 <HiChevronUp />
          </>
        ) : (
          <>
            펼쳐보기 <HiChevronDown />
          </>
        )}
      </TitleBox>

      {open ? (
        <MenuContents>
          {entireMenu.map((category, category_idx) => {
            return (
              <ListUl key={`category_${category_idx}`}>
                <Typography component='span'>{category.category}</Typography>
                {category.menu.map((menu, menu_idx) => {
                  return (
                    <ListLi key={`category_${category_idx}_menu_${menu_idx}`}>
                      <Typography>
                        {menu_idx + 1}. {menu.label}
                      </Typography>
                      <Typography>{Number(menu.price).toLocaleString()} 원</Typography>
                    </ListLi>
                  );
                })}
              </ListUl>
            );
          })}
        </MenuContents>
      ) : null}
    </ContentsBox>
  );
};

export default ListEntireMenuView;
