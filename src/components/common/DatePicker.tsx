import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type ContentsView = 'year' | 'month' | 'day';

interface DatePickerContentsType {
  views: ContentsView[];
  input_format: string;
  mask: string;
}

interface DatePickerProps {
  type?: string;
  date?: Date;
  mode?: string;
  onDateChange: (date: Date) => void;
}

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  height: '3rem',

  '.MuiOutlinedInput-root': {
    height: '100%',
    borderColor: theme.palette.gray_4.main,
  },

  '&.season': {
    '.MuiOutlinedInput-root': {
      fieldset: {
        border: 'none',
      },
    },
  },

  '&.read': {
    '.MuiOutlinedInput-root': {
      input: {
        textAlign: 'center',
      },
    },
  },
}));

const CustomDatePicker = (props: DatePickerProps) => {
  const type = props.type;
  const date = props.date;
  const mode = props.mode;
  const onDateChange = props.onDateChange;
  const [value, setValue] = React.useState<Date | null>(new Date());
  const type_class_name = type != 'season' ? '' : 'season';
  const mode_class_name = mode != 'read' ? '' : 'read';

  useEffect(() => {
    if (date) {
      setValue(date);
    }
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        PaperProps={{ className: `${type_class_name} ${mode_class_name}` }}
        views={type != 'season' ? ['year', 'month', 'day'] : ['month', 'day']}
        value={value}
        inputFormat={type != 'season' ? 'yyyy년 MM월 dd일' : 'MM월 dd일'}
        mask={type != 'season' ? '____년__월 __일' : '__월 __일'}
        onChange={newValue => {
          setValue(newValue);
          onDateChange(new Date(`${newValue}`));
        }}
        OpenPickerButtonProps={mode == 'read' ? { sx: { display: 'none' } } : {}}
        renderInput={params => <CustomTextField className={`${type_class_name} ${mode_class_name}`} {...params} />}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
