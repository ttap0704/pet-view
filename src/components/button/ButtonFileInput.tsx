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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  id: string;
  sx?: ButtonProps['sx'];
  buttonId?: string;
}

const UploadInput = (props: ButtonFileInputProps) => {
  const title = props.title;
  const multiple = props.multiple;
  const onChange = props.onChange;
  const onClick = props.onClick;
  const id = props.id;
  const sx = props.sx;
  const button_id = props.buttonId;

  function onChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    onChange ? onChange(e) : false;
  }

  return (
    <>
      <Button sx={sx ? { ...sx, padding: 0 } : { padding: 0 }} onClick={onClick} id={button_id}>
        <CustomLabel htmlFor={id}>{title}</CustomLabel>
      </Button>
      <input type='file' onChange={e => onChangeEvent(e)} id={id} name={id} multiple={multiple}></input>
    </>
  );
};

export default UploadInput;
