import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import { styled } from '@mui/material/styles';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  height: '3rem',

  '.MuiOutlinedInput-root': {
    height: '100%',
    borderColor: theme.palette.gray_4.main,
  },
}));

const CustomDatePicker = (props: DatePickerProps) => {
  const [value, setValue] = React.useState<Date | null>(new Date());
  const onDateChange = props.onDateChange;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        inputFormat={'yyyy년 MM월 dd일'}
        mask={'____년 __월 __일'}
        onChange={newValue => {
          setValue(newValue);
          onDateChange(new Date(`${newValue}`));
        }}
        renderInput={params => <CustomTextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
