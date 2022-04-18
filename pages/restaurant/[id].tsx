import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { setImageArray, getSeasonPriceKey } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';
import { season_notice } from '../../src/utils/notice_contents';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import FormExposureMenu from '../../src/components/form/FormExposureMenu';
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

interface MenuDetailsType {
  category: EntireMenuCategoryType[];
  exposure_menu: ExposureMenuType[];
}

const RestaurantContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const MenuDetails = (props: { detail: MenuDetailsType }) => {
  const detail = props.detail;
  const [exposureMenu, setExposureMenu] = useState<AddExposureMenuContentsType[]>([]);

  useEffect(() => {
    setDetailContents();
  }, []);

  const setDetailContents = async () => {
    const tmp_exposure_menu = detail.exposure_menu;

    const exposure_menu: AddExposureMenuContentsType[] = [];
    for (const menu of tmp_exposure_menu) {
      const exposure_image_list = await setImageArray(
        [{ file_name: menu.exposure_menu_image.file_name }],
        true,
        'exposure_menu',
      );

      exposure_menu.push({
        label: menu.label,
        price: `${menu.price}`,
        comment: menu.comment,
        image_list: exposure_image_list,
      });
    }
    console.log(detail);
  };
  return (
    <>
      <ContainerRegistrationItem title='대표 메뉴'>hihi</ContainerRegistrationItem>
    </>
  );
};

const RestaurantDetail = (props: { detail: RestaurantResponse; style: { [key: string]: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [restaurantLabel, setRestaurantLabel] = useState('');
  const [address, setAddress] = useState('');

  const [tabs, setTabs] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    if (!isMounted) {
      setRestaurantDetail(props.detail);

      const tmp_menu_details = {
        category: props.detail.entire_menu_category,
        exposure_menu: props.detail.exposure_menu,
      };

      setTabs([<MenuDetails detail={tmp_menu_details} />, <span>hi2</span>]);
    }
    return () => {
      setIsMounted(true);
    };
  }, []);

  const setRestaurantDetail = async (detail: RestaurantResponse) => {
    const tmp_exposure_images = detail.restaurant_images.map(item => ({
      file_name: item.file_name,
    }));
    const exposure_image_list = await setImageArray(tmp_exposure_images, true, 'restaurant');

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
      <Tabs contents={['메뉴 정보', '음식점 정보']} elements={[...tabs]}></Tabs>
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
