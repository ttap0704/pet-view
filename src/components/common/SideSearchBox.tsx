import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
import Button from '../button/Button';
import DatePicker from './DatePicker';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';

const SideBox = styled(Box)(({ theme }) => ({
  width: '15rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_5.main,
  borderRadius: '4px',

  h3: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },

  h4: {
    fontSize: '1.05rem',
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

const SideSearchBox = () => {
  const [location, setLocation] = useState('');

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
          <Typography component='h4'>날짜</Typography>
          <DatePicker />
        </ItemBox>
      </SideBox>
    </>
  );
};

export default SideSearchBox;
