import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  setImageArray,
  getSeasonPriceKey,
  getNoticeContents,
  setLookedUpList,
  handleLike,
} from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';
import { season_notice } from '../../src/utils/notice_contents';
import { HiChevronDown, HiChevronUp, HiOutlineDotsVertical } from 'react-icons/hi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { IoMdHeart } from 'react-icons/io';

import ImageBox from '../../src/components/image/ImageBox';
import LabelDetailTitle from '../../src/components/label/LabelDetailTitle';
import BoxIntroduction from '../../src/components/box/BoxIntroduction';
import ContainerRegistrationItem from '../../src/components/container/ContainerRegistrationItem';
import FormAddRoom from '../../src/components/form/FormAddRoom';
import Tabs from '../../src/components/tabs/Tabs';
import TableRoomsPrice from '../../src/components/table/TableRoomsPrice';
import CardNotice from '../../src/components/card/CardNotice';
import KakaoMap from '../../src/components/common/KakaoMap';
import UtilBox from '../../src/components/common/UtilBox';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';

type Props = {
  detail: AccommodationResponse;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

interface DetailRoomsType extends AddRoomContentsType {
  price: string;
}

interface AccommodationInfoDetailType {
  introduction: string;
  season: PeakSeasonType[];
  total_room_price: {
    [key: string]: number;
  };
}

const ExposureBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: '1rem',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const AccommodationContainer = styled(Box)(({ theme }) => ({
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

  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '42rem',
    height: 'auto',
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  height: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  gap: '0.5rem',
  svg: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',

    '&.active': {
      color: theme.palette.orange.main,
    },
  },
}));

const AccommodationRoomsDetail = (props: { rooms: DetailRoomsType[]; info: { address: string; label: string } }) => {
  const rooms = props.rooms;
  const info = props.info;

  return (
    <>
      <ContainerRegistrationItem title='객실 정보'>
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

      <ContainerRegistrationItem title='위치 정보'>
        <KakaoMap address={info.address} label={info.label} />
      </ContainerRegistrationItem>
    </>
  );
};

const AccommodationInfoDetail = (props: { detail: AccommodationInfoDetailType }) => {
  const detail = props.detail;
  return (
    <>
      <ContainerRegistrationItem title='숙소 소개'>
        <BoxIntroduction introduction={detail.introduction} />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='성수기 기간 및 금액' sx={{ gap: '0.5rem' }}>
        <TableRoomsPrice priceContents={detail.total_room_price} seasonContents={detail.season} />
        <CardNotice contents={season_notice} />
      </ContainerRegistrationItem>
    </>
  );
};

const AccommodationDetail = (props: { detail: AccommodationResponse; style: { [key: string]: string } }) => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { modal_alert } = useContext(ModalContext);

  const [isMounted, setIsMounted] = useState(false);
  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [accommodationLabel, setAccommodationLabel] = useState('');
  const [address, setAddress] = useState('');
  const [rooms, setRooms] = useState<DetailRoomsType[]>([]);
  const [noticeContents, setNoticeContents] = useState<(string | React.ReactElement)[]>([]);
  const [locationInfo, setLocationInfo] = useState({
    address: '',
    label: '',
  });
  const [detailInfo, setDetailInfo] = useState<AccommodationInfoDetailType>({
    introduction: '',
    season: [],
    total_room_price: {},
  });
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
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      const today_key: RoomPriceKeys = getSeasonPriceKey(`${month}-${date}`, props.detail.accommodation_peak_season);

      const tmp_info_details: ServiceInfoType = {
        contact: props.detail.contact,
        kakao_chat: props.detail.kakao_chat,
        site: props.detail.site,
      };

      const tmp_contents: (string | React.ReactElement)[] = getNoticeContents(tmp_info_details);

      setLookedUpList('accommodation', props.detail.id);
      setNoticeContents([...tmp_contents]);
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

    const total_room_price: { [key: string]: number } = {
      normal_price_min: Number(tmp_rooms[0].normal_price),
      normal_price_max: 0,
      normal_weekend_price_min: Number(tmp_rooms[0].normal_weekend_price),
      normal_weekend_price_max: 0,
      peak_price_min: Number(tmp_rooms[0].peak_price),
      peak_price_max: 0,
      peak_weekend_price_min: Number(tmp_rooms[0].peak_weekend_price),
      peak_weekend_price_max: 0,
    };

    const price_keys: RoomPriceKeys[] = ['normal_price', 'normal_weekend_price', 'peak_price', 'peak_weekend_price'];
    for (const price_type of price_keys) {
      for (const room of tmp_rooms) {
        if (total_room_price[`${price_type}_min`] > Number(room[price_type])) {
          total_room_price[`${price_type}_min`] = Number(room[price_type]);
        }
        if (total_room_price[`${price_type}_max`] < Number(room[price_type])) {
          total_room_price[`${price_type}_max`] = Number(room[price_type]);
        }
      }
    }

    setDetailInfo({
      introduction: detail.introduction,
      season: detail.accommodation_peak_season,
      total_room_price: {
        ...total_room_price,
      },
    });

    setLocationInfo({
      address: detail.road_address,
      label: detail.label,
    });
  };

  const likeProduct = async () => {
    if (user.uid > 0) {
      const like_res = await handleLike(user.uid, 2, props.detail.id);
      if (like_res) {
        const get_res = await fetchGetApi(`/users/${user.uid}/like-product`);
        console.log(get_res);
        modal_alert.openModalAlert('성공적으로 좋아요를 눌렀습니다!');
      } else {
        modal_alert.openModalAlert('오류로 인해 실패하였습니다.\r\n다시 시도해주세요.');
      }
    } else {
      modal_alert.openModalAlert('로그인 후 눌러주세요!');
    }
  };

  return (
    <AccommodationContainer>
      <ContainerRegistrationItem title=''>
        <UserBox justifyContent='flex-end'>
          {user.likes['accommodation'] && user.likes['accommodation'].includes(props.detail.id) ? (
            <AiOutlineHeart onClick={likeProduct} />
          ) : (
            <AiFillHeart onClick={likeProduct} className='active' />
          )}

          <HiOutlineDotsVertical />
        </UserBox>
        <ExposureBox>
          <Box
            sx={{
              width: '100%',
              maxWidth: '42rem',
              height: 'auto',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <ImageBox slide={true} type='accommodation' imageList={exposureImages} count={true} empty={false} />
            <LabelDetailTitle title={accommodationLabel} address={address} />
          </Box>
          <InfoCardBox>
            <CardNotice contents={noticeContents} />
          </InfoCardBox>
        </ExposureBox>
      </ContainerRegistrationItem>
      <Tabs
        contents={['객실/위치 정보', '숙소 정보']}
        elements={[
          <AccommodationRoomsDetail rooms={rooms} info={locationInfo} />,
          <AccommodationInfoDetail detail={detailInfo} />,
        ]}
      ></Tabs>
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
