interface RestaurantListType {
  count: number;
  rows: RestaurantResponse[];
}

interface ExposureMenuListType {
  count: number;
  rows: ExposureMenuResponse[];
}

interface EntireMenuCategoryListType {
  count: number;
  rows: EntireMenuCategoryResponse[];
}

interface EntireMenuListType {
  count: number;
  rows: EntireMenyResponse[];
}

interface RestaurantResponse {
  restaurant_images: ImageType[];
  exposure_menu: ExposureMenuType[];
  entire_menu: EntireMenuType[];
  entire_menu_category: EntireMenuCategoryType[];
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
  road_address: string;
  updatedAt: string;
  zonecode: string;
  contact: string;
  site: string;
  kakao_chat: string;
  open: string;
  close: string;
  last_order: string;
}
interface CreateRestaurantResponse {
  id: number;
  exposure_menu: ExposureMenuType[];
}

interface RestaurantType {
  id: number;
  restaurant_id: number;
  exposure_menu: ExposureMenuType[];
  entrie_menu: EntireMenuType[];
}

interface EntireMenuCategoryType {
  category: string;
  created_at: string;
  deletedAt: null | string;
  id: number;
  restaurant_id: number;
  seq: number;
  updatedAt: string;
  menu: EntireMenuType[];
}

interface ExposureMenuResponse {
  id: number;
  comment: string;
  label: string;
  price: number;
  restaurant_id: number;
  restaurant_label: string;
  exposure_menu_image: ImageType;
}

interface EntireMenuCategoryResponse {
  id: number;
  restaurant_id: number;
  category: string;
  restaurant_label: string;
  menu: EntireMenuType[];
}

interface ExposureMenuType {
  restaurant_id: number;
  created_at: string;
  id: number;
  label: string;
  price: number;
  seq: number;
  updated_at: string;
  comment: string;
  exposure_menu_image: ImageType;
}

interface EntireMenuType {
  category_id: number;
  created_at: string;
  id: number;
  label: string;
  price: number;
  restaurant_id: number;
  seq: number;
  updatedAt: string;
}

interface EntireMenuResponse extends EntireMenuType {
  category: string;
  restaurant_label: string;
}

interface AddExposureMenuContentsType {
  label: string;
  price: string;
  comment: string;
  image_list: ImageListType[];
}

interface AddEntireMenuContentsType {
  category: string;
  menu: { label: string; price: string | number }[];
}
