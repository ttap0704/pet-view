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