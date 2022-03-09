import * as React from 'react';
import { useContext, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import UtilBox from '../common/UtilBox';
import ButtonUpload from '../button/ButtonUpload';
import ImageBox from '../image/ImageBox';
import { ModalContext } from '../../provider/ModalProvider';

interface FormAddRoomProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  imageList: ImageListType[];
  room_idx: number;
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
  width: '23rem',
  height: '15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FormItemContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 25rem)',
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

function FormAddRoom(props: FormAddRoomProps) {
  const { modal_upload } = useContext(ModalContext);

  const onChange = props.onChange;
  const image_list = props.imageList;
  const room_idx = props.room_idx;

  const add_room_contents = [
    {
      title: '객실명',
      key: 'label',
      format: '',
    },
    {
      title: '가격',
      key: 'price',
      format: '원',
    },
    {
      title: '기준인원',
      key: 'standard_num',
      format: '명',
    },
    {
      title: '최대인원',
      key: 'maximum_num',
      format: '명',
    },
  ];

  const uploadRoomImage = () => {
    modal_upload.openModalUpload('객실 이미지 업로드', 'rooms', image_list, room_idx);
  };

  return (
    <FormContainer>
      <RoomImageContainer>
        <ImageBox type='room' imageList={image_list} slide={true} />
      </RoomImageContainer>
      <FormItemContainer>
        {add_room_contents.map((item, idx) => {
          return (
            <FormItem key={`form_add_room_item_${idx}`}>
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
        <ButtonUpload title='객실 이미지 등록' onClick={uploadRoomImage} />
      </UtilBox>
    </FormContainer>
  );
}

export default FormAddRoom;
