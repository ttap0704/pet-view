import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBaseComponentProps } from '@mui/material';

interface InputOutlinedProps extends OutlinedInputProps {
  onKeyDownEnter?: () => void;
  width?: string;
  height?: string;
  align?: 'center' | 'right';
  bottom?: boolean;
  format?: string;
}

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
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

  '&.none': {
    '.MuiOutlinedInput-notchedOutline': {
      border: 0,
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
  const onBlur = props.onBlur;
  const class_name = props.className;
  const onKeyDownEnter = props.onKeyDownEnter;
  const width = props.width;
  const height = props.height;
  const align = props.align;
  const id = props.id;
  const format = props.format;

  const [currentValue, setCurrentValue] = useState('');
  const [currentFormat, setCurrentFormat] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter') onKeyDownEnter ? onKeyDownEnter() : false;
  };

  useEffect(() => {
    if (format == 'price') {
      setCurrentFormat('원');
    } else if (format == 'preple') {
      setCurrentFormat('명');
    }
  }, []);
  useEffect(() => {
    if (format == 'price') {
      const cur_value = (value as string).replace(/[\,]/gi, '');
      setCurrentValue(Number(cur_value).toLocaleString());
    } else {
      setCurrentValue(value as string);
    }
  }, [value]);

  const setStyle = () => {
    let style: { [key: string]: string | number } = {
      width: '100%',
      height: '3rem',
    };
    if (width) {
      style.width = width;
    }

    if (height) {
      style.height = height;
    }

    return style;
  };

  return (
    <>
      <StyledInput
        id={id}
        className={class_name}
        value={currentValue ?? ''}
        placeholder={placeholder}
        onChange={onChange}
        startAdornment={start_adornment}
        endAdornment={currentFormat}
        type={type}
        readOnly={read_only}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        sx={{ ...setStyle() }}
        inputProps={{ style: { textAlign: align ? align : 'left' } }}
      />
    </>
  );
};

export default CustomInput;
