import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import ButtonFileInput from '../button/ButtonFileInput';
import ImageBox from '../image/ImageBox';
import { RiCloseCircleFill } from 'react-icons/ri';
import { ModalContext } from '../../provider/ModalProvider';
import { FaSearchPlus } from 'react-icons/fa';

interface ImageExposureMenuListProps {
  contents: AddExposureMenuContentsType[];
}

const ContentsWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowY: 'auto',
}));

const MenuImageContainer = styled(Box)(({ theme }) => ({
  width: '18rem',
  height: '18rem',
  position: 'relative',

  '&:hover': {
    '& > .menu_label_box': {
      opacity: 1,
    },
  },
}));

const LabelBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  position: 'absolute',
  padding: '1rem',
  top: 0,
  left: 0,
  opacity: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: theme.palette.gray_6.main,
  zIndex: 0,
}));

const DetailIconBox = styled(Box)(({ theme }) => ({
  width: '3rem',
  height: '3rem',
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: {
    color: theme.palette.gray_6.main,
  },
}));

const MenuImageSliderWrap = styled(Box)(({ theme }) => ({
  width: '90rem',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflowX: 'auto',
}));

function ImageExposureMenuList(props: ImageExposureMenuListProps) {
  const { modal_image_detail } = useContext(ModalContext);

  const contents = props.contents;

  const [exposureMenuContents, setExposureMenuContents] = useState<AddExposureMenuContentsType[]>([]);

  useEffect(() => {
    if (contents) {
      setExposureMenuContents([...contents]);
    }
  }, [contents]);

  const handleSlider = (dir: string) => {
    console.log(dir);
  };

  const openDetailModal = (image_list: ImageListType[]) => {
    if (image_list) {
      modal_image_detail.openModalImageDetail('exposure_menu', image_list);
    }
  };

  return (
    <ContentsWrap>
      <MenuImageSliderWrap>
        {exposureMenuContents.map((item, idx) => {
          return (
            <MenuImageContainer key={`exposure_menu_image_${idx}`}>
              <ImageBox type='exposure_menu' imageList={item.image_list} slide={false} useDetail={false} />
              <LabelBox className='menu_label_box'>
                <DetailIconBox>
                  <IconButton>
                    <FaSearchPlus />
                  </IconButton>
                </DetailIconBox>
                <Typography>{item.label}</Typography>
                <Typography>{item.comment}</Typography>
                <Typography>{Number(item.price).toLocaleString()} 원</Typography>
              </LabelBox>
            </MenuImageContainer>
          );
        })}
      </MenuImageSliderWrap>
    </ContentsWrap>
  );
}

export default ImageExposureMenuList;
