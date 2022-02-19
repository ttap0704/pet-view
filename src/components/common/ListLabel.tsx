import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface ListLabelProps {
  title: string;
  subtitle: string;
}

const LabelBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3.5rem',
  paddingRight: '1rem',
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
  '.title': {
    fontSize: '1.3rem',
  },
  '.subtitle': {
    fontSize: '1.05rem',
  },
}));

const DecoBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  height: '100%',
  width: '0.5rem',
  backgroundColor: theme.palette.yellow.main,
}));

const ListLabel = (props: ListLabelProps) => {
  const title = props.title;
  const subtitle = props.subtitle;

  return (
    <>
      <LabelBox>
        <Typography className='title' component='h3'>
          {title}
        </Typography>
        <Typography className='subtitle' component='h4'>
          {subtitle}
        </Typography>
        <DecoBox />
      </LabelBox>
    </>
  );
};

export default ListLabel;
