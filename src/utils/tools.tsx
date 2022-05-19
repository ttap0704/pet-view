import { Typography } from '@mui/material';
import Link from 'next/link';
import { fetchPostApi } from './api';

export async function setImageArray(data: { file_name: string }[], set_file?: boolean, type?: string) {
  let image_arr = [];
  let count = 0;

  for (const x of data) {
    let file = null;
    if (set_file && type) {
      file = await imageToBlob(x.file_name, type);
    }

    image_arr.push({
      new: false,
      src: x.file_name,
      origin: count,
      file: file,
    });
    count++;
  }

  return image_arr;
}

export function imageToBlob(src: string, type: string): Promise<File> {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3080/image/${type}/${src}`).then(res => {
      res.blob().then(blob => {
        const file = new File([blob], src, {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        resolve(file);
      });
    });
  });
}

export function setFileToImage(files: FileList | null, exclude_origin_idx: number[]): Promise<ImageListType[]> {
  return new Promise(resolve => {
    let new_file_arr: ImageListType[] = [];
    let count = 0;
    let origin = 0;
    if (files) {
      Array.from(files).forEach(async file => {
        const new_file_name = await readFile(file);
        count++;

        do {
          origin++;
        } while (exclude_origin_idx.includes(origin - 1));

        new_file_arr.push({ new: true, src: new_file_name, origin: origin - 1, file });
        if (count == files.length && new_file_arr.length == files.length) {
          resolve([...new_file_arr]);
        }
      });
    }
  });
}

export function setFileArray(image_list: ImageListType[]) {
  const file_array: File[] = [];
  for (const item of image_list) {
    if (item.file) {
      file_array.push(item.file);
    }
  }
  return file_array;
}

export async function setImageFormData(data: { target_id: number; files: File[] }[], type: string, parent_id?: number) {
  let upload_images = new FormData();
  let count = 0;
  for (const item of data) {
    const target_id = item.target_id;
    const files = item.files;

    for (let i = 0, leng = files.length; i < leng; i++) {
      if (files[i]) {
        const file_name_arr = files[i].name.split('.');
        const file_extention = file_name_arr[file_name_arr.length - 1];
        let file_name = '';
        if (['accommodation', 'restaurant'].includes(type)) {
          file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        } else if (['rooms', 'exposure_menu'].includes(type)) {
          file_name = `${parent_id}_${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
        }

        const new_file = new File([files[i]], file_name, {
          type: 'image/jpeg',
        });

        upload_images.append(`files_${count}`, new_file);
        count++;
      }
    }
  }

  let category = '';
  if (type == 'accommodation') {
    category = '2';
  } else if (type == 'rooms') {
    category = '21';
  } else if (type == 'restaurant') {
    category = '1';
  } else if (type == 'exposure_menu') {
    category = '11';
  }
  upload_images.append('length', count.toString());
  upload_images.append('category', category);

  return upload_images;
}

export function readFile(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  });
}

export function getDate(req: string) {
  const year = new Date(req).getFullYear();
  const month = new Date(req).getMonth() + 1 < 10 ? `0${new Date(req).getMonth() + 1}` : new Date(req).getMonth() + 1;
  const date = new Date(req).getDate() < 10 ? `0${new Date(req).getDate()}` : new Date(req).getDate();
  return `${year}-${month}-${date}`;
}

export function getSeasonPriceKey(date: string, season: PeakSeasonType[]): RoomPriceKeys {
  let res = false;
  let key: RoomPriceKeys = 'normal_price';
  const target_date = `1001-${date}`;
  for (let i = 0, leng = season.length; i < leng; i++) {
    const cur_season = season[i];
    let start = cur_season.start;
    let end = cur_season.end;
    if (new Date(start) < new Date(end)) {
      start = `1001-${start}`;
      end = `1001-${end}`;
    } else {
      start = `1000-${start}`;
      end = `1001-${end}`;
    }

    if (new Date(start) <= new Date(target_date) && new Date(end) >= new Date(target_date)) {
      res = true;
      break;
    }
  }

  const day = new Date().getDay();
  if (res) {
    if ([5, 6].includes(day)) {
      key = 'peak_weekend_price';
    } else {
      key = 'peak_price';
    }
  } else {
    if ([5, 6].includes(day)) {
      key = 'normal_weekend_price';
    } else {
      key = 'normal_price';
    }
  }

  return key;
}

export function getNoticeContents(details: ServiceInfoType): (string | React.ReactElement)[] {
  const detail_type_text: { [key: string]: string } = {
    contact: '문의',
    kakao_chat: '오픈채팅',
    site: '홈페이지',
    open: '오픈',
    close: '마감',
    last_order: '마지막 주문',
  };

  const tmp_contents: (string | React.ReactElement)[] = [];

  for (const [key, val] of Object.entries(detail_type_text)) {
    if (details[key]) {
      if (key == 'site') {
        tmp_contents.push(
          <>
            {val} :{' '}
            <Link href={details[key]} passHref={true}>
              <Typography component='a' target='_blank'>
                이동
              </Typography>
            </Link>
          </>,
        );
      } else if (key == 'kakao_chat') {
        tmp_contents.push(
          <>
            {val} :{' '}
            <Link href={details[key]} passHref={true}>
              <Typography component='a' target='_blank'>
                문의하기
              </Typography>
            </Link>
          </>,
        );
      } else {
        tmp_contents.push(`${val} : ${details[key]}`);
      }
    }
  }

  return tmp_contents;
}

export const setSearchQuery = (items: SearchItems): string => {
  let cnt = 0;
  let query = '';

  for (const [key, val] of Object.entries(items)) {
    if (val.length > 0) {
      if (cnt == 0) {
        query += '?';
      } else {
        query += '&';
      }

      query += `${key}=${val.toString()}`;
      cnt++;
    }
  }

  return query;
};

export const setLookedUpList = (type: string, id: number) => {
  const session = window.sessionStorage;

  const cur_item = session.getItem(type);
  if (cur_item) {
    const item_json: { list: number[] } = JSON.parse(cur_item);

    if (!item_json.list.includes(id)) {
      const postdate = getDate(`${new Date()}`);
      item_json.list.push(id);

      session.setItem(type, JSON.stringify(item_json));
      fetchPostApi(`/${type}/${id}/count`, { id, postdate });
    }
  }
};

export const setMonthKorDropdownItems = (min_date: Date) => {
  const min_year = min_date.getFullYear();
  const min_month = min_date.getMonth() + 1;

  const today_year = new Date().getFullYear();
  const today_month = new Date().getMonth() + 1;

  const dropdown_items: string[] = [];
  for (let i = today_year, leng = min_year; i >= leng; i--) {
    for (let y = 12, yleng = 1; y >= yleng; y--) {
      if (i == today_year && y > today_month) {
        continue;
      }
      if (i == min_year && y < min_month) {
        break;
      }
      dropdown_items.push(`${i}년 ${y < 10 ? `0${y}` : y}월`);
    }
  }

  return dropdown_items;
};
