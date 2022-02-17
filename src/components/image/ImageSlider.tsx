import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageSliderProps {
  onSlide: (dir: string) => void;
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
}));

const ImageSlider = (props: ImageSliderProps) => {
  const onSlide = props.onSlide;

  return (
    <SliderWrap className='image-slider'>
      <IconBox sx={{ left: 0 }}>
        <IconButton onClick={() => onSlide('left')}>
          <FaChevronLeft />
        </IconButton>
      </IconBox>
      <IconBox sx={{ right: 0 }}>
        <IconButton onClick={() => onSlide('right')}>
          <FaChevronRight />
        </IconButton>
      </IconBox>
    </SliderWrap>
  );
};

export default ImageSlider;