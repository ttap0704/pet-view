import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

interface UtilBoxProps extends BoxProps {
  justifyContent?: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '4rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.white.main,
}));

const UtilBox = (props: UtilBoxProps) => {
  const children = props.children;
  const sx = props.sx;
  const justify_content = props.justifyContent;

  const setStyle = () => {
    let style = {
      justifyContent: '',
    };
    if (justify_content) {
      style.justifyContent = justify_content;
    } else {
      style.justifyContent = Object.prototype.toString.call(children) === '[object Array]' ? 'space-between' : 'center';
    }

    return style;
  };

  return (
    <>
      <StyledBox style={{ ...setStyle() }} sx={sx}>
        {children}
      </StyledBox>
    </>
  );
};

export default UtilBox;
