import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
import DatePicker from './DatePicker';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';
import Button from '../button/Button';

interface SideSearchBoxProps {
  onDateChange: (date: Date, type: string) => void;
  type: string;
}

const SideBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '15rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '2rem 1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_5.main,
  borderRadius: '4px',
}));

const ItemBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',

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
  const type = props.type;

  const searchLocation = () => {
    setLocation('');
    console.log(location);
  };

  return (
    <>
      <SideBox>
        <ItemBox>
          <Typography component='h4'>장소 검색</Typography>
          <InputOutlined
            className='search-bar'
            endAdornment={<FaSearchLocation onClick={searchLocation} />}
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            onKeyDownEnter={searchLocation}
            placeholder='장소를 입력해주세요.'
          />
          <Button variant='outlined' color='orange' disableRipple={true}>
            검색
          </Button>
        </ItemBox>

        {type == 'accommodation' ? (
          <></>
        ) : (
          <>
            <Divider />
            <ItemBox>
              <Typography component='h4'>음식</Typography>
              <InputOutlined
                className='search-bar'
                endAdornment={<FaSearchLocation onClick={searchLocation} />}
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                onKeyDownEnter={searchLocation}
                placeholder='음식명을 입력해주세요.'
              />
              <Button variant='outlined' color='orange' disableRipple={true}>
                검색
              </Button>
            </ItemBox>
          </>
        )}
      </SideBox>
    </>
  );
};

export default SideSearchBox;
