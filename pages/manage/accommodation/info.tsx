import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi } from '../../../src/utils/api';
import { getDate } from '../../../src/utils/tools';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { AccordionSummaryClasses, Checkbox } from '@mui/material';

const ManageAccommodationInfo = (props: { list: AccommodationListType; style: { [key: string]: string } }) => {
  const { data } = useContext(TableContext);
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
      console.log(data.clicked_dropdown_idx);
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if ((data.clicked_row_button_idx, data.clicked_row_button_key)) {
      console.log(data.clicked_row_button_idx, data.clicked_row_button_key);
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

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
      <ModalEdit title='test' visible={false} />
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
