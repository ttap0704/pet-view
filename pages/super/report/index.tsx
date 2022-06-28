import { useEffect, useState, useContext } from 'react';

import { reports } from '../../../src/utils/admin_items';
import Table from '../../../src/components/table/Table';
import { fetchGetApi, fetchPostApi } from '../../../src/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { TableContext } from '../../../src/provider/TableProvider';
import { getDate } from '../../../src/utils/tools';
import { ModalContext } from '../../../src/provider/ModalProvider';
import ModalCheckContents from '../../../src/components/modal/ModalCheckContents';

const SuperReport = () => {
  const [reportContents, setReportContents] = useState<ChildrenDataType>(reports);
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_alert } = useContext(ModalContext);
  const [modalCheckContents, setModalCheckContents] = useState({
    visible: false,
    contents: '',
  });

  useEffect(() => {
    return () => {
      setReportContents({
        ...reportContents,
        table_items: [],
      });
    };
  }, []);

  useEffect(() => {
    getTableItems();
  }, [data.per_page]);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if (target_idx == 0) {
        modal_confirm.openModalConfirm('해당 레포트를 삭제하시겠습니까?', () => {
          deleteReport(target.id);
        });
      } else if (target_idx == 1) {
        //
      } else if (target_idx == 2) {
        sendWarning(target.target_id, target.category);
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      const target = data.table_items[data.clicked_row_button_idx];
      if (data.clicked_row_button_key == 'target_id') {
        const cur_target_id = data.table_items[data.clicked_row_button_idx].target_id;
        if (target.category == '댓글') {
          openCommentCheckModal(cur_target_id);
        }
        console.log();
        // window.open(data.table_items[data.clicked_row_button_idx].target_id);
      }
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const sendWarning = async (target_id: number, category: string) => {
    if (['댓글', '일상'].includes(category)) {
      const url = category == '댓글' ? `/comment/${target_id}` : `/daily/${target_id}`;
      const cur_conent = await fetchGetApi(url);
      const res = await fetchPostApi(`/super/users/${cur_conent.writer_id}/warning`, {
        warning: 0,
      });

      if (res.affected == 1) {
        modal_alert.openModalAlert('타겟의 경고가 추가되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 경고가 실패되었습니다.');
      }
    }
    console.log(category, target_id);
  };

  const openCommentCheckModal = async (id: number) => {
    const comment = await fetchGetApi(`/comment/${id}`);
    if (comment.id == null) {
      modal_alert.openModalAlert('게시물이 삭제된 상태입니다.');
    } else {
      setModalCheckContents({
        visible: true,
        contents: comment.comment,
      });
    }
  };

  const deleteReport = async (id: number) => {
    const delete_res = await fetchPostApi(`/super/report/${id}/delete`, {});

    if (delete_res.affected == 1) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
      getTableItems();
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
  };

  const getTableItems = async () => {
    const list = await fetchGetApi(`/super/report?page=${data.per_page}`);
    const count = list.count;
    const rows = list.rows;

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        reason: x.reason,
        category: x.category,
        target_id: x.target_id,
        created_at: getDate(x.created_at),
        checked: false,
      });
    }

    setReportContents({
      ...reportContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={reportContents} />
      <ModalCheckContents
        visible={modalCheckContents.visible}
        contents={modalCheckContents.contents}
        onClose={() => setModalCheckContents({ ...modalCheckContents, visible: false })}
      />
    </>
  );
};

export default SuperReport;
