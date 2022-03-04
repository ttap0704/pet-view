import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchPatchApi } from '../../../src/utils/api';
import { getDate } from '../../../src/utils/tools';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalPostcodeForm from '../../../src/components/modal/ModalPostcodeForm';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';

const ManageAccommodationInfo = (props: { list: AccommodationListType; style: { [key: string]: string } }) => {
  const { data } = useContext(TableContext);
  const { modal_edit, modal_alert } = useContext(ModalContext);

  const [postcodeVisible, setPostcodeVisible] = useState<boolean>(false);
  const [infoContents, setInfoContents] = useState<ChildrenDataType>({
    header: [
      {
        label: 'check',
        center: true,
        key: 'check',
        type: 'checkbox',
      },
      {
        label: '이름',
        center: false,
        key: 'label',
      },
      {
        label: '주소',
        center: false,
        key: 'address',
      },
      {
        label: '방 개수',
        center: false,
        key: 'rooms_num',
      },
      {
        label: '소개',
        center: true,
        key: 'introduction',
        type: 'button',
      },
      {
        label: '등록일',
        center: false,
        key: 'created_at',
      },
    ],
    edit_items: [
      '객실 추가',
      '업소명 수정',
      '주소 수정',
      '소개 수정',
      '대표이미지 수정',
      '객실 순서 변경',
      '업소 삭제',
    ],
    type: 'accommodation',
    title: '숙박업소 관리',
    rows_length: 0,
    footer_colspan: 6,
    table_items: [],
  });

  useEffect(() => {
    getTableItems(props.list);
  }, []);

  useEffect(() => {
    if (data.clicked_dropdown_idx) {
      if ([1, 3].includes(data.clicked_dropdown_idx)) {
        setModalEdit();
      } else if (data.clicked_dropdown_idx == 2) {
        setPostcodeVisible(true);
      }
      console.log(data.clicked_dropdown_idx);
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      modal_edit.openModalEdit(
        '소개',
        data.table_items[data.clicked_row_button_idx][data.clicked_row_button_key],
        '',
        'textarea',
        true,
      );
      console.log(data.clicked_row_button_idx, data.clicked_row_button_key);
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const setModalEdit = () => {
    const index = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);

    let value = '';
    let title = '';
    let target_string = '';
    let type: 'input' | 'textarea' = 'input';
    let format = '';

    if (target) {
      switch (index) {
        case 1:
          value = target.label;
          title = '업소명 수정';
          target_string = 'label';
          break;
        case 3:
          value = target.introduction;
          title = '소개 수정';
          target_string = 'introduction';
          type = 'textarea';
          break;
      }

      modal_edit.openModalEdit(title, value, target_string, type);
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      let url = `/manager/1/accommodation/${target.id}`;

      const status = await fetchPatchApi(url, { target: target_string, value });

      if (status == 200) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async (list?: AccommodationListType) => {
    let count = 0;
    let rows = [];
    if (list) {
      count = list.count;
      rows = list.rows;
    } else {
      const accommodation: AccommodationListType = await fetchGetApi(`/manager/1/accommodation?page=${data.per_page}`);

      count = accommodation.count;
      rows = accommodation.rows;
    }

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        address: `${x.sido} ${x.sigungu} ${x.bname}`,
        bname: x.bname,
        building_name: x.building_name,
        detail_address: x.detail_address,
        introduction: x.introduction,
        label: x.label,
        sido: x.sido,
        sigungu: x.sigungu,
        zonecode: x.zonecode,
        rooms: x.accommodation_rooms,
        rooms_num: x.accommodation_rooms.length,
        created_at: getDate(x.createdAt),
        images: x.accommodation_images,
        checked: false,
      });
    }

    setInfoContents({
      ...infoContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={infoContents} />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalPostcodeForm
        visible={postcodeVisible}
        onClose={() => setPostcodeVisible(false)}
        onChangeAddress={(address: ResponsePostcodeDataType) => console.log(address)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data: AccommodationListType = await fetchGetApi(`/manager/1/accommodation`);

  return {
    props: {
      list: data,
    },
  };
};

export default ManageAccommodationInfo;
