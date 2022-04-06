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

const ListBox = styled(Box)(({ theme }) => ({
  width: '42rem',
  height: 'auto',
  cursor: 'pointer',
}));

const AccommodationIndex = (props: { list: AccommodationList[]; style: { [key: string]: string } }) => {
  const [list, setList] = useState<AccommodationList[]>([]);
  const router = useRouter();

  useEffect(() => {
    setList(props.list);
  }, []);

  const test = (date: Date, type: string) => {
    console.log(date, type);
  };

  const moveDetailPage = (item: AccommodationList) => {
    router.push(`/accommodation/${item.id}`);
  };

  return (
    <AccommodationContainer>
      <ContainerList>
        {list.map((item, index) => {
          return (
            <ListBox key={`accommodation_list_${index}`} onClick={() => moveDetailPage(item)}>
              <ImageBox imageList={item.image_list} type='accommodation' slide={false} />
              <LabelList title={item.label} subtitle={item.bname} />
            </ListBox>
          );
        })}
      </ContainerList>
      <SideSearchBox onDateChange={test} />
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
