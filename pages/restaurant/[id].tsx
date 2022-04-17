import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { setImageArray, getSeasonPriceKey } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';
import { season_notice } from '../../src/utils/notice_contents';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import BoxIntroduction from '../../src/components/box/BoxIntroduction';
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import Tabs from '../../src/components/tabs/Tabs';
import CardNotice from '../../src/components/card/CardNotice';

type Props = {
  detail: RestaurantResponse;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

interface DetailRoomsType extends AddRoomContentsType {
  price: string;
}

const RestaurantContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const RestaurantDetail = (props: { detail: RestaurantResponse; style: { [key: string]: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [restaurantLabel, setRestaurantLabel] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!isMounted) {
      setRestaurantDetail(props.detail);
    }
    return () => {
      setIsMounted(true);
    };
  }, []);

  const setRestaurantDetail = async (detail: RestaurantResponse) => {
    const tmp_exposure_images = detail.restaurant_images.map(item => ({
      file_name: item.file_name,
    }));
    const exposure_image_list = await setImageArray(tmp_exposure_images, true, 'accommodation');

    setExposureImages(exposure_image_list);
    setAddress(detail.road_address);
    setRestaurantLabel(detail.label);
  };

  return (
    <RestaurantContainer>
      <ContainerRegistrationItem title=''>
        <ImageBox slide={true} type='restaurant' imageList={exposureImages} count={true} />
        <LabelDetailTitle title={restaurantLabel} address={address} />
      </ContainerRegistrationItem>
      <Tabs contents={['객실 정보', '숙소/문의 정보']} elements={[<span>hi</span>, <span>hi2</span>]}></Tabs>
    </RestaurantContainer>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data: RestaurantResponse[] = await fetchGetApi(`/restaurant`);

  const paths = data.map((item: RestaurantResponse) => {
    return { params: { id: `${item.id}` } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const params_res: { id: string } = context.params!;
  const data: RestaurantResponse = await fetchGetApi(`/restaurant/${params_res.id}`);

  return {
    props: {
      detail: data,
    },
  };
};

export default RestaurantDetail;
