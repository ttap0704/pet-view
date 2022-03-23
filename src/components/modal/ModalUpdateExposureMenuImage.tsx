import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { setFileToImage } from '../../../src/utils/tools';

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
  onCompleteChange: (data: ImageListType[]) => void;
}

const IconBox = styled(Box)(({ theme }) => ({
  width: '10rem',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 2rem 3rem',
  gap: '5rem',
}));
function ModalUpdateExposureMenu(props: ModalUpdateExposureMenuProps) {
  const { modal_confirm, modal_alert, modal_upload } = useContext(ModalContext);
  const visible = props.visible;
  const origin = props.origin ? props.origin : [];
  const onClose = props.onClose;
  const onCompleteChange = props.onCompleteChange;
  const [newImage, setNewImage] = useState<ImageListType[]>([]);

  useEffect(() => {
    if (!visible) {
      setNewImage([]);
    }
  }, [visible]);

  const setPreviewNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_file: FileList | null = e.target.files != null ? e.target.files : null;
    if (new_file) {
      const new_image_list: ImageListType[] = await setFileToImage(new_file, [2]);
      setNewImage(new_image_list);
    }
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='대표메뉴 이미지 수정' onClose={onClose} />
          <ModalUpdateExposureMenuContentsBox>
            <ImageBox slide={false} imageList={origin} type='exposure_menu' emptyText='등록된 이미지가 없습니다.' />
            <IconBox>
              <HiChevronDoubleRight />
            </IconBox>
            <ImageBox slide={false} imageList={newImage} type='exposure_menu' />
            <ButtonFileInput
              title='이미지 등록'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewNewImage(e)}
              multiple={false}
              id={`modal_update_exposure_menu_button`}
              sx={{ position: 'absolute', bottom: '-1rem', right: '8rem' }}
            />
          </ModalUpdateExposureMenuContentsBox>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() => {
                modal_confirm.openModalConfirm(`수정을 완료하시겠습니까?`, () => {
                  onCompleteChange(newImage);
                });
              }}
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
