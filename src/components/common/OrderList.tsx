import * as React from 'react';

import { List, ListItem, ListItemIcon, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputOutlined from '../input/InputOutlined';
import { FaRegImage } from 'react-icons/fa';

interface OrderListProps {
  type?: string;
  data: {
    label: string;
    number: number;
  }[];
  onClick: (idx: number) => void;
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

function OrderList(props: OrderListProps) {
  const list = props.data;
  const type = props.type;
  const onClick = props.onClick;

  const icon = type == 'image' ? <FaRegImage /> : null;

  React.useEffect(() => {
    console.log(list);
  }, [list]);

  return (
    <CustomList>
      {list && list.length > 0 ? (
        list.map((item, idx) => {
          return (
            <ListItem key={`order_list_item_${idx}`} onClick={() => onClick(idx)} sx={{ cursor: 'pointer' }}>
              {icon != null ? (
                <ListIconBox>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <InputOutlined width='80%' value={item.number} className='bottom' />
                </ListIconBox>
              ) : (
                <InputOutlined width='10%' value={item.number} className='bottom' />
              )}
              <Typography>{item.label}</Typography>
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <Typography>등록된 아이템이 없습니다.</Typography>
        </ListItem>
      )}
    </CustomList>
  );
}

export default OrderList;
