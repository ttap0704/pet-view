export default {
  label: (label: string): boolean => {
    let res = true;
    if (label.length == 0) res = false

    return res;
  },
  room: (room: AddRoomContentsType): boolean => {
    let res = true;
    for (const [key, val] of Object.entries(room)) {
      if (key != 'image_list' && val.length == 0) {
        res = false;
        break;
      }
    }
    return res;
  },
  image_list: (image_list: ImageListType[]): boolean => {
    let res = true;
    if (image_list.length == 0) {
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
          cur_date = `1000-${cur_date}`
        } else {
          cur_date = `1001-${cur_date}`
        }

        for (let y = 0; y < season.length; y++) {
          const vali_season = season[y];
          let start = vali_season[0];
          let end = vali_season[1];
          if (start > end) {
            start = `1000-${start}`
            end = `1001-${end}`
          } else {
            start = `1001-${start}`
            end = `1001-${end}`
          }

          if (i != y && cur_date >= start && cur_date <= end) {
            return false;
          }
        }
      }
    }

    return true;
  }
}