import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  borderRadius: 6,
  borderColor: theme.palette.gray_4.main,
  padding: 0,

  input: {
    width: '100%',
    height: '100%',
  },

  svg: {
    width: '1.5rem',
    height: '1.5rem',
    margin: '0 1rem',
  },
}));

const CustomInput = (props: OutlinedInputProps) => {
  const value = props.value;
  const placeholder = props.placeholder;
  const start_adornment = props.startAdornment;
  const end_adornment = props.endAdornment;

  const onChange = props.onChange;

  return (
    <>
      <StyledInput
        className='test'
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        startAdornment={start_adornment}
        endAdornment={end_adornment}
      />
    </>
  );
};

export default CustomInput;
