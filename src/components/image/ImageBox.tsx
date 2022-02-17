import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import Box, { BoxProps } from '@mui/material/Box';
import ImageSlider from './ImageSlider';

interface ImageBoxProps extends BoxProps {
  imageList: string[];
  type: string;
  slide: boolean;
}

const CustomBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '60rem',
  height: '21rem',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '2px 4px 4px 0 rgba(0, 0, 0, 0.4)',

  '&:hover': {
    '& > .image-slider': {
      display: 'block',
    },
  },
}));

const ImageWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.orange.main,

  position: 'relative',
  img: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '100%',
    minWidth: '40rem',
  },
}));

const ImageBox = (props: ImageBoxProps) => {
  const image_list = props.imageList;
  const type = props.type;
  const slide = props.slide;
  const [curNum, setCurNum] = useState(0);
  const [isSlide, setIsSlide] = useState(false);

  useEffect(() => {
    if (slide == true && image_list.length > 0) {
      setIsSlide(true);
    }
  }, [slide]);

  const handleSlider = (dir: string) => {
    let cur_num = curNum;

    if (dir == 'left') {
      if (cur_num == 0) {
        cur_num = image_list.length - 1;
      } else {
        cur_num--;
      }
    } else if (dir == 'right') {
      if (cur_num == image_list.length - 1) {
        cur_num = 0;
      } else {
        cur_num++;
      }
    }

    setCurNum(cur_num);
  };

  return (
    <>
      <CustomBox>
        <ImageWrap>
          <img src={`http://localhost:3080/image/${type}/${image_list[curNum]}`} alt='미리보기 이미지' />
        </ImageWrap>
        {isSlide ? <ImageSlider onSlide={handleSlider} /> : null}
      </CustomBox>
    </>
  );
};

export default ImageBox;
