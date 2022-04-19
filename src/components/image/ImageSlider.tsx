import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';

import { FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface ImageSliderProps {
  onSlide: (dir: string) => void;
  onClickDetail?: () => void;
  fill?: boolean;
  useDetail?: boolean;
  useSlider?: boolean;
}

const SliderWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'none',
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',

  '.MuiIconButton-root': {
    width: '2rem',
    height: '5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.40)',
    },
    svg: {
      color: theme.palette.white.main,
    },
  },

  '&.fill': {
    width: '10rem',
    height: '50rem',
    '.MuiIconButton-root': {
      width: '10rem',
      height: '50rem',
      svg: {
        width: '3rem',
        height: '3rem',
      },
    },
  },
}));

const DetailIconBox = styled(Box)(({ theme }) => ({
  width: '3rem',
  height: '3rem',
  position: 'absolute',
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: {
    color: theme.palette.gray_6.main,
  },
}));

const ImageSlider = (props: ImageSliderProps) => {
  const onSlide = props.onSlide;
  const onClickDetail = props.onClickDetail;
  const fill = props.fill;
  const use_detail = props.useDetail;
  const use_slider = props.useSlider;

  return (
    <SliderWrap className='image-slider'>
      {use_slider !== false ? (
        <>
          <IconBox sx={{ left: 0 }} className={fill ? 'fill' : ''}>
            <IconButton onClick={() => onSlide('left')}>
              <FaChevronLeft />
            </IconButton>
          </IconBox>
          <IconBox sx={{ right: 0 }} className={fill ? 'fill' : ''}>
            <IconButton onClick={() => onSlide('right')}>
              <FaChevronRight />
            </IconButton>
          </IconBox>
        </>
      ) : null}

      {use_detail ? (
        <DetailIconBox>
          <IconButton onClick={onClickDetail}>
            <FaSearchPlus />
          </IconButton>
        </DetailIconBox>
      ) : null}
    </SliderWrap>
  );
};

export default ImageSlider;
