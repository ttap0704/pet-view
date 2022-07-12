interface UserType {
  id: number;
  login_id: string;
  name: string;
  phone: string;
  wrong_num: number;
  nickname: string;
  profile_path: string | null;
  type: number;
  certification: number;
  likes: { [key: string]: number[] }
}


interface StoreUserType extends UserType {
  uid: number;
  is_mobile: boolean;
}

interface ProgressType {
  loading: boolean
}

interface RadioModalContentsDataType {
  visible: boolean;
  title: string;
  contents: { label: string; id: number | string }[];
}

interface SearchItemTypes {
  label: string;
  type: number;
  checked: boolean;
}

interface SearchItems {
  location: string;
  types: string[];
  menu: string;
}

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
  kakao_chat: string;
  open?: string;
  close?: string;
  last_order?: string;
  [key: string]: string
}

interface ImageType {
  target_id: number;
  category: number;
  file_name: string;
  id: number;
  seq: number;
}

interface ChartData {
  name: string;
  [key: string]: number | string;
}

interface NoticeType {
  id: number;
  title: string;
  contents: string;
  target: number;
  created_at: string;
  new: boolean
}

interface DailyType {
  id: number;
  contents: string;
  writer_id: number;
  created_at: string;
  image_list: ImageType[];
  nickname: string;
  profile_path: string
}

interface CommentType {
  id: number;
  comment: string;
  writer_id: number;
  target_id: number;
  category: number;
  created_at: string;
  nickname: string;
  profile_path: string;
}

interface UserProductType {
  accommodation_images?: { file_name: string }[];
  restaurant_images?: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
  sido: string;
  image_list: ImageListType[];
}

declare module 'react-quill';
declare module 'quill-image-resize-module';
declare module '@looop/quill-image-resize-module-react';