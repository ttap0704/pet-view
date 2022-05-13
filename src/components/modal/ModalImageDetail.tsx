import { useEffect, useState, useContext } from 'react';
import ModalDefault from './ModalDefault';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ModalContext } from '../../provider/ModalProvider';
import ImageSlider from '../image/ImageSlider';
import { RiCloseCircleFill } from 'react-icons/ri';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const DetailWrap = styled(Box)(({ theme }) => ({
  width: '90vw',
  maxWidth: '80rem',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',

  '& > .image-slider': {
    display: 'block',
  },
}));

const ImageWrap = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.black.main,
  position: 'relative',
  width: '45rem',
  height: '45rem',

  [theme.breakpoints.down('md')]: {
    height: '50%',
  },

  img: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '100%',
    minWidth: '23rem',
  },
}));

interface CustomIconButtonProps {
  position: string;
}
const CustomIconButton = styled(IconButton)<CustomIconButtonProps>(({ theme, position }) => {
  let left = '';
  let transform = '';
  let right = '';

  if (position == 'center') {
    left = '50%';
    transform = 'translateX(-50%)';
  } else if (position == 'left') {
    left = '50%';
    transform = 'translateX(-200%)';
  } else if (position == 'right') {
    right = '50%';
    transform = 'translateX(200%)';
  }
  return {
    position: 'absolute',
    bottom: '3.5rem',
    left,
    transform,
    right,

    svg: {
      width: '3rem',
      height: '3rem',
      color: theme.palette.white.main,
    },
  };
});

const CountTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  zIndex: 3,
  right: '0.75rem',
  top: '-2.5rem',
  color: theme.palette.gray_2.main,
  backgroundColor: theme.palette.white.main,
  width: '3rem',
  height: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
}));

const ModalImageDetail = () => {
  const { modal_image_detail } = useContext(ModalContext);
  const [curNum, setCurNum] = useState(0);
  const theme = useTheme();
  const is_down_lg = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    if (!modal_image_detail.data.visible) {
      setCurNum(0);
    }
  }, [modal_image_detail.data.visible]);

  const handleSlider = (dir: string) => {
    if (modal_image_detail.data.image_list) {
      let cur_num = curNum;

      if (dir == 'left') {
        if (cur_num == 0) {
          cur_num = modal_image_detail.data.image_list.length - 1;
        } else {
          cur_num--;
        }
      } else if (dir == 'right') {
        if (cur_num == modal_image_detail.data.image_list.length - 1) {
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

  const setImageSrc = (list: ImageListType) => {
    let src = '';

    if (list.new == true) {
      src = list.src;
    } else {
      src = `http://localhost:3080/image/${modal_image_detail.data.type}/${list.src}`;
    }

    return src;
  };

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_image_detail.data.visible}
        onClose={modal_image_detail.closeModalImageDetail}
      >
        <DetailWrap>
          <ImageWrap className={modal_image_detail.data.type}>
            <CountTypography>{`${curNum + 1} / ${modal_image_detail.data.image_list.length}`}</CountTypography>
            {modal_image_detail.data.image_list.map((list, list_idx) => {
              return (
                <img
                  key={`image_modal_img_${list_idx}`}
                  src={setImageSrc(list)}
                  alt={modal_image_detail.data.type}
                  style={curNum != list_idx ? { display: 'none' } : { zIndex: 1 }}
                />
              );
            })}
          </ImageWrap>
          {modal_image_detail.data.image_list.length > 1 && !is_down_lg ? (
            <ImageSlider onSlide={handleSlider} fill={true} />
          ) : (
            <>
              <CustomIconButton onClick={() => handleSlider('left')} position='left'>
                <FaChevronLeft />
              </CustomIconButton>
              <CustomIconButton onClick={() => handleSlider('right')} position='right'>
                <FaChevronRight />
              </CustomIconButton>
            </>
          )}

          <CustomIconButton onClick={modal_image_detail.closeModalImageDetail} position='center'>
            <RiCloseCircleFill />
          </CustomIconButton>
        </DetailWrap>
      </ModalDefault>
    </>
  );
};

export default ModalImageDetail;
