import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import ListEntireMenu from '../list/ListEntireMenu';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import { setFileToImage } from '../../utils/tools';

interface ModalAddEntireMenuProps {
  visible: boolean;
  type: string;
  mode: string;
  onClose: () => void;
  onComplete: (data: AddEntireMenuContentsType[]) => void;
  category?: AddEntireMenuContentsType[];
}

const ModalAddEntireMenuContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  maxHeight: '30rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: theme.palette.white.main,
  '&.column': {
    flexDirection: 'column',
  },
}));

function ModalAddEntireMenu(props: ModalAddEntireMenuProps) {
  const { modal_alert, modal_confirm } = useContext(ModalContext);
  const visible = props.visible;
  const type = props.type;
  const mode = props.mode;
  const props_category = props.category;
  const onClose = props.onClose;
  const onComplete = props.onComplete;

  const [contents, setConetents] = useState({
    title: '',
    visible: false,
  });
  const [entireMenu, setEntireMenu] = useState<AddEntireMenuContentsType[]>([
    {
      category: '',
      menu: [{ label: '', price: '' }],
    },
  ]);

  useEffect(() => {
    if (!visible) {
      setEntireMenu([
        {
          category: '',
          menu: [{ label: '', price: '' }],
        },
      ]);
    } else {
      if (type == 'category') {
        setConetents({
          title: `카테고리`,
          visible: true,
        });
      } else {
        setConetents({
          title: `전체메뉴`,
          visible: false,
        });
      }

      if (props_category != undefined) {
        if (mode == 'read') {
          setEntireMenu([...props_category]);
        } else {
          if (type == 'entire_menu') {
            setEntireMenu([...props_category]);
          }
        }
      }
    }
  }, [visible]);

  const addEntireMenu = (idx?: number) => {
    let index = 0;
    if (idx != undefined && Number(idx) >= 0) index = idx;
    setEntireMenu(state => {
      return [
        ...state.map((item, item_idx) => {
          if (index == item_idx) {
            return {
              ...item,
              menu: [
                ...item.menu,
                {
                  label: '',
                  price: '',
                },
              ],
            };
          } else {
            return item;
          }
        }),
      ];
    });
  };

  const addCategory = () => {
    setEntireMenu([
      ...entireMenu,
      {
        category: '',
        menu: [{ label: '', price: '' }],
      },
    ]);
  };

  const deleteEntireMenu = (idx: number, children_idx: number | undefined) => {
    const tmp_entire_menu = [...entireMenu];
    if (children_idx == undefined) {
      tmp_entire_menu.splice(idx, 1);
    } else if (children_idx != undefined) {
      tmp_entire_menu[idx].menu.splice(children_idx, 1);
    }
    setEntireMenu([...tmp_entire_menu]);
  };

  const handleEntireMenuInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    idx: number,
    children: string | undefined,
    children_idx: number | undefined,
  ) => {
    const value = e.target.value;
    const tmp_entire_menu = [
      ...entireMenu.map((item, item_idx) => {
        if (idx == item_idx) {
          if (!children && !children_idx) {
            return {
              ...item,
              category: value,
            };
          } else {
            return {
              ...item,
              menu: [
                ...item.menu.map((menu, menu_idx) => {
                  if (children_idx == menu_idx) {
                    return {
                      ...menu,
                      [`${children}`]: value,
                    };
                  } else {
                    return menu;
                  }
                }),
              ],
            };
          }
        } else {
          return item;
        }
      }),
    ];
    setEntireMenu(tmp_entire_menu);
  };

  const confirmComplete = () => {
    let check = true;
    for (const category of entireMenu) {
      for (const menu of category.menu) {
        if (menu.price == '') {
          check = false;
          break;
        }
      }
    }

    if (!check) {
      modal_alert.openModalAlert('가격을 모두 입력해주세요');
      return;
    }
    modal_confirm.openModalConfirm(`${contents.title}를 등록하시겠습니까?`, () => {
      onComplete(entireMenu);
    });
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={contents.title + (mode == 'add' ? ' 추가' : '')} onClose={onClose} />
          <ModalAddEntireMenuContentsBox>
            {mode == 'add' ? (
              <UtilBox justifyContent='flex-end' sx={{ marginBottom: '1rem' }}>
                <Button
                  color='blue'
                  variant='contained'
                  onClick={() => {
                    if (type == 'category') {
                      addCategory();
                    } else {
                      addEntireMenu();
                    }
                  }}
                >
                  {contents.title} 추가
                </Button>
              </UtilBox>
            ) : null}
            <ListEntireMenu
              entireMenu={entireMenu}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                type: string,
                idx: number,
                children_type?: string,
                children_idx?: number,
              ) => handleEntireMenuInput(e, type, idx, children_type, children_idx)}
              onAddMenu={addEntireMenu}
              onDeleteMenu={deleteEntireMenu}
              mode={mode}
              type={type}
            />
          </ModalAddEntireMenuContentsBox>
          {mode == 'add' ? (
            <UtilBox>
              <Button variant='contained' color='orange' onClick={confirmComplete}>
                등록
              </Button>
            </UtilBox>
          ) : null}
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalAddEntireMenu;
