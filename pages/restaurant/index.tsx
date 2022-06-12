import { GetStaticPaths, GetStaticProps } from 'next';

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

interface RestaurantList {
  restaurant_images: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sido: string;
  sigungu: string;
  image_list: ImageListType[];
}

const RestaurantContainer = styled(Box)(({ theme }) => ({
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

const RestaurantIndex = (props: { list: RestaurantList[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<RestaurantList[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const is_down_md = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setList(props.list);
  }, []);

  const moveDetailPage = (item: RestaurantList) => {
    router.push(`/restaurant/${item.id}`);
  };

  const searchList = async (data: SearchItems) => {
    const url = `/restaurant${setSearchQuery(data)}`;
    const search_res: RestaurantList[] = await fetchGetApi(url);
    const list: RestaurantList[] = [];
    for await (const item of search_res) {
      list.push({
        ...item,
        image_list: await setImageArray(item.restaurant_images),
      });
    }

    setList(list);
  };

  return (
    <RestaurantContainer>
      <SearchBox onSubmit={searchList} type='restaurant' />
      <ContainerList>
        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <ListBox key={`restaurant_list_${index}`} onClick={() => moveDetailPage(item)}>
                <ImageBox imageList={item.image_list} type='restaurant' slide={false} list={true} empty={false} />
                <LabelList title={item.label} subtitle={`${item.sido} ${item.sigungu} ${item.bname}`} />
              </ListBox>
            );
          })
        ) : (
          <CardEmpty />
        )}
      </ContainerList>
    </RestaurantContainer>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data: RestaurantList[] = await fetchGetApi(`/restaurant`);

  const list: RestaurantList[] = [];
  for await (const item of data) {
    list.push({
      ...item,
      image_list: await setImageArray(item.restaurant_images),
    });
  }

  return {
    props: {
      list: list,
    },
  };
};

export default RestaurantIndex;
