import * as React from 'react';

import { List, ListItem, ListItemIcon, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputOutlined from '../input/InputOutlined';
import { FaRegImage } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

interface OrderListProps {
  type?: string;
  data: {
    label: string;
    number: string;
    origin: number;
  }[];
  onClick: (idx: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  onComplete: (origin_idx: number) => void;
  onDeleteList: (origin_idx: number) => void;
}

const CustomList = styled(List)(({ theme }) => ({
  width: '100%',
  height: '17rem',
  border: '1px solid',
  borderColor: theme.palette.gray_3.main,
  padding: 0,
  borderRadius: 6,
  overflowY: 'auto',

  '.MuiListItem-root': {
    width: '100%',
    height: '3.2rem',
    backgroundColor: theme.palette.gray_6.main,
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    borderBottom: '1px solid',
    borderColor: theme.palette.gray_5.main,
  },
}));

const ListIconBox = styled(Box)(({ theme }) => ({
  width: '12%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',

  '.MuiListItemIcon-root': {
    width: 'auto',
    minWidth: 'auto',
    svg: {
      width: '1.25rem',
      height: '1.25rem',
    },
  },
}));

const ListLabelBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',

  '.MuiIconButton-root': {
    width: '1.5rem',
    height: '1.5rem',
    padding: 0,
    svg: {
      width: '1.25rem',
      height: '1.25rem',
    },
  },
}));

function OrderList(props: OrderListProps) {
  const list = props.data;
  const type = props.type;
  const onClick = props.onClick;
  const onChange = props.onChange;
  const onComplete = props.onComplete;
  const onDeleteList = props.onDeleteList;

  const icon = type == 'image' ? <FaRegImage /> : null;

  const setInputBlur = (idx: number) => {
    const el = document.getElementById(`order_list_input_${idx}`);
    el?.blur();
  };

  return (
    <CustomList>
      {list && list.length > 0 ? (
        list.map((item, idx) => {
          return (
            <ListItem key={`order_list_item_${idx}`} onClick={() => onClick(idx)} sx={{ cursor: 'pointer' }}>
              {icon != null ? (
                <ListIconBox>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <InputOutlined
                    id={`order_list_input_${idx}`}
                    width='80%'
                    height='2rem'
                    value={item.number}
                    className='bottom'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, idx)}
                    onBlur={() => onComplete(item.origin)}
                    onKeyDownEnter={() => setInputBlur(idx)}
                  />
                </ListIconBox>
              ) : (
                <InputOutlined
                  id={`order_list_input_${idx}`}
                  width='10%'
                  height='2rem'
                  value={item.number}
                  className='bottom'
                  onBlur={() => onComplete(item.origin)}
                  onKeyDownEnter={() => setInputBlur(idx)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, idx)}
                />
              )}
              <ListLabelBox>
                <Typography>{item.label}</Typography>
                <IconButton onClick={() => onDeleteList(item.origin)}>
                  <TiDelete />
                </IconButton>
              </ListLabelBox>
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <Typography sx={{ width: '100%', textAlign: 'center' }}>등록된 아이템이 없습니다.</Typography>
        </ListItem>
      )}
    </CustomList>
  );
}

export default OrderList;
