import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';
import { useEffect, useState } from 'react';
import InputOutlined from './InputOutlined';

interface InputTemporaryProps {
  value?: string;
  onSubmit: (value: string) => void;
  sx?: SxProps<Theme>;
}

const InputTemporary = (props: InputTemporaryProps) => {
  const onSubmit = props.onSubmit;
  const props_value = props.value;
  const sx = props.sx;

  const [value, setValue] = useState('');

  useEffect(() => {
    if (props_value) {
      setValue(props_value);
    }
  }, [props_value]);
  return (
    <InputOutlined
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      sx={sx}
      onBlur={() => {
        onSubmit(value);
        setValue('');
      }}
    />
  );
};

export default InputTemporary;
