import { Box, IconButton, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { FiPlusCircle } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';
import Button from '../src/components/button/Button';
import UtilBox from '../src/components/common/UtilBox';
import Textarea from '../src/components/textarea/Textarea';
import { setFileToImage } from '../src/utils/tools';

const DailyContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',

  '.close_icon': {
    width: '1.5rem',
    height: '1.5rem',
    cursor: 'pointer',
    color: theme.palette.gray_4.main,
  },
}));

const DailyRegistraionBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 12,
  padding: '1rem',
}));

const DailyListBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '3rem',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 12,
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  cursor: 'pointer',

  '&.slide': {
    '.contents': {
      maxHeight: 'unset',
      overflow: 'hidden',
      textOverflow: 'unset',
    },
  },

  '.profile': {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',

    '& > div': {
      width: '2.5rem',
      height: '2.5rem',
      backgroundImage: `url('data:image/jpeg;base64,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')`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      borderRadius: '50%',
    },

    span: {
      fontSize: '1.25rem',
    },
  },

  '.contents': {
    width: '100%',
    maxHeight: '3rem',
    whiteSpace: 'wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const PhotosContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '6rem',
  padding: '0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  '&.regi': {
    gap: '1rem',
  },

  '& > div': {
    cursor: 'pointer',
    width: '5rem',
    height: '5rem',
    border: '1px solid',
    borderColor: theme.palette.gray_4.main,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '.empty': {
      fontSize: '0.75rem',
      textAlign: 'center',
      color: theme.palette.gray_3.main,
    },

    '& > svg': {
      width: '1rem',
      height: '1rem',
      position: 'absolute',
      top: '-0.75rem',
      right: '-0.75rem',
      color: theme.palette.orange.main,
      zIndex: 1,
    },
  },

  '& > svg': {
    width: '2.5rem',
    height: '2.5rem',
    color: theme.palette.gray_4.main,
    cursor: 'pointer',
  },
}));

const SlideButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
}));

const Daily = () => {
  const [slide, setSlide] = useState(false);
  const [contents, setContents] = useState('');
  const [photoList, setPhotoList] = useState<ImageListType[]>([]);
  const [regi, setRegi] = useState(false);

  const onClickPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const setPhoto = () => {
    const el = document.getElementById('photos');
    if (el) {
      el.click();
    }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      const cur_files = await setFileToImage(files, []);

      setPhotoList([...photoList, ...cur_files]);
    }
  };

  const deletePhoto = (idx: number) => {
    const tmp_photos = [...photoList];
    tmp_photos.splice(idx, 1);
    setPhotoList([...tmp_photos]);
  };

  return (
    <DailyContainer>
      <UtilBox justifyContent='flex-end' sx={{ height: '3rem' }}>
        <Button variant='outlined' color='orange' disableRipple onClick={() => setRegi(true)}>
          공유하기
        </Button>
      </UtilBox>
      {regi ? (
        <DailyRegistraionBox>
          <UtilBox
            justifyContent='flex-end'
            sx={{
              height: '2rem',
            }}
          >
            <IoIosClose className='close_icon' onClick={() => setRegi(false)} />
          </UtilBox>
          <Textarea
            value={contents}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContents(e.target.value)}
            placeholder='공유하고픈 일상을 적어주세요.'
          />
          <PhotosContainer className='regi'>
            {photoList.length > 0 ? (
              photoList.map((image, image_idx) => {
                return (
                  <Box
                    sx={{
                      backgroundImage: `url('${image.src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    key={`registration_daily_photo_${image_idx}`}
                    onClick={(e: React.MouseEvent) => onClickPhoto(e)}
                  >
                    <AiFillCloseCircle onClick={() => deletePhoto(image_idx)} />
                  </Box>
                );
              })
            ) : (
              <Box>
                <Typography className='empty'>
                  이미지를 <br />
                  등록해주세요.
                </Typography>
              </Box>
            )}

            <FiPlusCircle onClick={setPhoto} />
            <input type='file' onChange={handleFiles} id='photos' name='photos' multiple={true}></input>
          </PhotosContainer>
          <UtilBox justifyContent='center' sx={{ height: 'auto' }}>
            <Button variant='contained'>등록하기</Button>
          </UtilBox>
        </DailyRegistraionBox>
      ) : null}

      <DailyListBox onClick={() => setSlide(!slide)} className={slide ? 'slide' : ''}>
        <Box className='profile'>
          <Box />
          <Typography component='span'>name</Typography>
          <SlideButton>{slide ? <HiChevronUp /> : <HiChevronDown />}</SlideButton>
        </Box>
        <Typography className='contents'>
          ihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihi
          ihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihi
          ihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihi
          ihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihihjihihihihihi
        </Typography>
        <PhotosContainer>
          <Box onClick={(e: React.MouseEvent) => onClickPhoto(e)}></Box>
        </PhotosContainer>
      </DailyListBox>
    </DailyContainer>
  );
};

export default Daily;
