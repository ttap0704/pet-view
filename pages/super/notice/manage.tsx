import { Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import Table from '../../../src/components/table/Table';

import { fetchGetApi } from '../../../src/utils/api';
import { notice } from '../../../src/utils/admin_items';
import { TableContext } from '../../../src/provider/TableProvider';
import { getDate } from '../../../src/utils/tools';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { fetchPostApi } from '../../../src/utils/api_back';
import { useRouter } from 'next/router';
import CustomDropdown from '../../../src/components/dropdown/Dropdown';
import UtilBox from '../../../src/components/common/UtilBox';

const target_arr = ['전체', '유저:공지사항', '관리자:공지사항', '유저:이벤트', '관리자:이벤트'];

const AdminRestaurantInfo = () => {
  const [noticeContents, setNoticeContents] = useState<ChildrenDataType>(notice);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_alert } = useContext(ModalContext);
  const router = useRouter();

  const [targetDropdownIdx, setTargetdropdownIdx] = useState(0);

  useEffect(() => {
    getTableItems();

    return () => {
      setNoticeContents({
        ...noticeContents,
        table_items: [],
        rows_length: 0,
      });
    };
  }, [targetDropdownIdx]);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        modal_confirm.openModalConfirm('해당 상품의 노출을 중지시키겠습니까?', () => {
          setNoticeStatus(0, target.id);
        });
      } else if (target_idx == 1) {
        modal_confirm.openModalConfirm('해당 상품의 노출을 진행하시겠습니까?', () => {
          setNoticeStatus(1, target.id);
        });
      } else if (target_idx == 2) {
        modal_confirm.openModalConfirm('해당 공지사항을 수정하시겠습니까?', () => {
          moveEditPage(target.id);
        });
      } else if (target_idx == 3) {
        modal_confirm.openModalConfirm('해당 공지사항을 삭제하시겠습니까?', () => {
          deleteNotcie(target.id);
        });
      }
    }
  }, [data.clicked_dropdown_idx]);

  const moveEditPage = (id: number) => {
    router.push(`/super/notice/registration?id=${id}`, '/super/notice/registration');
  };

  const deleteNotcie = async (id: number) => {
    const response = await fetchPostApi(`/super/notice/${id}/delete`, {});
    if (response) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };

  const setNoticeStatus = async (status: number, id: number) => {
    const update_res = await fetchPostApi(`/super/notice/${id}/info`, { status });

    if (update_res.affected == 1) {
      modal_alert.openModalAlert('수정이 완료되었습니다.');
      getTableItems();
    } else {
      modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
    }
  };

  const getTableItems = async () => {
    let url = `/super/notice?page=${data.per_page}`;
    if (targetDropdownIdx != 0) {
      url += `&target=${targetDropdownIdx}`;
    }
    const notice = await fetchGetApi(url);

    const count = notice.count;
    const rows = notice.rows;

    const tmp_table_items = [];
    for (const x of rows) {
      let target = '';
      if (x.target == 1) {
        target = '유저/공지사항';
      } else if (x.target == 2) {
        target = '관리자/공지사항';
      } else if (x.target == 3) {
        target = '유저/이벤트';
      } else if (x.target == 4) {
        target = '관리자/이벤트';
      }

      tmp_table_items.push({
        id: x.id,
        label: x.title,
        status: x.status === 1 ? '진행' : '중단',
        target,
        created_at: getDate(x.created_at),
        domain: `http://localhost:3001/accommodation/${x.id}`,
        checked: false,
      });
    }

    setNoticeContents({
      ...noticeContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={noticeContents} />
      <UtilBox justifyContent='flex-start'>
        <CustomDropdown
          variant='outlined'
          title={target_arr[targetDropdownIdx]}
          items={target_arr}
          onClick={(idx: number) => setTargetdropdownIdx(idx)}
          buttonDisabled={false}
        />
      </UtilBox>

      {/* <Box className='ql-editor'>{parse(contents)}</Box> */}
    </>
  );
};

export default AdminRestaurantInfo;
