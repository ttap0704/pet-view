import {
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../src/utils/api';
import { setImageArray, setSearchQuery } from '../../src/utils/tools';

import ImageBox from '../../src/components/image/ImageBox';
import LabelList from '../../src/components/label/LabelList';
import ContainerList from '../../src/components/container/ContainerList';
import SearchBox from '../../src/components/common/SearchBox';
import CardEmpty from '../../src/components/card/CardEmpty';
import Button from '../../src/components/button/Button';

interface RecentListType {
  accommodation_images?: { file_name: string }[];
  restaurant_images?: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
  sido: string;
  image_list: ImageListType[];
}

const RecentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
  },
}));

const ListBox = styled(Box)(({ theme }) => ({
  width: '42rem',
  maxWidth: '42rem',
  height: 'auto',
  cursor: 'pointer',
  position: 'relative',
}));

const UserRecent = (props: { list: RecentListType[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<RecentListType[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    setList(props.list);
  }, []);

  const moveDetailPage = (item: RecentListType) => {
    router.push(`/${item.restaurant_images ? 'restaurant' : 'accommodation'}/${item.id}`);
  };

  return (
    <RecentContainer>
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
      <Button>hihi</Button>
    </RecentContainer>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { headers } = context.req;

  let recent_data: RecentListType[] = [];
  if (query.accommodation) {
    const accom_data: RecentListType[] = await fetchGetApi(`/accommodation?recent=${query.accommodation.toString()}`);
    recent_data = [...recent_data, ...accom_data];
  }
  if (query.restaurant) {
    const rest_data: RecentListType[] = await fetchGetApi(`/restaurant?recent=${query.restaurant.toString()}`);
    recent_data = [...recent_data, ...rest_data];
  }

  const list: RecentListType[] = [];
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

export default UserRecent;
