import { ButtonProps } from '@mui/material';
import React from 'react';
import { FaFileUpload } from 'react-icons/fa';
import Button from './Button';

interface ButtonUploadProps {
  title: string;
  onClick: () => void;
  buttonProps?: ButtonProps;
}

const ButtonUpload = (props: ButtonUploadProps) => {
  const title = props.title;
  const onClick = props.onClick;
  const button_props = props.buttonProps;

  return (
    <Button onClick={onClick} color='blue' variant='contained' {...button_props}>
      {title}
      <FaFileUpload />
    </Button>
  );
};

export default ButtonUpload;
