import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box } from '@mui/material';
import { useEffect, useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { setImageArray } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import BoxIntroduction from '../../src/components/box/BoxIntroduction';
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import FormAddRoom from '../../src/components/form/FormAddRoom';

type Props = {
  detail: AccommodationResponse;
};

interface Params extends ParsedUrlQuery {
  id: string;
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
  const [detail, setDetail] = useState<AccommodationResponse>();
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [accommodationLabel, setAccommodationLabel] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [rooms, setRooms] = useState<AddRoomContentsType[]>([]);

  useEffect(() => {
    const tmp_detail = { ...props.detail };
    setAccommodationDetail(props.detail);
  }, []);

  const setAccommodationDetail = async (detail: AccommodationResponse) => {
    const tmp_exposure_images = detail.accommodation_images.map(item => ({
      file_name: item.file_name,
    }));
    const exposure_image_list = await setImageArray(tmp_exposure_images, true, 'accommodation');

    console.log(detail);
    const tmp_rooms: AddRoomContentsType[] = [];
    for (const room of detail.accommodation_rooms) {
      tmp_rooms.push({
        label: room.label,
        normal_price: room.normal_price,
        normal_weekend_price: room.normal_weekend_price,
        peak_price: room.peak_price,
        peak_weekend_price: room.peak_weekend_price,
        standard_num: `${room.standard_num}`,
        maximum_num: `${room.maximum_num}`,
        image_list: await setImageArray(
          room.rooms_images.map(item => ({ file_name: item.file_name })),
          true,
          'rooms',
        ),
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
