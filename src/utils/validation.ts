export default {
  address: (address: FinalPostcodeDataType): boolean => {
    let res = true;
    if (address.road_address.length == 0) res = false;

    return res;
  },
  season: (season: string[][]): boolean => {

    for (let i = 0, leng = season.length; i < leng; i++) {
      const cur_season = season[i];

      for (let j = 0, jleng = cur_season.length; j < jleng; j++) {
        const cur_date = cur_season[j];

        for (let y = 0; y < i; y++) {
          const vali_season = season[y];
          console.log(cur_date, vali_season, i)
          console.log(cur_date >= vali_season[0] && cur_date <= vali_season[1])
          if (cur_date >= vali_season[0] && cur_date <= vali_season[1]) {
            return false;
          }
        }
      }
    }

    return true;
  }
}