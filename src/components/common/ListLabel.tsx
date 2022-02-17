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
  height: '5rem',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexDirection: 'column',

  '.title': {
    fontSize: '1.4rem',
  },
  '.subtitle': {
    fontSize: '1.15rem',
  },
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
      </LabelBox>
    </>
  );
};

export default ListLabel;
