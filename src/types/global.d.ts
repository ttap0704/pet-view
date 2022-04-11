interface ImageListType {
  new: boolean;
  src: string;
  origin: number;
  file: File | null;
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

interface OrderListDataType {
  label: string;
  number: string;
  origin: number;
}

interface orderContents {
  visible: boolean;
  list: OrderListDataType[];
  title: string;
}

interface ServiceInfoType {
  contact: string;
  site: string;
  kakao: string;
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
