import Box, { BoxProps } from '@mui/material/Box';

import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface LabelDetailTitleProps {
  title: string;
  address: string;
}

const LabelBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '42rem',
  height: '3.5rem',
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
  '.title': {
    fontSize: '1.45rem',
    fontWeight: 'bold',
  },
  '.address': {
    fontSize: '1.05rem',
    color: theme.palette.gray_1.main,
  },
}));

const LabelDetailTitle = (props: LabelDetailTitleProps) => {
  const title = props.title;
  const address = props.address;

  return (
    <>
      <LabelBox>
        <Typography className='title'>{title}</Typography>
        <Typography className='address'>{address}</Typography>
      </LabelBox>
    </>
  );
};

export default LabelDetailTitle;
