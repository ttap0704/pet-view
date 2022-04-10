import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { setImageArray, getSeasonPriceKey } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import BoxIntroduction from '../../src/components/box/BoxIntroduction';
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import FormAddRoom from '../../src/components/form/FormAddRoom';
import Tabs from '../../src/components/tabs/Tabs';

type Props = {
  detail: AccommodationResponse;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

interface DetailRoomsType extends AddRoomContentsType {
  price: string;
}

const AccommodationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const AccommodationDetail = (props: { detail: AccommodationResponse; style: { [key: string]: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [accommodationLabel, setAccommodationLabel] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [rooms, setRooms] = useState<DetailRoomsType[]>([]);
  const [curPriceKey, setCurPriceKey] = useState<RoomPriceKeys>('normal_price');

  useEffect(() => {
    if (curPriceKey) {
      const tmp_rooms = [...rooms];

      for (const tmp_room of tmp_rooms) {
        tmp_room.price = tmp_room[curPriceKey];
      }

      setRooms([...tmp_rooms]);
    }
  }, [curPriceKey]);

  useEffect(() => {
    if (!isMounted) {
      console.log('여기');
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      const today_key: RoomPriceKeys = getSeasonPriceKey(`${month}-${date}`, props.detail.accommodation_peak_season);
      setCurPriceKey(today_key);

      setAccommodationDetail(props.detail, today_key);
    }
    return () => {
      setIsMounted(true);
    };
  }, []);

  const setAccommodationDetail = async (detail: AccommodationResponse, price_key: RoomPriceKeys) => {
    const tmp_exposure_images = detail.accommodation_images.map(item => ({
      file_name: item.file_name,
    }));
    const exposure_image_list = await setImageArray(tmp_exposure_images, true, 'accommodation');

    const tmp_rooms: DetailRoomsType[] = [];
    for (const room of detail.accommodation_rooms) {
      tmp_rooms.push({
        label: room.label,
        normal_price: room.normal_price,
        normal_weekend_price: room.normal_weekend_price,
        price: room[price_key],
        peak_price: room.peak_price,
        peak_weekend_price: room.peak_weekend_price,
        standard_num: `${room.standard_num}`,
        maximum_num: `${room.maximum_num}`,
        image_list: await setImageArray(
          room.rooms_images.map(item => ({ file_name: item.file_name })),
          true,
          'rooms',
        ),
        entrance: '',
        leaving: '',
      });
    }

    setExposureImages(exposure_image_list);
    setRooms([...tmp_rooms]);
    setAddress(detail.road_address);
    setAccommodationLabel(detail.label);
    setIntroduction(detail.introduction);
  };

  return (
    <AccommodationContainer>
      <ContainerRegistrationItem title='대표 이미지'>
        <ImageBox slide={true} type='accommodation' imageList={exposureImages} count={true} />
        <LabelDetailTitle title={accommodationLabel} address={address} />
      </ContainerRegistrationItem>
      <Tabs></Tabs>
      <ContainerRegistrationItem title='숙소 소개'>
        <BoxIntroduction introduction={introduction} />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='객실'>
        {rooms.map((room, room_idx) => {
          return (
            <FormAddRoom
              key={`room_form_${room_idx}`}
              room_idx={room_idx}
              imageList={room.image_list}
              mode='view'
              contents={room}
            />
          );
        })}
      </ContainerRegistrationItem>
    </AccommodationContainer>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data: AccommodationResponse[] = await fetchGetApi(`/accommodation`);

  const paths = data.map((item: AccommodationResponse) => {
    return { params: { id: `${item.id}` } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const params_res: { id: string } = context.params!;
  const data: AccommodationResponse = await fetchGetApi(`/accommodation/${params_res.id}`);

  return {
    props: {
      detail: data,
    },
  };
};

export default AccommodationDetail;
