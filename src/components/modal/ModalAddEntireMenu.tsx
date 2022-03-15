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
  onClose: () => void;
  onComplete: (data: AddEntireMenuContentsType[]) => void;
}

const ModalAddEntireMenuContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
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
          title: `카테고리 추가`,
          visible: true,
        });
      } else {
        setConetents({
          title: `전체메뉴 추가`,
          visible: false,
        });
      }
    }
  }, [visible]);

  const addEntireMenu = (idx: number) => {
    setEntireMenu(state => {
      return [
        ...state.map((item, item_idx) => {
          if (idx == item_idx) {
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

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={contents.title} onClose={onClose} />
        </ContainerModalContents>
        <ModalAddEntireMenuContentsBox>
          <UtilBox justifyContent='flex-end' sx={{ marginBottom: '1rem' }}>
            <Button color='blue' variant='contained' onClick={addCategory}>
              카테고리 추가
            </Button>
          </UtilBox>
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
          />
        </ModalAddEntireMenuContentsBox>
        <UtilBox>
          <Button
            variant='contained'
            color='orange'
            onClick={() =>
              modal_confirm.openModalConfirm(`대표메뉴를 등록하시겠습니까?`, () => {
                onComplete(entireMenu);
              })
            }
          >
            등록
          </Button>
        </UtilBox>
      </ModalDefault>
    </>
  );
}

export default ModalAddEntireMenu;
