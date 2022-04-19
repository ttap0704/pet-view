import * as React from 'react';
import { useEffect, useState } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import ButtonFileInput from '../button/ButtonFileInput';
import ImageBox from '../image/ImageBox';
import { RiCloseCircleFill } from 'react-icons/ri';

interface FormExposureMenuProps {
  onInputClick?: () => void;
  onChangeImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onDelete?: () => void;
  menuIdx: number;
  contents: AddExposureMenuContentsType;
  mode?: string;
}

interface ExposureMenuContentsType {
  key: string;
  format: string;
  placeholder: string;
  value: string;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
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

const ExposureMenuImageContainer = styled(Box)(({ theme }) => ({
  width: '18rem',
  height: '18rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FormItemContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 20rem)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  padding: '2rem 4rem 2rem 0',
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
  const image_list = props.contents.image_list;
  const onChange = props.onChange;
  const onChangeImage = props.onChangeImage;
  const onInputClick = props.onInputClick;
  const onDelete = props.onDelete;
  const menu_idx = props.menuIdx;
  const contents = props.contents;
  const mode = props.mode;

  const [exposureMenuContents, setExposureMenuContents] = useState<ExposureMenuContentsType[]>([
    {
      key: 'label',
      format: '',
      placeholder: '메뉴명을 입력해주세요.',
      value: '',
    },
    {
      key: 'comment',
      format: '',
      placeholder: '한 줄 설명을 입력해주세요.',
      value: '',
    },
    {
      key: 'price',
      format: 'price',
      placeholder: '숫자만 입력해주세요.',
      value: '',
    },
  ]);

  const view_contents: { [key: string]: string } = {
    label: '메뉴',
    price: '가격',
    comment: '한 줄 설명',
  };

  useEffect(() => {
    if (contents) {
      const tmp_contents = [...exposureMenuContents];
      tmp_contents[0].value = contents.label;
      tmp_contents[1].value = contents.comment;
      tmp_contents[2].value = contents.price;
      setExposureMenuContents([...tmp_contents]);
    }
  }, []);

  return (
    <FormContainer>
      <ExposureMenuImageContainer>
        <ImageBox type='exposure_menu' imageList={image_list} slide={false} />
      </ExposureMenuImageContainer>
      <FormItemContainer className={mode == 'view' ? 'view' : ''}>
        {exposureMenuContents.map((item, idx) => {
          return (
            <FormItem key={`form_exposure_menu_${idx}`}>
              <InputOutlined
                align='right'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange ? onChange(e, item.key) : false;
                }}
                format={item.format}
                className='none'
                height='2.5rem'
                placeholder={item.placeholder}
                value={item.value}
              />
            </FormItem>
          );
        })}
        <ButtonFileInput
          title='대표메뉴 이미지 등록'
          onClick={onInputClick}
          onChange={onChangeImage}
          multiple={false}
          id={`exposure_menu_${menu_idx}`}
        />
      </FormItemContainer>
      <CustomIconButton onClick={onDelete}>
        <RiCloseCircleFill />
      </CustomIconButton>
    </FormContainer>
  );
}

export default FormExposureMenu;
