import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const NoticeBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  padding: '1rem',
  borderRadius: 6,
  border: '1px solid',
  borderColor: theme.palette.gray_6.main,
}));

const ListBox = styled('ul')(({ theme }) => ({
  width: '100%',
  height: 'auto',
}));

const ListItem = styled('li')(({ theme }) => ({
  width: '100%',
  listStyle: 'inside',
  color: theme.palette.black.main,
  fontSize: '0.95rem',

  a: {
    fontSize: '0.95rem',
    textDecoration: 'underline',
  },
}));

function CardNotice(props: { contents: (string | React.ReactElement)[] }) {
  const contents = props.contents;
  return (
    <NoticeBox>
      <ListBox>
        {contents.map((item, item_idx) => {
          return <ListItem key={`card_notice_list_${item_idx}`}>{item}</ListItem>;
        })}
      </ListBox>
    </NoticeBox>
  );
}

export default CardNotice;
