import { useEffect, useState, useContext } from 'react';

import { product_menu } from '../../../src/utils/admin_items';
import Table from '../../../src/components/table/Table';
import { fetchGetApi } from '../../../src/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { TableContext } from '../../../src/provider/TableProvider';
import { getDate } from '../../../src/utils/tools';

const SuperProductRestaurant = () => {
  const [productContents, setProductContents] = useState<ChildrenDataType>(product_menu);
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);

  useEffect(() => {
    getTableItems();
  }, []);

  const getTableItems = async () => {
    const list = await fetchGetApi(`/super/product/restaurant?page=${data.per_page}`);
    const count = list.count;
    const rows = list.rows;

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        label: x.label,
        president: x.president,
        email: x.email,
        status: x.status,
        checked: false,
      });
    }

    setProductContents({
      ...productContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={productContents} />
    </>
  );
};

export default SuperProductRestaurant;
