import Box, { BoxProps } from '@mui/material/Box';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import InputOutlined from '../input/InputOutlined';
import { FaSearchLocation } from 'react-icons/fa';
import Button from '../button/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { RiCloseFill } from 'react-icons/ri';

interface SideSearchBoxProps {
  type: string;
  onSubmit: (data: SearchItems) => void;
}

const SideBox = styled(Box)(({ theme }) => {
  return {
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

    [theme.breakpoints.down('md')]: {
      position: 'relative',
      width: '100%',
      maxWidth: '42rem',
      height: 'auto',
      padding: '0 1rem',
      gap: '0.5rem',

      hr: {
        margin: '1rem 0',
      },
    },
  };
});

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
  [theme.breakpoints.down('md')]: {
    '&:last-of-type': {
      marginBottom: '1rem',
    },
  },
}));

const ItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  [theme.breakpoints.down('md')]: {
    display: 'none',
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

const SearchItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: 'auto',
  padding: '0.5rem 0.5rem',
  borderRadius: '1rem',
  backgroundColor: theme.palette.blue.main,
  color: theme.palette.white.main,
}));

const SearchItemTypography = styled('span')(({ theme }) => ({
  fontSize: '0.85rem',
  display: 'block',
}));

const SideSearchBox = (props: SideSearchBoxProps) => {
  const theme = useTheme();
  const is_down_md = useMediaQuery(theme.breakpoints.down('md'));

  const type = props.type;
  const onSubmit = props.onSubmit;

  const [curType, setCurType] = useState<SearchItemTypes[]>([]);
  const [open, setOpen] = useState(false);
  const [curLocation, setCurLocation] = useState('');
  const [searchItems, setSearchItems] = useState<SearchItems>({
    location: '',
    types: [],
    menu: '',
  });

  const type_list: { [key: string]: SearchItemTypes[] } = {
    accommodation: [
      {
        label: '??????',
        type: 1,
        checked: false,
      },
      {
        label: '??????/?????????',
        type: 2,
        checked: false,
      },
      {
        label: '??????/?????????',
        type: 3,
        checked: false,
      },
      {
        label: '??????',
        type: 4,
        checked: false,
      },
    ],
    restaurant: [
      {
        label: '?????????',
        type: 1,
        checked: false,
      },
      {
        label: '??????',
        type: 2,
        checked: false,
      },
      {
        label: '??????/??????',
        type: 3,
        checked: false,
      },
      {
        label: '??????',
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

    const tmp_items = { ...searchItems };
    if (event.target.checked) {
      tmp_items.types.push(`${event.target.name}`);
    } else {
      const find_idx = tmp_items.types.findIndex(item => item == `${event.target.name}`);
      if (Number(find_idx) >= 0) {
        tmp_items.types.splice(Number(find_idx), 1);
      }
    }
    setSearchItems({ ...tmp_items });
  };

  const handleInput = (target: 'location' | 'menu', value: string) => {
    const tmp_items = { ...searchItems };
    tmp_items[target] = value;
    setSearchItems({ ...tmp_items });
  };

  const search = () => {
    setCurLocation(searchItems.location);
    onSubmit(searchItems);
  };

  return (
    <>
      <SideBox>
        {is_down_md ? (
          <TitleBox onClick={() => setOpen(!open)}>
            <Typography component='span'>????????????</Typography>
            {open ? <HiChevronUp /> : <HiChevronDown />}
          </TitleBox>
        ) : null}

        {!is_down_md || open ? (
          <>
            <ItemBox>
              <ItemTitle>????????????</ItemTitle>
              <FormGroup sx={{ flexDirection: is_down_md ? 'row' : 'column' }}>
                {curType.map((type, type_idx) => {
                  return (
                    <FormControlLabel
                      control={<Checkbox checked={type.checked} onChange={handleCheckBox} name={`${type.type}`} />}
                      key={`search_type_${type_idx}`}
                      label={type.label}
                    />
                  );
                })}
              </FormGroup>
              <Button variant='outlined' color='orange' disableRipple={true} onClick={search}>
                ??????
              </Button>
            </ItemBox>

            <Divider />

            <ItemBox>
              <ItemTitle>?????? ??????</ItemTitle>
              <InputOutlined
                className='search-bar'
                endAdornment={<FaSearchLocation onClick={search} />}
                value={searchItems.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput('location', e.target.value)}
                onKeyDownEnter={search}
                placeholder='????????? ??????????????????.'
              />
              {curLocation.length > 0 ? (
                <SearchItem>
                  <SearchItemTypography>{curLocation}</SearchItemTypography>
                  <RiCloseFill
                    onClick={() => {
                      setCurLocation('');
                      setSearchItems({ ...searchItems, location: '' });
                    }}
                  />
                </SearchItem>
              ) : null}
              <Button variant='outlined' color='orange' disableRipple={true} onClick={search}>
                ??????
              </Button>
            </ItemBox>
          </>
        ) : null}
      </SideBox>
    </>
  );
};

export default SideSearchBox;
