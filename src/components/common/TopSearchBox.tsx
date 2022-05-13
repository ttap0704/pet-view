import Box, { BoxProps } from '@mui/material/Box';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';
import Button from '../button/Button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Typography } from '@mui/material';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
  const [curType, setCurType] = useState<SearchItemTypes[]>([]);

  const searchLocation = () => {
    setLocation('');
  };

  const type_list: { [key: string]: SearchItemTypes[] } = {
    accommodation: [
      {
        label: '펜션',
        type: 1,
        checked: false,
      },
      {
        label: '호텔/리조트',
        type: 2,
        checked: false,
      },
      {
        label: '캠핑/글램핑',
        type: 3,
        checked: false,
      },
      {
        label: '기타',
        type: 4,
        checked: false,
      },
    ],
    restaurant: [
      {
        label: '음식점',
        type: 1,
        checked: false,
      },
      {
        label: '카페',
        type: 2,
        checked: false,
      },
      {
        label: '주점/술집',
        type: 3,
        checked: false,
      },
      {
        label: '기타',
        type: 4,
        checked: false,
      },
    ],
  };

  useEffect(() => {
    setCurType(type_list[type]);
  }, [type]);

  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmp_cur_type = [...curType];
    tmp_cur_type[Number(event.target.name) - 1].checked = event.target.checked;
    setCurType([...tmp_cur_type]);
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
            <ItemBox sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <FormGroup sx={{ flexDirection: 'row' }}>
                {curType.map((type, type_idx) => {
                  return (
                    <FormControlLabel
                      control={<Checkbox checked={type.checked} onChange={handleCheckBox} name={`${type.type}`} />}
                      label={type.label}
                    />
                  );
                })}
              </FormGroup>
              <Button sx={{ maxHeight: '3rem' }} variant='outlined' color='orange' disableRipple={true}>
                적용
              </Button>
            </ItemBox>
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
