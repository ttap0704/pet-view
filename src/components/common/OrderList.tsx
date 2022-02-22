import * as React from 'react';

import { List, ListItem, ListItemIcon, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputOutlined from '../input/InputOutlined';

interface OrderListProps {
  data: {
    label: string;
    number: number;
  }[];
}

const CustomList = styled(List)(({ theme }) => ({
  width: '100%',
  height: '16rem',
  border: '1px solid',
  borderColor: theme.palette.gray_3.main,
  padding: 0,
  borderRadius: 6,
  overflowY: 'auto',

  '.MuiListItem-root': {
    width: '100%',
    height: '4rem',
    backgroundColor: theme.palette.gray_6.main,
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    borderBottom: '1px solid',
    borderColor: theme.palette.gray_5.main,
  },
}));

function OrderList(props: OrderListProps) {
  const list = props.data;

  return (
    <CustomList>
      {list && list.length > 0 ? (
        list.map((item, idx) => {
          return (
            <ListItem key={`order_list_item_${idx}`}>
              <InputOutlined width='10%' value={item.number} />
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
