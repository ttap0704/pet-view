import { useState, createContext, useContext } from 'react';

// ========================================================================================
// Type 설정

interface TableDataType {
  header: { label: string; center: boolean }[];
  edit_items: string[];
  type: string;
  title: string;
  count: number;
  button_disabled: boolean;
  page: number;
  per_page: number;
  left: boolean;
  right: boolean;
  rows_length: number;
  max: number;
  footer_colspan: number;
  table_items: { [key: string]: any }[];
}

interface ModalControllerType {
  data: TableDataType;
  clearTableData: () => void;
  setTableContents: (contents: ChildrenDataType) => void;
  setButtonDisabled: (max: number) => void;
  clickDirection: (dir: string) => void;
}

// ========================================================================================
// 초기값 설정
export const TableContext = createContext<ModalControllerType>({
  data: {
    header: [],
    edit_items: [],
    type: '',
    count: 0,
    title: '',
    button_disabled: true,
    page: 1,
    per_page: 1,
    left: false,
    right: false,
    rows_length: 0,
    max: 0,
    footer_colspan: 1,
    table_items: [],
  },
  clearTableData: () => {
    return;
  },
  setTableContents: (contents: ChildrenDataType) => {
    return;
  },
  setButtonDisabled: (max: number) => {
    return;
  },
  clickDirection: (dir: string) => {
    return;
  },
});

// ========================================================================================
// Provider 설정

function TableProvider(props: { children: React.ReactNode }) {
  const children = props.children;
  const [tableData, setTableData] = useState<TableDataType>({
    header: [],
    edit_items: [],
    type: '',
    count: 0,
    title: '',
    button_disabled: true,
    page: 1,
    per_page: 1,
    left: false,
    right: false,
    rows_length: 0,
    max: 0,
    footer_colspan: 1,
    table_items: [],
  });

  // 모달 컨트롤러
  const modalController: ModalControllerType = {
    data: tableData,
    clearTableData: () => {
      setTableData({
        header: [],
        edit_items: [],
        type: '',
        count: 0,
        title: '',
        button_disabled: true,
        page: 1,
        per_page: 1,
        left: false,
        right: false,
        rows_length: 0,
        max: 0,
        footer_colspan: 1,
        table_items: [],
      });
    },
    setTableContents: (contents: ChildrenDataType) => {
      console.log(contents);
      const max = contents.rows_length / 5;
      let left = false;
      let right = false;

      if (max == 1) {
        left = true;
        right = true;
      } else {
        left = true;
        right = false;
      }

      setTableData({
        ...tableData,
        ...contents,
        max,
        left,
        right,
      });
    },

    setButtonDisabled: (max: number) => {},
    clickDirection: (dir: string) => {
      const per_page = tableData.per_page;
      const max = Math.ceil(tableData.rows_length / 5);

      let page = 0;
      let left = false;
      let right = true;
      if (dir == 'left') {
        if (per_page == 2) {
          page = 1;
          left = true;
          right = false;
        } else if (per_page > 2) {
          page = per_page - 1;
          right = false;
          left = false;
        }
      } else if (dir == 'right') {
        if (per_page == max - 1) {
          page = max;
          left = false;
          right = true;
        } else if (per_page < max) {
          page = per_page + 1;
          right = false;
          left = false;
        }
      }

      setTableData({
        ...tableData,
        per_page: page,
        left,
        right,
      });
    },
  };

  return (
    <>
      <TableContext.Provider value={modalController}>{children}</TableContext.Provider>
    </>
  );
}

export default TableProvider;
