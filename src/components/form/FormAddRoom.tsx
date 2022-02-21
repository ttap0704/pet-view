import * as React from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';

interface FormAddRoomProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}));

const FormItem = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
}));

function FormAddRoom(props: FormAddRoomProps) {
  const onChange = props.onChange;
  const add_room_contents = [
    {
      title: '객실명',
    },
    {
      title: '가격',
    },
    {
      title: '기준인원',
    },
    {
      title: '최대인원',
    },
  ];

  return (
    <FormContainer>
      {add_room_contents.map((item, idx) => {
        return (
          <FormItem key={`form_add_room_item_${idx}`}>
            <Typography>{item.title}</Typography>
            <InputOutlined
              align='right'
              width='70%'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, item.title)}
            />
          </FormItem>
        );
      })}
    </FormContainer>
  );
}

export default FormAddRoom;
