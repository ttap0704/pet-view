import { useEffect, useState, useContext } from 'react';
import ModalDefault from './ModalDefault';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { ModalContext } from '../../provider/ModalProvider';
import ImageSlider from '../image/ImageSlider';
import { RiCloseCircleFill } from 'react-icons/ri';

const DetailWrap = styled(Box)(({ theme }) => ({
  width: '90vw',
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
  overflow: 'hidden',
  '&.exposure_menu': {
    width: '40rem',
    height: '40rem',
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

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: '5rem',
  left: '50%',
  transform: 'translateX(-50%)',

  svg: {
    width: '3rem',
    height: '3rem',
    color: theme.palette.white.main,
  },
}));

const ModalImageDetail = () => {
  const { modal_image_detail } = useContext(ModalContext);
  const [curNum, setCurNum] = useState(0);

  const handleSlider = (dir: string) => {
    console.log(dir);
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
            {modal_image_detail.data.image_list.map((list, list_idx) => {
              return (
                <img
                  src={setImageSrc(list)}
                  alt={modal_image_detail.data.type}
                  style={curNum != list_idx ? { display: 'none' } : {}}
                />
              );
            })}
          </ImageWrap>
          {modal_image_detail.data.image_list.length > 1 ? <ImageSlider onSlide={handleSlider} fill={true} /> : null}
          <CustomIconButton onClick={modal_image_detail.closeModalImageDetail}>
            <RiCloseCircleFill />
          </CustomIconButton>
        </DetailWrap>
      </ModalDefault>
    </>
  );
};

export default ModalImageDetail;
