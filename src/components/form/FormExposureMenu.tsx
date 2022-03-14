import * as React from 'react';
import { useContext, useEffect } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import UtilBox from '../common/UtilBox';
import ButtonFileInput from '../button/ButtonFileInput';
import ImageBox from '../image/ImageBox';
import { RiCloseCircleFill } from 'react-icons/ri';
import { ModalContext } from '../../provider/ModalProvider';
import { setFileToImage } from '../../../src/utils/tools';

interface FormExposureMenuProps {
  imageList: ImageListType[];
  onInputClick: () => void;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onDelete: () => void;
  menuIdx: number;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '17rem',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 6,
  position: 'relative',
  marginBottom: '1rem',
}));

const RoomImageContainer = styled(Box)(({ theme }) => ({
  width: '15rem',
  height: '15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FormItemContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 17rem)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  padding: '0 4rem 0 0',
}));

const FormItem = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: '2rem',
  transform: 'translate(50%, -50%)',
}));

function FormExposureMenu(props: FormExposureMenuProps) {
  const image_list = props.imageList;
  const onChange = props.onChange;
  const onChangeImage = props.onChangeImage;
  const onInputClick = props.onInputClick;
  const onDelete = props.onDelete;
  const menu_idx = props.menuIdx;

  const exposure_menu_contents = [
    {
      key: 'label',
      format: '',
      placeholder: '메뉴명을 입력해주세요.',
    },
    {
      key: 'comment',
      format: '',
      placeholder: '한 줄 설명을 입력해주세요.',
    },
    {
      key: 'price',
      format: '원',
      placeholder: '숫자만 입력해주세요.',
    },
  ];

  return (
    <FormContainer>
      <RoomImageContainer>
        <ImageBox type='exposure_menu' imageList={image_list} slide={false} />
      </RoomImageContainer>
      <FormItemContainer>
        {exposure_menu_contents.map((item, idx) => {
          return (
            <FormItem key={`form_exposure_menu_${idx}`}>
              <InputOutlined
                align='right'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, item.key)}
                endAdornment={item.format}
                className='none'
                height='2.5rem'
                placeholder={item.placeholder}
              />
            </FormItem>
          );
        })}
        <ButtonFileInput
          title='대표메뉴 이미지 등록'
          onClick={() => onInputClick()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeImage(e)}
          multiple={false}
          id={`exposure_menu_${menu_idx}`}
        />
      </FormItemContainer>
      <CustomIconButton onClick={() => onDelete()}>
        <RiCloseCircleFill />
      </CustomIconButton>
    </FormContainer>
  );
}

export default FormExposureMenu;
