import React from 'react';
import { FaFileUpload } from 'react-icons/fa';
import Button from './Button';

interface ButtonUploadProps {
  title: string;
  onClick: () => void;
}

const ButtonUpload = (props: ButtonUploadProps) => {
  const title = props.title;
  const onClick = props.onClick;

  return (
    <Button onClick={onClick} color='blue' variant='contained'>
      {title}
      <FaFileUpload />
    </Button>
  );
};

export default ButtonUpload;
