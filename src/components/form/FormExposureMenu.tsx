import * as React from 'react';
import { useContext, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import UtilBox from '../common/UtilBox';
import ButtonFileInput from '../button/ButtonFileInput';
import ImageBox from '../image/ImageBox';
import { ModalContext } from '../../provider/ModalProvider';
import { setFileToImage } from '../../../src/utils/tools';

interface FormExposureMenuProps {
  imageList: ImageListType[];
  onInputClick: () => void;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '21rem',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 6,
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
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
}));

const FormItem = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
}));

function FormExposureMenu(props: FormExposureMenuProps) {
  // const { modal_upload } = useContext(ModalContext);

  const image_list = props.imageList;
  const onChange = props.onChange;
  const onChangeImage = props.onChangeImage;
  const onInputClick = props.onInputClick;

  const exposure_menu_contents = [
    {
      title: '이름',
      key: 'label',
      format: '',
    },
    {
      title: '가격',
      key: 'price',
      format: '원',
    },
    {
      title: '한 줄 설명',
      key: 'comment',
      format: '',
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
              <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
              <InputOutlined
                align='right'
                width='70%'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, item.key)}
                endAdornment={item.format}
              />
            </FormItem>
          );
        })}
      </FormItemContainer>
      <UtilBox justifyContent='flex-start'>
        <ButtonFileInput
          title='대표메뉴 이미지 등록'
          onClick={() => onInputClick()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeImage(e)}
          multiple={false}
        />
      </UtilBox>
    </FormContainer>
  );
}

export default FormExposureMenu;
