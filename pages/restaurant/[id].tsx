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
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import Tabs from '../../src/components/tabs/Tabs';
import CardNotice from '../../src/components/card/CardNotice';
import ImageExposureMenuList from '../../src/components/image/ImageExposureMenuList';
import ListEntireMenu from '../../src/components/list/ListEntireMenu';

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
  width: '40%',
  height: 'auto',
}));

const InfoMapBox = styled(Box)(({ theme }) => ({
  width: '60%',
  height: 'auto',
}));

const MenuDetails = (props: { detail: MenuDetailsType }) => {
  const detail = props.detail;
  const [exposureMenu, setExposureMenu] = useState<AddExposureMenuContentsType[]>([]);
  const [entireMenu, setEntireMenu] = useState<AddEntireMenuContentsType[]>([]);

  useEffect(() => {
    setDetailContents();
  }, []);

  const setDetailContents = async () => {
    const tmp_exposure_menu = detail.exposure_menu;
    const tmp_entire_menu = detail.category;

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

    setExposureMenu(exposure_menu);
    setEntireMenu(entire_menu);
  };
  return (
    <>
      <ContainerRegistrationItem title='대표 메뉴'>
        <ImageExposureMenuList contents={exposureMenu} />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='전체 메뉴'>
        <ListEntireMenu entireMenu={entireMenu} type='category' mode='view' />
      </ContainerRegistrationItem>
    </>
  );
};

const InfoDetails = (props: { detail: ServiceInfoType }) => {
  const detail = props.detail;

  const [noticeContents, setNoticeContents] = useState<(string | React.ReactElement)[]>([]);
  const detail_type_text: { [key: string]: string } = {
    open: '오픈',
    close: '마감',
    last_order: '마지막 주문',
    contact: '연락처',
    kakao_chat: '카카오톡',
    site: '사이트',
  };

  useEffect(() => {
    const tmp_contents: (string | React.ReactElement)[] = [];
    for (const [key, val] of Object.entries(detail_type_text)) {
      if (detail[key]) {
        if (key == 'site') {
          tmp_contents.push(
            <>
              {val} :{' '}
              <a href={detail[key]} target='_blank'>
                사이트로 이동
              </a>
            </>,
          );
        } else {
          tmp_contents.push(`${val} : ${detail[key]}`);
        }
      }
    }
    setNoticeContents([...tmp_contents]);
  }, [detail]);

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <InfoCardBox>
        <CardNotice contents={noticeContents} />
      </InfoCardBox>
      <InfoMapBox>Map</InfoMapBox>
    </Box>
  );
};

const RestaurantDetail = (props: { detail: RestaurantResponse; style: { [key: string]: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [restaurantLabel, setRestaurantLabel] = useState('');
  const [address, setAddress] = useState('');

  const [tabs, setTabs] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    console.log(props.detail);
    if (!isMounted) {
      setRestaurantDetail(props.detail);

      const tmp_menu_details = {
        category: props.detail.entire_menu_category,
        exposure_menu: props.detail.exposure_menu,
      };

      const tmp_info_details = {
        open: props.detail.open,
        close: props.detail.close,
        contact: props.detail.contact,
        kakao_chat: props.detail.kakao_chat,
        site: props.detail.site,
        last_order: props.detail.last_order,
      };

      setTabs([<MenuDetails detail={tmp_menu_details} />, <InfoDetails detail={tmp_info_details} />]);
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
