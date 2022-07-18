export default {
  label: (label: string): boolean => {
    let res = true;
    if (label.length == 0) res = false;

    return res;
  },
  type: (payload: { value: string; type: number }): boolean => {
    let res = true;

    const value = payload.value;
    const type = payload.type;
    if (value.length == 0 || type < 1) {
      res = false;
    }
    return res;
  },
  room: (room: AddRoomContentsType): boolean => {
    let res = true;
    const check_number = /^[0-9]+$/;
    for (const [key, val] of Object.entries(room)) {
      if (key != 'image_list' && val.length == 0) {
        res = false;
        break;
      }

      if (key == 'standard_num' || key == 'maximum_num') {
        if (!check_number.test(val)) {
          res = false;
          break;
        }
      }
    }
    return res;
  },
  entire_menu: (entire_menu: AddEntireMenuContentsType[]): { pass: boolean; message: string } => {
    let message = '';
    const check_number = /^[0-9]+$/;
    for (const menu of entire_menu) {
      if (menu.category.length == 0) {
        message = '카테고리명을 한 자이상 입력해주세요.';
        break;
      } else {
        if (menu.menu.length == 0) {
          message = '카테고리의 메뉴는 1개이상 등록되어야 합니다.';
          break;
        } else {
          for (const menu_item of menu.menu) {
            if (menu_item.label.length == 0) {
              message = '전체메뉴의 이름이 비어있습니다. 확인해주세요.';
              break;
            }

            if (`${menu_item.price}`.length == 0) {
              message = '전체메뉴의 가격 비어있습니다. 확인해주세요.';
              break;
            } else if (!check_number.test(`${menu_item.price}`)) {
              message = '전체메뉴의 가격은 숫자로만 입력해주세요.';
              break;
            }
          }
        }
      }
    }

    return { pass: message.length == 0, message };
  },
  exposure_menu: (exposure_menu: AddExposureMenuContentsType[]): { pass: boolean; message: string } => {
    let message = '';
    const check_number = /^[0-9]+$/;

    for (const menu of exposure_menu) {
      if (menu.image_list.length == 0) {
        message = '대표메뉴의 이미지를 등록해주세요.';
        break;
      }
      if (menu.label.length == 0) {
        message = '대표메뉴의 메뉴명을 입력해주세요.';
        break;
      }
      if (menu.price.length == 0) {
        message = '대표메뉴의 메뉴명을 입력해주세요.';
        break;
      } else if (!check_number.test(menu.price)) {
        message = '대표메뉴의 가격은 숫자로만 입력해주세요.';
        break;
      }
      if (menu.comment.length == 0) {
        message = '대표메뉴의 한 줄 설명을 입력해주세요.';
        break;
      }
    }

    return { pass: message.length == 0, message };
  },
  image_list: (image_list: ImageListType[]): boolean => {
    let res = true;
    if (image_list.length == 0) {
      res = false;
    }

    return res;
  },
  time: (time: string): boolean => {
    let res = true;
    const time_format = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

    if (!time_format.test(time)) {
      res = false;
    }

    return res;
  },
  number: (value: string): boolean => {
    let res = true;
    const check_number = /^[0-9]+$/;

    if (!check_number.test(value)) {
      res = false;
    }

    return res;
  },
  service: (info: ServiceInfoType): boolean => {
    let res = true;

    let cnt = 0;
    for (const [key, val] of Object.entries(info)) {
      if (val.length > 0) {
        cnt++;
      }
    }

    if (cnt == 0) {
      res = false;
    }

    return res;
  },
  restaurant_time: (info: ServiceInfoType): boolean => {
    let res = true;

    let cnt = 0;
    for (const [key, val] of Object.entries(info)) {
      if (key == 'open' || key == 'close' || key == 'last_order') {
        if (val.length > 0) {
          cnt++;
        }
      }
    }

    if (cnt != 3) {
      res = false;
    }

    return res;
  },
  address: (address: FinalPostcodeDataType): boolean => {
    let res = true;
    if (address.road_address.length == 0 && address.detail_address.length == 0) {
      res = false;
    }

    return res;
  },
  season: (season: string[][]): boolean => {
    for (let i = 0, leng = season.length; i < leng; i++) {
      const cur_season = season[i];

      for (let j = 0, jleng = 2; j < jleng; j++) {
        let cur_date = cur_season[j];
        if (j == 0 && cur_date > cur_season[1]) {
          cur_date = `1000-${cur_date}`;
        } else {
          cur_date = `1001-${cur_date}`;
        }

        for (let y = 0; y < season.length; y++) {
          const vali_season = season[y];
          let start = vali_season[0];
          let end = vali_season[1];
          if (start > end) {
            start = `1000-${start}`;
            end = `1001-${end}`;
          } else {
            start = `1001-${start}`;
            end = `1001-${end}`;
          }

          if (i != y && cur_date >= start && cur_date <= end) {
            return false;
          }
        }
      }
    }

    return true;
  },
};
