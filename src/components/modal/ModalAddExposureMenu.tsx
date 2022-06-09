import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import FormExposureMenu from '../form/FormExposureMenu';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import { setFileToImage } from '../../utils/tools';

interface ModalAddExposureEenuProps {
  visible: boolean;
  curNumber: number;
  onClose: () => void;
  onComplete: (data: AddExposureMenuContentsType[]) => void;
}

const ModalAddExposureEenuContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  maxHeight: '40rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0rem 2rem',
  backgroundColor: theme.palette.white.main,

  '&.column': {
    flexDirection: 'column',
  },
}));

function ModalAddExposureEenu(props: ModalAddExposureEenuProps) {
  const { modal_alert, modal_confirm } = useContext(ModalContext);
  const visible = props.visible;
  const cur_num = props.curNumber;
  const onClose = props.onClose;
  const onComplete = props.onComplete;

  const [exposureMenuClickIdx, setExposureMenuClickIdx] = useState(0);
  const [exposureMenu, setExposureMenu] = useState<AddExposureMenuContentsType[]>([
    {
      label: '',
      price: '',
      comment: '',
      image_list: [],
    },
  ]);

  useEffect(() => {
    if (!visible) {
      setExposureMenu([
        {
          label: '',
          price: '',
          comment: '',
          image_list: [],
        },
      ]);
    }
  }, [visible]);

  const setExposureMenuImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp_image_list = await setFileToImage(e.target.files, [2]);

    setExposureMenu(state => {
      return [
        ...state.map((menu, menu_idx) => {
          if (menu_idx == exposureMenuClickIdx) {
            return {
              ...menu,
              image_list: tmp_image_list,
            };
          } else {
            return menu;
          }
        }),
      ];
    });
  };

  const handleExposureMenuInput = (e: React.ChangeEvent<HTMLInputElement>, type: string, idx: number) => {
    const value = e.target.value;
    setExposureMenu(state => {
      return [
        ...state.map((menu, menu_idx) => {
          if (menu_idx == idx) {
            return {
              ...menu,
              [`${type}`]: value,
            };
          } else {
            return menu;
          }
        }),
      ];
    });
  };
  const deleteExposureMemu = (idx: number) => {
    if (exposureMenu.length == 1) {
      modal_alert.openModalAlert('1개 이상의 메뉴를 추가해주세요.');
      return;
    }
    const tmp_exposure_menu = [...exposureMenu];
    tmp_exposure_menu.splice(idx, 1);
    setExposureMenu([...tmp_exposure_menu]);
  };

  const addExposureMenu = () => {
    if (Number(cur_num) + exposureMenu.length >= 5) {
      modal_alert.openModalAlert('대표메뉴는 총 5개까지 등록이 가능합니다.');
      return;
    }
    setExposureMenu([
      ...exposureMenu,
      {
        label: '',
        price: '',
        comment: '',
        image_list: [],
      },
    ]);
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='대표메뉴 추가' onClose={onClose} />
          <ModalAddExposureEenuContentsBox>
            <UtilBox justifyContent='flex-end' sx={{ paddingY: '1rem' }}>
              <Button variant='contained' color='blue' onClick={() => addExposureMenu()}>
                메뉴 추가
              </Button>
            </UtilBox>
            {exposureMenu.map((menu, menu_idx) => {
              return (
                <FormExposureMenu
                  onInputClick={() => setExposureMenuClickIdx(menu_idx)}
                  onChangeImage={(e: React.ChangeEvent<HTMLInputElement>) => setExposureMenuImage(e)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) =>
                    handleExposureMenuInput(e, type, menu_idx)
                  }
                  key={`add_menu_form_${menu_idx}`}
                  onDelete={() => deleteExposureMemu(menu_idx)}
                  contents={menu}
                  menuIdx={menu_idx}
                />
              );
            })}
          </ModalAddExposureEenuContentsBox>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() =>
                modal_confirm.openModalConfirm(`대표메뉴를 등록하시겠습니까?`, () => {
                  onComplete(exposureMenu);
                })
              }
            >
              등록
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalAddExposureEenu;
