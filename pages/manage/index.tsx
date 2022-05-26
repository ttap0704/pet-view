import UtilBox from '../../src/components/common/UtilBox';
import Dropdown from '../../src/components/dropdown/Dropdown';
import ChartLine from '../../src/components/chart/ChartLine';
import { Box, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { useEffect, useState } from 'react';
import { fetchGetApi } from '../../src/utils/api';
import { setMonthKorDropdownItems } from '../../src/utils/tools';

const MainTitle = styled('h3')(({ theme }) => ({}));

const ChartBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
}));

const ManageIndex = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const [monthDropdownItems, setMonthDropdownItems] = useState<string[]>([]);
  const [selectedDropdownIdx, setSelectedDropdownIdx] = useState(0);

  useEffect(() => {
    if (user.uid > 0) {
      getChartDate();
    }
  }, [user.uid, selectedDropdownIdx]);

  const getChartDate = async () => {
    let cur_dropdown_items = [...monthDropdownItems];
    if (monthDropdownItems.length == 0) {
      const last_year = new Date(new Date().setFullYear(2021));
      const dropdown_items = setMonthKorDropdownItems(last_year);

      cur_dropdown_items = [...dropdown_items];

      setMonthDropdownItems([...dropdown_items]);
    }

    const selected_year = cur_dropdown_items[selectedDropdownIdx].slice(0, 4);
    const selected_month = cur_dropdown_items[selectedDropdownIdx].slice(6, 8);
    const chart_res = await fetchGetApi(
      `/admin/${user.uid}/chart/views?type=${user.type}&year=${selected_year}&month=${selected_month}`,
    );
  };

  return (
    <>
      <UtilBox>
        <MainTitle>월별 조회수</MainTitle>
        <Dropdown
          items={monthDropdownItems}
          onClick={setSelectedDropdownIdx}
          buttonDisabled={false}
          title={monthDropdownItems[selectedDropdownIdx]}
          variant='outlined'
        />
      </UtilBox>
      <ChartBox>
        <ChartLine />
      </ChartBox>
    </>
  );
};

export default ManageIndex;
