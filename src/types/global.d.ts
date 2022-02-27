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