export const accommodation_info = {
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
}