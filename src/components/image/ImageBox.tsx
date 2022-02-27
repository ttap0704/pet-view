import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import Box, { BoxProps } from '@mui/material/Box';
import { Typography } from '@mui/material';
import ImageSlider from './ImageSlider';
import ContainerFullAbsolute from '../container/ContainerFullAbsolute';

interface ImageBoxProps extends BoxProps {
  imageList?: ImageListType[];
  type: string;
  slide: boolean;
}

const CustomBox = styled(Box)(({ theme }) => ({
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

  position: 'relative',
  img: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '100%',
    minWidth: '23rem',
  },
}));

const ImageBox = (props: ImageBoxProps) => {
  const image_list = props.imageList;
  const type = props.type;
  const slide = props.slide;
  const [curNum, setCurNum] = useState(0);
  const [isSlide, setIsSlide] = useState(false);
  const [boxStyle, setBoxStyle] = useState({
    width: '',
    maxWidth: '',
    height: '',
  });

  useEffect(() => {
    if (type == 'accommodation') {
      setBoxStyle({
        width: '100%',
        maxWidth: '42rem',
        height: '21rem',
      });
    } else if (type == 'room') {
      setBoxStyle({
        width: '100%',
        maxWidth: '23rem',
        height: '15rem',
      });
    }
  }, []);

  useEffect(() => {
    if (slide == true && image_list) {
      if (image_list.length > 1) {
        setIsSlide(true);
      }
    }
  }, [image_list]);

  const handleSlider = (dir: string) => {
    if (image_list) {
      let cur_num = curNum;

      if (dir == 'left') {
        if (cur_num == 0) {
          cur_num = image_list?.length - 1;
        } else {
          cur_num--;
        }
      } else if (dir == 'right') {
        if (cur_num == image_list?.length - 1) {
          cur_num = 0;
        } else {
          cur_num++;
        }
      }

      setCurNum(cur_num);
    } else {
      return false;
    }
  };

  const setImageSrc = () => {
    let src = '';

    if (image_list && image_list.length > 0) {
      if (image_list[curNum].new == true) {
        src = image_list[curNum].src;
      } else {
        src = `http://localhost:3080/image/${type}/${image_list[curNum]}`;
      }
    }

    return src;
  };

  return (
    <>
      <CustomBox sx={{ ...boxStyle }}>
        {image_list && image_list.length > 0 ? (
          <ImageWrap>
            <img src={setImageSrc()} alt='미리보기 이미지' />
          </ImageWrap>
        ) : (
          <ContainerFullAbsolute>
            <Typography component='h5'>이미지를 등록해주세요.</Typography>
          </ContainerFullAbsolute>
        )}
        {isSlide ? <ImageSlider onSlide={handleSlider} /> : null}
      </CustomBox>
    </>
  );
};

export default ImageBox;
