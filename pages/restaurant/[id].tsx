import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { setImageArray, getNoticeContents } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import CardNotice from '../../src/components/card/CardNotice';
import ImageExposureMenuList from '../../src/components/image/ImageExposureMenuList';
import ListEntireMenu from '../../src/components/list/ListEntireMenu';
import KakaoMap from '../../src/components/common/KakaoMap';

type Props = {
  detail: RestaurantResponse;
};

interface Params extends ParsedUrlQuery {
  id: string;
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

const InfoCardBox = styled(Box)(({ theme }) => ({
  minWidth: 'calc(100% - 43rem)',
  height: '25.5rem',

  '& > div': {
    height: '100%',
    ul: {
      height: '100%',
    },
  },
}));

const InfoMapBox = styled(Box)(({ theme }) => ({
  width: '60%',
  height: 'auto',
}));

const RestaurantDetail = (props: { detail: RestaurantResponse; style: { [key: string]: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [restaurantLabel, setRestaurantLabel] = useState('');
  const [address, setAddress] = useState('');
  const [exposureMenu, setExposureMenu] = useState<AddExposureMenuContentsType[]>([]);
  const [entireMenu, setEntireMenu] = useState<AddEntireMenuContentsType[]>([]);
  const [roadAddress, setRoadAddress] = useState('');

  const [noticeContents, setNoticeContents] = useState<(string | React.ReactElement)[]>([]);

  useEffect(() => {
    if (!isMounted) {
      setRestaurantDetail(props.detail);
      setRoadAddress(props.detail.road_address);
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

    const tmp_exposure_menu = detail.exposure_menu;
    const tmp_entire_menu = detail.entire_menu_category;

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

    const entire_menu: AddEntireMenuContentsType[] = [];
    for (const menu of tmp_entire_menu) {
      entire_menu.push({
        category: menu.category,
        menu: [...menu.menu].map(item => {
          return {
            label: item.label,
            price: `${item.price}`,
          };
        }),
      });
    }

    const tmp_info_details: ServiceInfoType = {
      open: props.detail.open,
      close: props.detail.close,
      contact: props.detail.contact,
      kakao_chat: props.detail.kakao_chat,
      site: props.detail.site,
      last_order: props.detail.last_order,
    };

    const tmp_contents: (string | React.ReactElement)[] = getNoticeContents(tmp_info_details);

    setNoticeContents([...tmp_contents]);
    setExposureImages(exposure_image_list);
    setAddress(detail.road_address);
    setRestaurantLabel(detail.label);
    setExposureMenu(exposure_menu);
    setEntireMenu(entire_menu);
  };

  return (
    <RestaurantContainer>
      <ContainerRegistrationItem title=''>
        <Box sx={{ width: '100%', display: 'flex', gap: '1rem' }}>
          <Box sx={{ width: '100%' }}>
            <ImageBox slide={true} type='restaurant' imageList={exposureImages} count={true} />
            <LabelDetailTitle title={restaurantLabel} address={address} />
          </Box>
          <InfoCardBox>
            <CardNotice contents={noticeContents} />
          </InfoCardBox>
        </Box>
      </ContainerRegistrationItem>
      <Divider sx={{ width: '100%', borderWidth: '1px', marginBottom: '3rem' }} />
      <ContainerRegistrationItem title='대표 메뉴'>
        <ImageExposureMenuList contents={exposureMenu} />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='전체 메뉴'>
        <ListEntireMenu entireMenu={entireMenu} type='category' mode='view' />
      </ContainerRegistrationItem>
      <KakaoMap address={roadAddress} label={restaurantLabel} />
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
