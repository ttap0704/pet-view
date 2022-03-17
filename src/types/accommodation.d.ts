interface AddRoomContentsType {
  label: string;
  price: string;
  standard_num: string;
  maximum_num: string;
  image_list: ImageListType[];
}

interface CreateAccommodationResponse {
  accommodation_id: number;
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

interface AccommodationResponse {
  accommodation_images: ImageType[];
  accommodation_rooms: RoomType[];
  bname: string;
  building_name: string;
  createdAt: string;
  deletedAt: null;
  detail_address: string;
  id: number;
  introduction: string;
  label: string;
  manager: number;
  sido: string;
  sigungu: string;
  updatedAt: string;
  zonecode: string;
}

interface RoomType {
  accommodation_id: number;
  accommodation_label: string;
  additional_info: null | string;
  amenities: null | string;
  createdAt: string;
  deletedAt: null | string;
  id: number;
  label: string;
  maximum_num: number;
  price: number;
  seq: number;
  standard_num: number;
  updatedAt: string;
  rooms_images: ImageType[];
}