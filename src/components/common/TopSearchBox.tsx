import Box, { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';
import Button from '../button/Button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Typography } from '@mui/material';

interface TopSearchBoxProps {
  onDateChange: (date: Date, type: string) => void;
  type: string;
}

const TopBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '42rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0rem 0.5rem',
  border: '1px solid',
  borderColor: theme.palette.gray_5.main,
  borderRadius: '4px',
}));

const ItemBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: '0.5rem',

  '&:last-of-type': {
    marginBottom: '0.5rem',
  },
  '.search-bar': {
    svg: {
      color: theme.palette.blue.main,
      cursor: 'pointer',
    },
  },
}));

const TitleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  span: {
    fontSize: '1rem',
    fontWeight: '500',
  },

  svg: {
    width: '1.5rem',
    height: '1.5rem',
  },
}));

const TopSearchBox = (props: TopSearchBoxProps) => {
  const [location, setLocation] = useState('');
  const [open, setOpen] = useState(false);
  const onDateChange = props.onDateChange;
  const type = props.type;

  const searchLocation = () => {
    setLocation('');
    console.log(location);
  };

  return (
    <>
      <TopBox>
        <TitleBox onClick={() => setOpen(!open)}>
          <Typography component='span'>상세검색</Typography>
          {open ? <HiChevronUp /> : <HiChevronDown />}
        </TitleBox>
        {open ? (
          <>
            <ItemBox>
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
                <ItemBox>
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
          </>
        ) : null}
      </TopBox>
    </>
  );
};

export default TopSearchBox;
