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


export const accommodation_rooms = {
  header: [
    {
      label: 'check',
      center: true,
      key: 'check',
      type: 'checkbox',
    },
    {
      label: '숙박 업소명',
      center: false,
      key: 'accommodation_label',
    },
    {
      label: '객실명',
      center: false,
      key: 'label',
    },
    {
      label: '기준 인원',
      center: false,
      key: 'standard_num',
    },
    {
      label: '최대 인원',
      center: false,
      key: 'maximum_num',
    },
    {
      label: '가격',
      center: false,
      key: 'price',
    },
    {
      label: '등록일',
      center: false,
      key: 'created_at',
    },
  ],
  edit_items: ["객실명 수정", "기준 인원 수정", "최대 인원 수정", "가격 수정", "대표이미지 수정", "객실 삭제"],
  type: 'rooms',
  title: '객실 관리',
  rows_length: 0,
  footer_colspan: 7,
  table_items: [],
}

export const restaurant_info = {
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
      label: '대표메뉴 개수',
      center: true,
      key: 'exposure_menu_num',
    },
    {
      label: '카테고리 개수',
      center: true,
      key: 'category_num',
    },
    {
      label: '이미지',
      center: true,
      key: 'image',
      type: 'button',
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
    "대표메뉴 추가",
    "대표메뉴 순서 변경",
    "카테고리 추가",
    "카테고리 순서 변경",
    "업소명 수정",
    "주소 수정",
    "소개 수정",
    "대표이미지 수정",
    "음식점 삭제",
  ],
  type: 'accommodation',
  title: '음식점 관리',
  rows_length: 0,
  footer_colspan: 7,
  table_items: [],
}

export const restaurant_category = {
  header: [
    {
      label: 'check',
      center: true,
      key: 'check',
      type: 'checkbox',
    },
    {
      label: "음식점",
      key: 'restaurant_label',
      center: false,
    },
    {
      label: "카테고리",
      key: 'category',
      center: false,
    },
    {
      label: "메뉴수",
      key: 'menu_num',
      center: false,
    },
    {
      label: '메뉴',
      center: true,
      key: 'menu',
      type: 'button',
    },
  ],
  edit_items: ["카테고리명 수정", "메뉴 순서 변경", "카테고리 삭제"],
  type: 'category',
  title: '카테고리 관리',
  rows_length: 0,
  footer_colspan: 7,
  table_items: [],
}

export const restaurant_exposure_menu = {
  header: [
    {
      label: 'check',
      center: true,
      key: 'check',
      type: 'checkbox',
    },
    {
      label: "음식점",
      key: 'restaurant_label',
      center: false,
    },
    {
      label: "메뉴명",
      key: 'label',
      center: false,
    },
    {
      label: "가격",
      key: 'price',
      center: false,
    },
    {
      label: '이미지',
      center: true,
      key: 'image',
      type: 'button',
    },
    {
      label: '한 줄 설명',
      center: true,
      key: 'comment',
      type: 'button',
    },
  ],
  edit_items: ["메뉴명 수정", "가격 수정", "대표이미지 수정", "설명 수정", "메뉴 삭제"],
  type: 'category',
  title: '카테고리 관리',
  rows_length: 0,
  footer_colspan: 7,
  table_items: [],
}
