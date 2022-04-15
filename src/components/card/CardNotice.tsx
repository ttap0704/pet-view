import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const NoticeBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  padding: '1rem',
  backgroundColor: theme.palette.gray_6.main,
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
  color: theme.palette.gray_1.main,
  fontSize: '0.9rem',
}));

function CardNotice(props: { contents: string[] }) {
  const contents = props.contents;
  return (
    <NoticeBox>
      <ListBox>
        {contents.map(item => {
          return <ListItem>{item}</ListItem>;
        })}
      </ListBox>
    </NoticeBox>
  );
}

export default CardNotice;
