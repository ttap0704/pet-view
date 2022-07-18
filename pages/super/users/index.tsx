import { useEffect, useState, useContext } from 'react';

import { users } from '../../../src/utils/admin_items';
import Table from '../../../src/components/table/Table';
import { fetchGetApi, fetchPostApi } from '../../../src/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { TableContext } from '../../../src/provider/TableProvider';
import { getDate } from '../../../src/utils/tools';
import { ModalContext } from '../../../src/provider/ModalProvider';

const SuperUsers = () => {
  const [productContents, setProductContents] = useState<ChildrenDataType>(users);
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_alert } = useContext(ModalContext);

  useEffect(() => {
    getTableItems();
  }, []);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        modal_confirm.openModalConfirm('해당 상품의 노출을 중지시키겠습니까?', () => {
          setProductStatus(0, target.id);
        });
      } else if (target_idx == 1) {
        modal_confirm.openModalConfirm('해당 상품의 노출을 진행하시겠습니까?', () => {
          setProductStatus(1, target.id);
        });
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      const target = data.table_items[data.clicked_row_button_idx];
      if (data.clicked_row_button_key == 'domain') {
        window.open(data.table_items[data.clicked_row_button_idx].domain);
      }
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const setProductStatus = async (status: number, id: number) => {
    const update_res = await fetchPostApi(`/super/product/restaurant/${id}/status`, { status });

    if (update_res.affected == 1) {
      modal_alert.openModalAlert('수정이 완료되었습니다.');
      getTableItems();
    } else {
      modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
    }
  };

  const getTableItems = async () => {
    const list = await fetchGetApi(`/super/users?page=${data.per_page}`);
    const count = list.count;
    const rows = list.rows;

    const tmp_table_items = [];
    for (const x of rows) {
      tmp_table_items.push({
        id: x.id,
        checked: false,
        email: x.email,
        phone: x.phone,
        warning: x.warning,
        created_at: getDate(x.created_at),
        type: x.type,
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

export default SuperUsers;
