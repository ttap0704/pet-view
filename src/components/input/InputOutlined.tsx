import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBaseComponentProps, Typography } from '@mui/material';

interface InputOutlinedProps extends OutlinedInputProps {
  onKeyDownEnter?: () => void;
  width?: string;
  height?: string;
  align?: 'center' | 'right';
  bottom?: boolean;
  format?: string;
  max?: number;
}

const StyledInput = styled(OutlinedInput)<OutlinedInputProps>(({ theme }) => ({
  width: '100%',
  borderRadius: 6,
  borderColor: theme.palette.gray_4.main,
  padding: '0 1rem 0 0.5rem',

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

  '&.Mui-focused': {
    fieldset: {
      borderWidth: '1px !important',
    },
  },

  '&:hover': {
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.gray_4.main,
    },
  },

  input: {
    height: '100%',
    padding: '0.5rem',

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

const InputOutlined = (props: InputOutlinedProps) => {
  const value = props.value;
  const max = props.max;
  const placeholder = props.placeholder;
  const start_adornment = props.startAdornment;
  const end_adornment = props.endAdornment;
  const type = props.type;
  const read_only = props.readOnly;
  const onChange = props.onChange;
  const onClick = props.onClick;
  const onBlur = props.onBlur;
  const onFocus = props.onFocus;
  const class_name = props.className;
  const onKeyDownEnter = props.onKeyDownEnter;
  const width = props.width;
  const height = props.height;
  const align = props.align;
  const id = props.id;
  const format = props.format;
  const sx = props.sx;
  const disabled = props.disabled;

  const [currentValue, setCurrentValue] = useState('');
  const [currentFormat, setCurrentFormat] = useState('');

  const handleKeyDown = (e: any) => {
    const event = e as React.KeyboardEvent<HTMLInputElement>;
    if (event.code == 'Enter') onKeyDownEnter ? onKeyDownEnter() : false;
  };

  useEffect(() => {
    if (format == 'price') {
      const cur_value = `${value}`.replace(/[\,]/gi, '');
      setCurrentValue(Number(cur_value).toLocaleString());
      setCurrentFormat('???');
    } else {
      if (format == 'people') {
        setCurrentFormat('???');
      }
      setCurrentValue(`${value}`);
    }
  }, [value]);

  const setStyle = () => {
    const style: { [key: string]: string | number } = {
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const input_value = e.target.value;
    const cur_value = input_value.replace(/[\,]/gi, '');
    if (max && max < cur_value.length) return;
    if (typeof input_value == 'string') {
      if (format == 'price') {
        if (isNaN(Number(cur_value))) return;
        setCurrentValue(Number(cur_value).toLocaleString());
      } else {
        setCurrentValue(input_value);
      }
    }
    if (onChange) {
      if (format == 'price' && isNaN(Number(cur_value))) return;
      onChange(e);
    }
  };

  return (
    <>
      <StyledInput
        id={id}
        className={class_name}
        value={currentValue}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e)}
        startAdornment={
          start_adornment ? (
            <Typography
              variant='inherit'
              sx={{ width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {start_adornment}
            </Typography>
          ) : null
        }
        endAdornment={currentFormat}
        type={type}
        readOnly={read_only || onClick ? true : false}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        sx={{ ...setStyle(), cursor: onClick ? 'pointer' : 'inherit', ...sx }}
        inputProps={{ style: { textAlign: align ? align : 'left' } }}
      />
    </>
  );
};

export default React.memo(InputOutlined);
