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

interface AccommodationList {
  accommodation_images: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
  sido: string;
  image_list: ImageListType[];
}

const AccommodationContainer = styled(Box)(({ theme }) => ({
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

const AccommodationIndex = (props: { list: AccommodationList[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<AccommodationList[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const is_down_md = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setList(props.list);
  }, []);

  const moveDetailPage = (item: AccommodationList) => {
    router.push(`/accommodation/${item.id}`);
  };

  const searchList = async (data: SearchItems) => {
    const url = `/accommodation${setSearchQuery(data)}`;
    const search_res: AccommodationList[] = await fetchGetApi(url);
    const list: AccommodationList[] = [];
    for await (const item of search_res) {
      list.push({
        ...item,
        image_list: await setImageArray(item.accommodation_images),
      });
    }

    setList(list);
  };

  return (
    <AccommodationContainer>
      <SearchBox onSubmit={searchList} type='accommodation' />
      <ContainerList>
        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <ListBox key={`accommodation_list_${index}`} onClick={() => moveDetailPage(item)}>
                <ImageBox imageList={item.image_list} type='accommodation' slide={false} list={true} />
                <LabelList title={item.label} subtitle={`${item.sido} ${item.sigungu} ${item.bname}`} />
              </ListBox>
            );
          })
        ) : (
          <CardEmpty />
        )}
      </ContainerList>
    </AccommodationContainer>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data: AccommodationList[] = await fetchGetApi(`/accommodation`);

  const list: AccommodationList[] = [];
  for await (const item of data) {
    list.push({
      ...item,
      image_list: await setImageArray(item.accommodation_images),
    });
  }

  return {
    props: {
      list: list,
    },
  };
};

export default AccommodationIndex;
