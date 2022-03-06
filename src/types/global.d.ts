interface ImageListType {
  new: boolean;
  src: string;
  origin: number;
  file: File | null
}

interface AddRoomContentsType {
  label: string
  price: string
  standard_num: string
  maximum_num: string
  image_list: ImageListType[],
}

interface ResponsePostcodeDataType {
  zonecode: string;
  sido: string;
  sigungu: string;
  bname: string;
  road_address: string;
  building_name: string;
}

interface FinalPostcodeDataType {
  zonecode: string;
  sido: string;
  sigungu: string;
  bname: string;
  road_address: string;
  building_name: string;
  detail_address: string;
}

interface ChildrenDataType {
  header: { label: string; center: boolean, key: string, type?: string }[];
  edit_items: string[];
  type: string;
  title: string;
  rows_length: number;
  footer_colspan: number;
  table_items: { [key: string]: any }[];
}

interface AccommodationListType {
  count: number;
  rows: {
    accommodation_images: {
      accommodation_id: number;
      category: number;
      exposure_menu_id: null;
      file_name: string;
      id: number;
      restaurant_id: null;
      rooms_id: null;
      seq: number;
    }[];
    accommodation_rooms: {
      accommodation_id: 1;
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
    }[];
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
  }[];
}

interface CreateAccommodationResponse {
  accommodation_id: number;
  rooms: CreateRoomsResponse[];
}

interface CreateRoomsResponse {
  accommodation_id: number;
  createdAt: string;
  id: number;
  label: string;
  maximum_num: string;
  price: string;
  seq: number;
  standard_num: string;
  updatedAt: string;
}