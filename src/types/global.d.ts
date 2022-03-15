interface ImageListType {
  new: boolean;
  src: string;
  origin: number;
  file: File | null;
}

interface AddRoomContentsType {
  label: string;
  price: string;
  standard_num: string;
  maximum_num: string;
  image_list: ImageListType[];
}

interface AddExposureMenuContentsType {
  label: string;
  price: string;
  comment: string;
  image_list: ImageListType[];
}

interface AddEntireMenuContentsType {
  category: string;
  menu: { label: string, price: string }[],
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
  rows: AccommodationResponse[];
}

interface AccommodationRoomsListType {
  count: number;
  rows: RoomType[];
}

interface RestaurantListType {
  count: number;
  rows: RestaurantResponse[];
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

interface RestaurantResponse {
  restaurant_images: ImageType[];
  exposure_menu: ExposureMenuType[];
  entire_menu: EntireMenuType[];
  entire_menu_category: EntireMenuCategoryType[]
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

interface RestaurantType {
  restaurant_id: number;
  exposure_menu: ExposureMenuType[];
  entrie_menu: EntireMenuType[];
}


interface ImageType {
  accommodation_id: number;
  category: number;
  exposure_menu_id: null;
  file_name: string;
  id: number;
  restaurant_id: null;
  rooms_id: null;
  seq: number;
}


interface CreateAccommodationResponse {
  accommodation_id: number;
  rooms: RoomType[];
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


interface EntireMenuCategoryType {
  category: string
  createdAt: string
  deletedAt: null | string
  id: number
  restaurant_id: number
  seq: number
  updatedAt: string
}

interface ExposureMenuType {
  restaurant_id: number;
  createdAt: string;
  id: number;
  label: string;
  price: number;
  seq: number;
  updatedAt: string;
}

interface EntireMenuType {
  category_id: number;
  createdAt: string;
  id: number;
  label: string;
  price: number;
  restaurant_id: number;
  seq: number;
  updatedAt: string;
}

interface OrderListDataType {
  label: string;
  number: string;
  origin: number;
}