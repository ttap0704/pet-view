import { GetStaticPaths, GetStaticProps } from 'next';

import { Box } from '@mui/material';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../src/utils/api';
import { setImageArray } from '../../src/utils/tools';

import ImageBox from '../../src/components/image/ImageBox';
import LabelList from '../../src/components/label/LabelList';
import ContainerList from '../../src/components/container/ContainerList';
import SideSearchBox from '../../src/components/common/SideSearchBox';
interface RestaurantList {
  restaurant_images: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
  image_list: ImageListType[];
}

const RestaurantContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'inline-flex',
  justifyContent: 'space-between',
}));

const ListBox = styled(Box)(({ theme }) => ({
  width: '42rem',
  height: 'auto',
  cursor: 'pointer',
}));

const RestaurantIndex = (props: { list: RestaurantList[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<RestaurantList[]>([]);
  const router = useRouter();

  useEffect(() => {
    console.log(props.list);
    setList(props.list);
  }, []);

  const test = (date: Date, type: string) => {
    console.log(date, type);
  };

  const moveDetailPage = (item: RestaurantList) => {
    router.push(`/restaurant/${item.id}`);
  };

  return (
    <RestaurantContainer>
      <ContainerList>
        {list.map((item, index) => {
          return (
            <ListBox key={`restaurant_list_${index}`} onClick={() => moveDetailPage(item)}>
              <ImageBox imageList={item.image_list} type='restaurant' slide={false} />
              <LabelList title={item.label} subtitle={item.bname} />
            </ListBox>
          );
        })}
      </ContainerList>
      <SideSearchBox onDateChange={test} />
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
