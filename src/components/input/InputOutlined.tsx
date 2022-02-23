import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBaseComponentProps } from '@mui/material';

interface InputOutlinedProps extends OutlinedInputProps {
  onKeyDownEnter?: () => void;
  width?: string;
  align?: 'center' | 'right';
  bottom?: boolean;
}

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  borderRadius: 6,
  borderColor: theme.palette.gray_4.main,
  padding: '0 1rem 0 0',

  '&.bottom': {
    borderRadius: 0,
    '.MuiOutlinedInput-notchedOutline': {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
    },
  },

  '&:hover': {
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.gray_4.main,
    },
  },

  input: {
    height: '100%',
    paddingRight: '0.5rem',

    '&:read-only': {
      cursor: 'unset',
    },
  },

  svg: {
    width: '1.5rem',
    height: '1.5rem',
    margin: '0 1rem',
  },
}));

const CustomInput = (props: InputOutlinedProps) => {
  const value = props.value;
  const placeholder = props.placeholder;
  const start_adornment = props.startAdornment;
  const end_adornment = props.endAdornment;
  const type = props.type;
  const read_only = props.readOnly;
  const onChange = props.onChange;
  const class_name = props.className;
  const onKeyDownEnter = props.onKeyDownEnter;
  const width = props.width;
  const align = props.align;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'ENTER') onKeyDownEnter ? onKeyDownEnter() : false;
  };

  const setStyle = () => {
    let style: { [key: string]: string | number } = {
      width: '100%',
    };
    if (width) {
      style.width = width;
    }

    return style;
  };

  return (
    <>
      <StyledInput
        className={class_name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        startAdornment={start_adornment}
        endAdornment={end_adornment}
        type={type}
        readOnly={read_only}
        onKeyDown={handleKeyDown}
        sx={{ ...setStyle() }}
        inputProps={{ style: { textAlign: align ? align : 'left' } }}
      />
    </>
  );
};

export default CustomInput;
