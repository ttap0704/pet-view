import React from 'react';
import Button from './Button';
import { styled } from '@mui/material/styles';
import { ButtonProps } from '@mui/material';

const CustomLabel = styled('label')(({ theme }) => ({
  padding: '0.5rem 1rem',
}));

interface ButtonFileInputProps {
  title: string;
  multiple: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInput = (props: ButtonFileInputProps) => {
  const title = props.title;
  const multiple = props.multiple;
  const onChange = props.onChange;

  function onChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    onChange(e);
  }

  return (
    <>
      <Button sx={{ padding: 0 }}>
        <CustomLabel htmlFor='upload_input'>{title}</CustomLabel>
      </Button>
      <input
        type='file'
        onChange={e => onChangeEvent(e)}
        id='upload_input'
        name='upload_input'
        multiple={multiple}
      ></input>
    </>
  );
};

export default UploadInput;
