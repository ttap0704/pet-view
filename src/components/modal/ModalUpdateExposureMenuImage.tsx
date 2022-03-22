import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import InputOutlined from '../input/InputOutlined';
import FormAddRoom from '../form/FormAddRoom';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';
import ImageBox from '../image/ImageBox';
import ButtonFileInput from '../button/ButtonFileInput';

import { HiChevronDoubleRight } from 'react-icons/hi';

interface ModalUpdateExposureMenuProps {
  visible: boolean;
  origin: ImageListType[];
  onClose: () => void;
}

const IconBox = styled(Box)(({ theme }) => ({
  width: '10rem',
  height: '100%',
  svg: {
    width: '8rem',
    height: '8rem',
    color: theme.palette.gray_1.main,
  },
}));

const ModalUpdateExposureMenuContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  maxHeight: '40rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 2rem',
  gap: '5rem',
  overflowY: 'auto',
}));

const CustomButtonFileInput = styled(ButtonFileInput)(({ theme }) => ({
  position: 'absolute',
}));

function ModalUpdateExposureMenu(props: ModalUpdateExposureMenuProps) {
  const { modal_confirm, modal_alert, modal_upload } = useContext(ModalContext);
  const visible = props.visible;
  const origin = props.origin ? props.origin : [];
  const onClose = props.onClose;

  const [rooms, setRooms] = useState<AddRoomContentsType[]>([
    {
      label: '',
      price: '',
      standard_num: '',
      maximum_num: '',
      image_list: [],
    },
  ]);

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='대표메뉴 이미지 수정' onClose={onClose} />
          <UtilBox justifyContent='flex-end' sx={{ paddingX: '2rem' }}></UtilBox>
          <ModalUpdateExposureMenuContentsBox>
            <ImageBox slide={false} imageList={origin} type='exposure_menu' />
            <IconBox>
              <HiChevronDoubleRight />
            </IconBox>
            <ImageBox slide={false} imageList={origin} type='exposure_menu' />
            {/* <ButtonFileInput
              title='대표메뉴 이미지 등록'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
              multiple={false}
              id={`modal_update_exposure_menu_button`}
            /> */}
          </ModalUpdateExposureMenuContentsBox>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={
                () => console.log('hihi')
                // modal_confirm.openModalConfirm(`수정을 완료하시겠습니까?`, () => {
                //   onAddRoom(rooms);
                // })
              }
            >
              수정
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalUpdateExposureMenu;
