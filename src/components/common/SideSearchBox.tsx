import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
import Button from '../button/Button';
import DatePicker from './DatePicker';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';

interface SideSearchBoxProps {
  onDateChange: (date: Date, type: string) => void;
}

const SideBox = styled(Box)(({ theme }) => ({
  width: '15rem',
  height: 'auto',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_5.main,
  borderRadius: '4px',

  h4: {
    marginBottom: '0.25rem',
  },
}));

const ItemBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',

  '.search-bar': {
    svg: {
      color: theme.palette.blue.main,
      cursor: 'pointer',
    },
  },
}));

const SideSearchBox = (props: SideSearchBoxProps) => {
  const [location, setLocation] = useState('');
  const onDateChange = props.onDateChange;

  const searchLocation = () => {
    console.log(location);
  };

  return (
    <>
      <SideBox>
        <Typography component='h3'>상세 검색</Typography>

        <ItemBox>
          <Typography component='h4'>장소</Typography>
          <InputOutlined
            className='search-bar'
            endAdornment={<FaSearchLocation onClick={searchLocation} />}
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            onKeyDownEnter={searchLocation}
          />
        </ItemBox>

        <Divider />

        <ItemBox>
          <Typography component='h4'>입실</Typography>
          <DatePicker onDateChange={(date: Date) => onDateChange(date, 'first')} />
        </ItemBox>

        <ItemBox>
          <Typography component='h4'>퇴실</Typography>
          <DatePicker onDateChange={(date: Date) => onDateChange(date, 'last')} />
        </ItemBox>
      </SideBox>
    </>
  );
};

export default SideSearchBox;
