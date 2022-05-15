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
  minWidth: '18rem',
  minHeight: '18rem',
  position: 'relative',

  [theme.breakpoints.down('xsm')]: {
    minWidth: '15rem',
    minHeight: '15rem',
  },
  [theme.breakpoints.down('xxsm')]: {
    minWidth: '13rem',
    minHeight: '13rem',
  },
  [theme.breakpoints.down('xxsm')]: {
    minWidth: '12rem',
    minHeight: '12rem',
  },

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
  top: 0,
  left: 0,
  opacity: 0,
  padding: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  color: theme.palette.gray_6.main,
  zIndex: 0,
}));

const DetailIcon = styled(IconButton)(({ theme }) => ({
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
  width: 'auto',
  height: 'auto',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflowX: 'auto',
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
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
                <DetailIcon onClick={() => openDetailModal(item.image_list)}>
                  <FaSearchPlus />
                </DetailIcon>
                <DetailTypography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.comment}</DetailTypography>
                <DetailTypography sx={{ fontSize: '0.95rem' }}>{item.label}</DetailTypography>
                <DetailTypography sx={{ fontSize: '0.95rem' }}>
                  {Number(item.price).toLocaleString()} 원
                </DetailTypography>
              </LabelBox>
            </MenuImageContainer>
          );
        })}
      </MenuImageSliderWrap>
    </ContentsWrap>
  );
}

export default ImageExposureMenuList;
