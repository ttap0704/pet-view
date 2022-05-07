import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

import Box, { BoxProps } from '@mui/material/Box';
import { Typography } from '@mui/material';
import ImageSlider from './ImageSlider';
import ContainerFullAbsolute from '../container/ContainerFullAbsolute';

interface ImageBoxProps extends BoxProps {
  imageList?: ImageListType[];
  type: string;
  slide: boolean;
  count?: boolean;
  emptyText?: string;
  useDetail?: boolean;
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

    '.image_count': {
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

  '&.exposure_menu': {
    img: {
      width: 'auto',
      height: '100%',
    },
  },
}));

const CountTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  zIndex: 3,
  right: '0.75rem',
  top: '0.5rem',
  display: 'none',
}));

const ImageBox = (props: ImageBoxProps) => {
  const { modal_image_detail } = useContext(ModalContext);

  const image_list = props.imageList;
  const type = props.type;
  const slide = props.slide;
  const count = props.count;
  const empty_text = props.emptyText;
  const use_detail = props.useDetail;

  const [curNum, setCurNum] = useState(0);
  const [isSlide, setIsSlide] = useState(false);
  const [boxStyle, setBoxStyle] = useState({
    width: '',
    maxWidth: '',
    height: '',
  });

  useEffect(() => {
    if (['accommodation', 'restaurant'].includes(type)) {
      setBoxStyle({
        width: '100%',
        maxWidth: '42rem',
        height: '21rem',
      });
    } else if (type == 'rooms') {
      setBoxStyle({
        width: '100%',
        maxWidth: '23rem',
        height: '15rem',
      });
    } else if (type == 'exposure_menu') {
      setBoxStyle({
        width: '100%',
        maxWidth: '18rem',
        height: '18rem',
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

  const setImageSrc = (idx: number) => {
    let src = '';

    if (image_list && image_list.length > 0) {
      if (image_list[idx].new == true) {
        src = image_list[idx].src;
      } else {
        src = `http://localhost:3080/image/${type}/${image_list[idx].src}`;
      }
    }

    return src;
  };

  const openDetailModal = () => {
    if (image_list) {
      modal_image_detail.openModalImageDetail(type, image_list);
    }
  };

  return (
    <>
      <CustomBox sx={{ ...boxStyle }}>
        {image_list && image_list.length > 0 ? (
          <ImageWrap className={type ? `${type}` : ''}>
            <>
              {count ? (
                <CountTypography className='image_count'>{`${curNum + 1} / ${image_list.length}`}</CountTypography>
              ) : null}
              {image_list.map((image, image_idx) => {
                return (
                  <img
                    key={`image_box_img_${image_idx}`}
                    src={setImageSrc(image_idx)}
                    alt='미리보기 이미지'
                    style={curNum != image_idx ? { display: 'none' } : {}}
                  />
                );
              })}
            </>
          </ImageWrap>
        ) : (
          <ContainerFullAbsolute>
            <Typography component='h5'>{empty_text ? empty_text : '이미지를 등록해주세요.'}</Typography>
          </ContainerFullAbsolute>
        )}
        {isSlide || use_detail ? (
          <ImageSlider onSlide={handleSlider} onClickDetail={openDetailModal} useDetail={true} useSlider={slide} />
        ) : null}
      </CustomBox>
    </>
  );
};

export default ImageBox;
