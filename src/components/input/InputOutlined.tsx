import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBaseComponentProps } from '@mui/material';

interface InputOutlinedProps extends OutlinedInputProps {
  onKeyDownEnter?: () => void;
}

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  borderRadius: 6,
  borderColor: theme.palette.gray_4.main,
  padding: 0,

  input: {
    width: '100%',
    height: '100%',

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'ENTER') onKeyDownEnter ? onKeyDownEnter() : false;
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
      />
    </>
  );
};

export default CustomInput;
