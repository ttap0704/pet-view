import { GetServerSidePropsContext } from 'next';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../../src/utils/api';
import { setImageArray, setSearchQuery } from '../../../src/utils/tools';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

import ImageBox from '../image/ImageBox';
import LabelList from '../label/LabelList';
import ContainerList from '../container/ContainerList';
import SearchBox from '../common/SearchBox';
import CardEmpty from '../card/CardEmpty';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';
import DropdownMenu from '../common/DropdownMenu';

const RecentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
}));

const ListBox = styled(Box)(({ theme }) => ({
  width: '42rem',
  maxWidth: '42rem',
  height: 'auto',
  cursor: 'pointer',
  position: 'relative',
}));

const LayoutUserProducts = (props: { list: UserProductType[]; title: string }) => {
  const [list, setList] = useState<UserProductType[]>([]);
  const [originList, setOriginList] = useState<UserProductType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownElement, setDropdownElement] = useState<null | HTMLElement>(null);
  const [dropdownTitle, setDropdownTitle] = useState('');
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setList(props.list);
    setOriginList(props.list);
    setDropdownItems(['전체', '숙박업소', '음식점']);
  }, []);

  const handleDropdown = (idx: number) => {
    setDropdownOpen(false);
    if (dropdownTitle == dropdownItems[idx]) return;
    let cur_list: UserProductType[] = [];
    const origin_list = [...originList];
    if (idx == 0) {
      cur_list = [...origin_list];
    } else if (idx == 1) {
      cur_list = origin_list.filter(item => item.accommodation_images);
    } else {
      cur_list = origin_list.filter(item => item.restaurant_images);
    }
    setList([...cur_list]);
    setDropdownTitle(dropdownItems[idx]);
  };

  const moveDetailPage = (item: UserProductType) => {
    router.push(`/${item.restaurant_images ? 'restaurant' : 'accommodation'}/${item.id}`);
  };

  return (
    <>
      <RecentContainer>
        <UtilBox sx={{ maxWidth: '42rem', alignItems: 'flex-start', height: '2.5rem' }}>
          <Typography component='span' sx={{ fontSize: '1.2rem', fontWeight: '600' }}>
            {props.title}
          </Typography>
          <Button
            variant='outlined'
            color='orange'
            disableRipple
            endIcon={dropdownOpen ? <HiChevronUp /> : <HiChevronDown />}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              if (!dropdownElement) {
                setDropdownElement(e.currentTarget);
              }

              setDropdownOpen(true);
            }}
          >
            구분
          </Button>
        </UtilBox>
        <ContainerList>
          {list.length > 0 ? (
            list.map((item, index) => {
              return (
                <ListBox key={`recent_list_${index}`} onClick={() => moveDetailPage(item)}>
                  <ImageBox
                    imageList={item.image_list}
                    type={`${item.restaurant_images ? 'restaurant' : 'accommodation'}`}
                    slide={false}
                    list={true}
                  />
                  <LabelList title={item.label} subtitle={`${item.sido} ${item.sigungu} ${item.bname}`} />
                </ListBox>
              );
            })
          ) : (
            <CardEmpty />
          )}
        </ContainerList>
      </RecentContainer>
      <DropdownMenu
        open={dropdownOpen}
        anchorEl={dropdownElement}
        onClose={() => setDropdownOpen(false)}
        onClick={handleDropdown}
        items={dropdownItems}
      />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { headers } = context.req;

  let recent_data: UserProductType[] = [];
  if (query.accommodation) {
    const accom_data: UserProductType[] = await fetchGetApi(`/accommodation?recent=${query.accommodation.toString()}`);
    recent_data = [...recent_data, ...accom_data];
  }
  if (query.restaurant) {
    const rest_data: UserProductType[] = await fetchGetApi(`/restaurant?recent=${query.restaurant.toString()}`);
    recent_data = [...recent_data, ...rest_data];
  }

  const list: UserProductType[] = [];
  for await (const item of recent_data) {
    let image_list: ImageListType[] = [];
    if (item.accommodation_images) {
      image_list = await setImageArray(item.accommodation_images);
    } else if (item.restaurant_images) {
      image_list = await setImageArray(item.restaurant_images);
    }
    list.push({
      ...item,
      image_list,
    });
  }

  return {
    props: {
      list: list,
    },
  };
}

export default LayoutUserProducts;
