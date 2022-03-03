import { useState, createContext, useContext } from 'react';

// ========================================================================================
// Type 설정

interface TableDataType {
  header: { label: string; center: boolean; key: string; type?: string }[];
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
  clicked_row_button_idx: null | number;
  clicked_row_button_key: null | string;
  clicked_dropdown_idx: null | number;
}

interface TableControllerType {
  data: TableDataType;
  clearTableData: () => void;
  setTableContents: (contents: ChildrenDataType) => void;
  setButtonDisabled: (max: number) => void;
  clickDirection: (dir: string) => void;
  setChecked: (idx: number, event_type: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  setClickedButtonIndex: (idx: number, key: string) => void;
  setClickedDropdownIndex: (idx: number) => void;
}

// ========================================================================================
// 초기값 설정
export const TableContext = createContext<TableControllerType>({
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
    clicked_row_button_idx: null,
    clicked_row_button_key: null,
    clicked_dropdown_idx: null,
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
  setChecked: (idx: number, event_type: string, e?: React.ChangeEvent<HTMLInputElement>) => {
    return;
  },
  setClickedButtonIndex: (idx: number, key: string) => {
    return;
  },
  setClickedDropdownIndex: (idx: number) => {
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
    clicked_row_button_idx: null,
    clicked_row_button_key: null,
    clicked_dropdown_idx: null,
  });

  // 모달 컨트롤러
  const modalController: TableControllerType = {
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
        clicked_row_button_idx: null,
        clicked_row_button_key: null,
        clicked_dropdown_idx: null,
      });
    },
    setTableContents: (contents: ChildrenDataType) => {
      console.log(contents);
      const max = Math.ceil(contents.rows_length / 5);
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
    setClickedButtonIndex: (idx: number, key: string) => {
      setTableData(state => {
        return {
          ...state,
          clicked_row_button_idx: idx,
          clicked_row_button_key: key,
        };
      });

      setTimeout(() => {
        setTableData(state => {
          return {
            ...state,
            clicked_row_button_idx: null,
            clicked_row_button_key: null,
          };
        });
      }, 100);
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
    setChecked: (idx: number, event_type: string, e?: React.ChangeEvent<HTMLInputElement>) => {
      let checked: string | boolean | undefined = undefined;
      if (event_type == 'change' && e) {
        checked = e.target.checked;
      } else {
        checked = !tableData.table_items[idx].checked;
      }

      setTableData(state => {
        return {
          ...state,
          table_items: [
            ...state.table_items.map((data, index) => {
              if (checked) {
                if (index != idx) {
                  data.checked = false;
                  return data;
                } else {
                  data.checked = true;
                  return data;
                }
              } else {
                if (index == idx) {
                  data.checked = false;
                  return data;
                } else {
                  return data;
                }
              }
            }),
          ],
          button_disabled: !checked,
        };
      });
    },
    setClickedDropdownIndex: (idx: number) => {
      setTableData(state => {
        return {
          ...state,
          clicked_dropdown_idx: idx,
        };
      });

      setTimeout(() => {
        setTableData(state => {
          return {
            ...state,
            clicked_dropdown_idx: null,
          };
        });
      }, 100);
      return;
    },
  };

  return (
    <>
      <TableContext.Provider value={modalController}>{children}</TableContext.Provider>
    </>
  );
}

export default TableProvider;
