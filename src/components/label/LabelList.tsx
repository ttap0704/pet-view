import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface LabelListProps {
  title: string;
  subtitle: string;
}

const LabelBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '4.5rem',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'absolute',
  paddingRight: '1rem',
  bottom: '1rem',
  right: 0,
  color: theme.palette.white.main,
  '.title': {
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  '.subtitle': {
    fontSize: '1.1rem',
  },
}));

const LabelList = (props: LabelListProps) => {
  const title = props.title;
  const subtitle = props.subtitle;
  console.log(title, subtitle);

  return (
    <>
      <LabelBox>
        <Typography className='title'>{title}</Typography>
        <Typography className='subtitle'>{subtitle}</Typography>
      </LabelBox>
    </>
  );
};

export default LabelList;
