
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

interface EntireMenuCategoryType {
  category: string
  createdAt: string
  deletedAt: null | string
  id: number
  restaurant_id: number
  seq: number
  updatedAt: string
}

interface ExposureMenuResponse {
  id: number;
  comment: string;
  label: string;
  price: number;
  restaurant_id: number;
  restaurant_label: string;
  exposure_menu_image: ImageType
}

interface EntireMenuCategoryResponse {
  id: number;
  restaurant_id: number;
  category: string;
  restaurant_label: string;
  menu: EntireMenuType[]
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
