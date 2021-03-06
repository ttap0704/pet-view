interface AddRoomContentsType {
  label: string;
  normal_price: string;
  normal_weekend_price: string;
  peak_price: string;
  peak_weekend_price: string;
  standard_num: string;
  maximum_num: string;
  image_list: ImageListType[];
  entrance: string;
  leaving: string;
}

interface CreateAccommodationResponse {
  id: number;
  rooms: RoomType[];
}

interface AccommodationListType {
  count: number;
  rows: AccommodationResponse[];
}

interface AccommodationRoomsListType {
  count: number;
  rows: RoomType[];
}

interface AccommodationResponse extends ServiceInfoType {
  accommodation_images: ImageType[];
  accommodation_rooms: RoomType[];
  accommodation_peak_season: PeakSeasonType[];
  bname: string;
  building_name: string;
  created_at: string;
  deletedAt: null;
  detail_address: string;
  id: number;
  introduction: string;
  label: string;
  admin: number;
  sido: string;
  sigungu: string;
  updatedAt: string;
  zonecode: string;
  road_address: string;
}

interface PeakSeasonType {
  accommodation_id: number;
  start: string;
  end: string;
}

type ServiceContents = 'contact' | 'site' | 'kakao_chat' | 'open' | 'close' | 'last_order';
type RoomPriceKeys = 'normal_price' | 'normal_weekend_price' | 'peak_price' | 'peak_weekend_price';

interface RoomPriceType {
  normal_price: string;
  normal_weekend_price: string;
  peak_price: string;
  peak_weekend_price: string;
}

interface RoomType extends RoomPriceType {
  accommodation_id: number;
  accommodation_label: string;
  additional_info: null | string;
  amenities: null | string;
  created_at: string;
  deletedAt: null | string;
  id: number;
  label: string;
  maximum_num: number;
  seq: number;
  standard_num: number;
  entrance: string;
  leaving: string;
  updatedAt: string;
  rooms_images: ImageType[];
}
