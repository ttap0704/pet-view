import { GetStaticPaths, GetStaticProps } from 'next';

import { Box } from '@mui/material';
import { useEffect, useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../src/utils/api';
import { setImageArray } from '../../src/utils/tools';

interface AccommodationList {
  accommodation_images: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
  image_list: ImageListType[];
}

const AccommodationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'inline-flex',
  justifyContent: 'space-between',
}));

const AccommodationDetail = (props: { list: AccommodationList[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<AccommodationList[]>([]);
  useEffect(() => {
    setList(props.list);
  }, []);

  return <AccommodationContainer></AccommodationContainer>;
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

export const getStaticPaths: GetStaticPaths = async () => {
  const data: AccommodationList[] = await fetchGetApi(`/accommodation`);

  const paths = data.map((item: AccommodationList) => {
    return { params: { id: `${item.id}` } };
  });

  return { paths, fallback: false };
};

export default AccommodationDetail;
