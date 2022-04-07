import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import InputOutlined from '../input/InputOutlined';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import ButtonUpload from '../button/ButtonUpload';
import ImageBox from '../image/ImageBox';
import { ModalContext } from '../../provider/ModalProvider';

import { RiCloseCircleFill } from 'react-icons/ri';

interface AddRoomInputType {
  title: string;
  key: string;
  format: string;
  value: string;
}

interface FormAddRoomProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onClickPriceButton?: () => void;
  imageList: ImageListType[];
  room_idx: number;
  mode?: string;
  modal?: boolean;
  onDelete?: (idx: number) => void;
  contents: AddRoomContentsType;
}

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 6,
  marginBottom: '1rem',

  '&.edit': {
    height: '21rem',
  },

  '&.view': {
    height: '19rem',
  },
}));

const RoomImageContainer = styled(Box)(({ theme }) => ({
  width: '23rem',
  height: '15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FormItemContainer = styled(Box)((props: { mode: string }) => ({
  width: 'calc(100% - 25rem)',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  position: 'relative',
  padding: props.mode == 'edit' ? '0 3rem 0 0' : '0',
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
  right: '1rem',
  transform: 'translate(50%, -50%)',
}));

function FormAddRoom(props: FormAddRoomProps) {
  const { modal_upload } = useContext(ModalContext);

  const onChange = props.onChange;
  const onDelete = props.onDelete;
  const onClickPriceButton = props.onClickPriceButton;
  const image_list = props.imageList;
  const room_idx = props.room_idx;
  const mode = props.mode;
  const contents = props.contents;

  const [addRoomContents, setAddRoomContents] = useState<AddRoomInputType[]>([]);

  useEffect(() => {
    const add_room_contents: AddRoomInputType[] = [
      {
        title: '객실명',
        key: 'label',
        value: contents.label,
        format: '',
      },
      {
        title: '가격',
        key: 'price',
        value: contents.normal_price,
        format: 'price',
      },
      {
        title: '기준인원',
        key: 'standard_num',
        value: contents.standard_num,
        format: 'people',
      },
      {
        title: '최대인원',
        key: 'maximum_num',
        value: contents.maximum_num,
        format: 'people',
      },
    ];

    if (mode == 'edit') {
      add_room_contents.splice(1, 1);
    }
    setAddRoomContents([...add_room_contents]);
  }, [contents]);

  const uploadRoomImage = () => {
    modal_upload.openModalUpload('객실 이미지 업로드', 'rooms', image_list, room_idx);
  };

  const setPrice = () => {
    if (onClickPriceButton) onClickPriceButton();
  };

  return (
    <FormContainer className={mode}>
      <RoomImageContainer>
        <ImageBox type='rooms' imageList={image_list} slide={true} count={true} />
      </RoomImageContainer>
      <FormItemContainer mode={`${mode}`}>
        <>
          {addRoomContents.map((item, idx) => {
            return (
              <FormItem key={`form_add_room_item_${idx}`}>
                <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                {mode == 'edit' ? (
                  <InputOutlined
                    align='right'
                    width='70%'
                    value={item.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onChange ? onChange(e, item.key) : false;
                    }}
                    format={item.format}
                  />
                ) : (
                  <Typography>{item.value}</Typography>
                )}
              </FormItem>
            );
          })}
          {mode == 'edit' ? (
            <FormItem sx={{ justifyContent: 'flex-end' }}>
              <Button color='blue' variant='contained' onClick={setPrice}>
                가격 설정
              </Button>
            </FormItem>
          ) : null}
        </>
        {mode == 'edit' ? (
          <CustomIconButton
            onClick={() => {
              onDelete ? onDelete(room_idx) : false;
            }}
          >
            <RiCloseCircleFill />
          </CustomIconButton>
        ) : null}
      </FormItemContainer>
      {mode == 'edit' ? (
        <UtilBox justifyContent='flex-start'>
          <ButtonUpload title='객실 이미지 등록' onClick={uploadRoomImage} />
        </UtilBox>
      ) : null}
    </FormContainer>
  );
}

export default FormAddRoom;
