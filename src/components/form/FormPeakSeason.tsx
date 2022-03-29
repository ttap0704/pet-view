import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import { Box, Typography, IconButton } from '@mui/material';
import DatePicker from '../common/DatePicker';
import { getDate } from '../../utils/tools';
import { TiDelete } from 'react-icons/ti';

interface FormPeakSeasonProps {
  data: string[][];
  mode?: string;
  onDateChange: (parent_idx: number, children_idx: number, date: string) => void;
  onDelete: (parent_idx: number) => void;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'space-between',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
}));

const FormItems = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  '&:not(:last-of-type)': {
    borderBottom: '1px solid',
    borderColor: theme.palette.gray_4.main,
  },
}));

const TitleBox = styled(Box)(({ theme }) => ({
  width: '20%',
  height: '3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.gray_5.main,
}));

const ContentsBox = styled(Box)(({ theme }) => ({
  width: '80%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
}));

function FormPeakSeason(props: FormPeakSeasonProps) {
  const data = props.data;
  const mode = props.mode;
  const onDateChange = props.onDateChange;
  const onDelete = props.onDelete;

  const [dateArray, setDateArray] = useState<Date[][]>([]);

  const changeDate = (parent_idx: number, children_idx: number, date: Date) => {
    const date_string = getDate(`${date}`);
    onDateChange(parent_idx, children_idx, date_string.slice(5, 10));
  };

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);
      let tmp_arr = data.map(item => {
        return [
          ...item.map(item2 => {
            return new Date(item2);
          }),
        ];
      });

      setDateArray(tmp_arr);
    }
  }, [data]);

  return (
    <>
      <FormContainer>
        {dateArray.map((item, item_idx) => {
          return (
            <FormItems key={`form_peak_season_item_${item_idx}`}>
              <TitleBox>기간 {item_idx + 1}</TitleBox>
              <ContentsBox>
                <DatePicker
                  type='season'
                  date={item[0]}
                  onDateChange={(date: Date) => changeDate(item_idx, 0, date)}
                  mode={mode}
                />
                <Typography>~</Typography>
                <DatePicker
                  type='season'
                  date={item[1]}
                  onDateChange={(date: Date) => changeDate(item_idx, 1, date)}
                  mode={mode}
                />
                {mode != 'read' ? (
                  <IconButton onClick={() => onDelete(item_idx)}>
                    <TiDelete />
                  </IconButton>
                ) : null}
              </ContentsBox>
            </FormItems>
          );
        })}
      </FormContainer>
    </>
  );
}

export default FormPeakSeason;
