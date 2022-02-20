import * as React from 'react';

import { styled } from '@mui/material/styles';
import { TextareaAutosizeProps } from '@mui/base';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const CustomTextarea = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: '12rem',
  maxheight: '12rem',
  overflowY: 'auto',
  borderRadius: 6,
  borderColor: theme.palette.gray_4.main,
  padding: '0.5rem',
  fontSize: '1rem',
  resize: 'none',
}));

function Textarea(props: TextareaProps) {
  const value = props.value;
  const onChange = props.onChange;
  const placeholder = props.placeholder;

  return <CustomTextarea value={value} onChange={onChange} placeholder={placeholder} />;
}

export default Textarea;
