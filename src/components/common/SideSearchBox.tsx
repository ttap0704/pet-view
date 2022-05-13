import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
import DatePicker from './DatePicker';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';
import Button from '../button/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

  const [curType, setCurType] = useState<SearchItemTypes[]>([]);

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
      <SideBox>
        <ItemBox>
          <Typography component='h4'>상세조건</Typography>
          <FormGroup>
            {curType.map((type, type_idx) => {
              return (
                <FormControlLabel
                  control={<Checkbox checked={type.checked} onChange={handleCheckBox} name={`${type.type}`} />}
                  label={type.label}
                />
              );
            })}
          </FormGroup>
          <Button variant='outlined' color='orange' disableRipple={true}>
            적용
          </Button>
        </ItemBox>

        <Divider />

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
