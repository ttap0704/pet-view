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

const DropdownBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
}));

const AdminIndex = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const [productList, setProductList] = useState<string[]>([]);
  const [productDropdownItems, setProductDropdownItems] = useState<string[]>([]);
  const [monthDropdownItems, setMonthDropdownItems] = useState<string[]>([]);
  const [selectedDropdownProductIdx, setSelectedDropdownProductIdx] = useState(0);
  const [selectedDropdownIdx, setSelectedDropdownIdx] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    return () => {
      setProductList([]);
      setProductDropdownItems([]);
      setMonthDropdownItems([]);
      setSelectedDropdownProductIdx(0);
      setSelectedDropdownIdx(0);
      setChartData([]);
    };
  }, []);

  useEffect(() => {
    if (user.uid > 0) {
      getChartDate();
    }
  }, [user.uid, selectedDropdownProductIdx, selectedDropdownIdx]);

  const getChartDate = async () => {
    let cur_dropdown_items = [...monthDropdownItems];
    let tmp_product_list = productList.length > 0 ? [...productList] : [];
    if (productList.length == 0) {
      const product_res = await fetchGetApi(`/admin/${user.uid}/product`);
      setProductList([...product_res]);
      tmp_product_list = [...product_res];

      if (product_res.length > 0) {
        const items = product_res.map((item: string) => item.split('::')[2]);
        setProductDropdownItems([...items]);
      }
    }
    if (monthDropdownItems.length == 0) {
      const last_year = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      const dropdown_items = setMonthKorDropdownItems(last_year);

      cur_dropdown_items = [...dropdown_items];

      setMonthDropdownItems([...dropdown_items]);
    }
    let chart_res: ChartData[] = [];
    if (tmp_product_list.length > 0) {
      const cur_product = tmp_product_list[selectedDropdownProductIdx];
      const splited_product = cur_product.split('::');
      const selected_year = cur_dropdown_items[selectedDropdownIdx].slice(0, 4);
      const selected_month = cur_dropdown_items[selectedDropdownIdx].slice(6, 8);
      chart_res = await fetchGetApi(
        `/admin/${user.uid}/${splited_product[0]}/${splited_product[1]}/views?year=${selected_year}&month=${selected_month}`,
      );
    }

    setChartData([...chart_res]);
  };

  return (
    <>
      {productList.length > 0 ? (
        <>
          <UtilBox>
            <MainTitle>월별 조회수</MainTitle>
            <DropdownBox>
              <Dropdown
                items={productDropdownItems}
                onClick={setSelectedDropdownProductIdx}
                buttonDisabled={false}
                title={productDropdownItems[selectedDropdownProductIdx]}
                variant='outlined'
              />
              <Dropdown
                items={monthDropdownItems}
                onClick={setSelectedDropdownIdx}
                buttonDisabled={false}
                title={monthDropdownItems[selectedDropdownIdx]}
                variant='outlined'
              />
            </DropdownBox>
          </UtilBox>
          <ChartBox>
            <ChartLine data={chartData} />
          </ChartBox>
        </>
      ) : null}
    </>
  );
};

export default AdminIndex;
