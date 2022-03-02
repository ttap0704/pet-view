import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';

import { fetchGetApi } from '../../../src/utils/api';
import { getDate } from '../../../src/utils/tools';

import Table from '../../../src/components/table/Table';
import { AccordionSummaryClasses, Checkbox } from '@mui/material';

interface AccommodationListType {
  count: number;
  rows: {
    accommodation_images: {
      accommodation_id: number;
      category: number;
      exposure_menu_id: null;
      file_name: string;
      id: number;
      restaurant_id: null;
      rooms_id: null;
      seq: number;
    }[];
    accommodation_rooms: {
      accommodation_id: 1;
      additional_info: null | string;
      amenities: null | string;
      createdAt: string;
      deletedAt: null | string;
      id: number;
      label: string;
      maximum_num: number;
      price: number;
      seq: number;
      standard_num: number;
      updatedAt: string;
    }[];
    bname: string;
    building_name: string;
    createdAt: string;
    deletedAt: null;
    detail_address: string;
    id: number;
    introduction: string;
    label: string;
    manager: number;
    sido: string;
    sigungu: string;
    updatedAt: string;
    zonecode: string;
  }[];
}

const ManageAccommodationInfo = (props: { list: AccommodationListType; style: { [key: string]: string } }) => {
  const [infoContents, setInfoContents] = useState<ChildrenDataType>({
    header: [
      {
        label: '',
        center: true,
      },
      {
        label: '이름',
        center: false,
      },
      {
        label: '주소',
        center: false,
      },
      {
        label: '방 개수',
        center: false,
      },
      {
        label: '소개',
        center: true,
      },
      {
        label: '등록일',
        center: false,
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

  const getTableItems = async (list?: AccommodationListType) => {
    let count = 0;
    let rows = [];
    if (list) {
      count = list.count;
      rows = list.rows;
    } else {
      const accommodation: AccommodationListType = await fetchGetApi('/manager/1/accommodation');

      count = accommodation.count;
      rows = accommodation.rows;
    }

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
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
        created_at: x.createdAt,
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

  // const setTableCell = (cell: string, idx: number) => {
  //   let tag: React.ReactNode | string;
  //   switch (cell) {
  //     case '':
  //       tag = (
  //         <Checkbox
  //           checked={tableItems[idx].checked}
  //           onChange={e => setChecked(idx, 'accommodation', 'change', e)}
  //         ></Checkbox>
  //       );
  //       break;
  //     case '이름':
  //       tag = tableItems[idx].label;
  //       break;
  //     case '주소':
  //       tag = `${tableItems[idx].sido} ${tableItems[idx].sigungu} ${tableItems[idx].bname}`;
  //       break;
  //     case '방 개수':
  //       tag = tableItems[idx].rooms_num;
  //       break;
  //     case '소개':
  //       tag = (
  //         <Button
  //           onClick={() => {
  //             setEditModal({
  //               title: '소개',
  //               visible: true,
  //               value: tableItems[idx].introduction,
  //               type: 'textarea',
  //               read_only: true,
  //               target: 'accommodation',
  //               edit_target: '',
  //             });
  //           }}
  //         >
  //           확인
  //         </Button>
  //       );
  //       break;
  //     case '등록일':
  //       tag = getDate(tableItems[idx].created_at);
  //       break;
  //   }
  // };

  return (
    <>
      <Table contents={infoContents} />
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
