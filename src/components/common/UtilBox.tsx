import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
}));

const UtilBox = (props: BoxProps) => {
  const children = props.children;
  const sx = props.sx;

  const style = {
    justifyContent: Object.prototype.toString.call(children) === '[object Array]' ? 'space-between' : 'center',
  };

  return (
    <>
      <StyledBox style={{ ...style }} sx={sx}>
        {children}
      </StyledBox>
    </>
  );
};

export default UtilBox;
