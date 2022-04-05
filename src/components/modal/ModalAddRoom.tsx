import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import InputOutlined from '../input/InputOutlined';
import FormAddRoom from '../form/FormAddRoom';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';
import ModalRoomPrice from './ModalRoomPrice';

interface ModalAddRoomProps {
  rooms_num: number;
  visible: boolean;
  upload_idx: null | number;
  onClose: () => void;
  onAddRoom: (data: AddRoomContentsType[]) => void;
  onChangeImage: () => void;
}

const ModalAddRoomContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  maxHeight: '40rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem 2rem',
  gap: '1rem',
  overflowY: 'auto',
}));

function ModalAddRoom(props: ModalAddRoomProps) {
  const { modal_confirm, modal_alert, modal_upload } = useContext(ModalContext);
  const visible = props.visible;
  const rooms_num = props.rooms_num;
  const upload_idx = props.upload_idx;
  const onClose = props.onClose;
  const onAddRoom = props.onAddRoom;
  const onChangeImage = props.onChangeImage;

  const [roomPriceContents, setRoomPriceContents] = useState({
    visible: false,
    contents: {
      normal_price: '',
      normal_weekend_price: '',
      peak_price: '',
      peak_weekend_price: '',
    },
    current_room_idx: 0,
  });
  const [rooms, setRooms] = useState<AddRoomContentsType[]>([
    {
      label: '',
      normal_price: '',
      normal_weekend_price: '',
      peak_price: '',
      peak_weekend_price: '',
      standard_num: '',
      maximum_num: '',
      image_list: [],
    },
  ]);

  useEffect(() => {
    if (upload_idx != null) {
      setRoomImages();
    }
  }, [upload_idx]);

  useEffect(() => {
    if (!visible) {
      setRooms([
        {
          label: '',
          normal_price: '',
          normal_weekend_price: '',
          peak_price: '',
          peak_weekend_price: '',
          standard_num: '',
          maximum_num: '',
          image_list: [],
        },
      ]);
    }
  }, [visible]);

  const setRoomImages = () => {
    const tmp_rooms = rooms.map((room, room_idx) => {
      if (room_idx == upload_idx) {
        return {
          ...room,
          image_list: modal_upload.data.image_list,
        };
      } else {
        return room;
      }
    });

    modal_upload.closeModalUpload();
    onChangeImage();
    setRooms([...tmp_rooms]);
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        label: '',
        normal_price: '',
        normal_weekend_price: '',
        peak_price: '',
        peak_weekend_price: '',
        standard_num: '',
        maximum_num: '',
        image_list: [],
      },
    ]);
  };

  const handleRoomInput = (e: React.ChangeEvent<HTMLInputElement>, type: string, idx: number) => {
    const value = e.target.value;
    setRooms(state => {
      return [
        ...state.map((room, room_idx) => {
          if (room_idx == idx) {
            return {
              ...room,
              [`${type}`]: value,
            };
          } else {
            return room;
          }
        }),
      ];
    });
  };

  const setRoomPriceModal = (idx: number) => {
    const target = rooms[idx];
    setRoomPriceContents({
      visible: true,
      current_room_idx: idx,
      contents: {
        normal_price: target.normal_price,
        normal_weekend_price: target.normal_weekend_price,
        peak_price: target.peak_price,
        peak_weekend_price: target.peak_weekend_price,
      },
    });
  };

  const setRoomPrice = (data: { [key: string]: string }) => {
    const tmp_rooms = [...rooms];
    tmp_rooms[roomPriceContents.current_room_idx] = { ...tmp_rooms[roomPriceContents.current_room_idx], ...data };
    setRooms([...tmp_rooms]);
    clearRoomPriceModal();
  };

  const clearRoomPriceModal = () => {
    setRoomPriceContents({
      visible: false,
      current_room_idx: 0,
      contents: {
        normal_price: '',
        normal_weekend_price: '',
        peak_price: '',
        peak_weekend_price: '',
      },
    });
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='객실 추가' onClose={onClose} />
          <UtilBox justifyContent='flex-end' sx={{ paddingX: '2rem' }}>
            <Button color='blue' onClick={() => addRoom()}>
              객실 추가
            </Button>
          </UtilBox>
          <ModalAddRoomContentsBox>
            {rooms.map((room, room_idx) => {
              return (
                <FormAddRoom
                  onChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) =>
                    handleRoomInput(e, type, room_idx)
                  }
                  contents={room}
                  key={`add_room_form_${room_idx}`}
                  room_idx={room_idx}
                  imageList={room.image_list}
                  mode='edit'
                  onClickPriceButton={() => setRoomPriceModal(room_idx)}
                />
              );
            })}
          </ModalAddRoomContentsBox>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() =>
                modal_confirm.openModalConfirm(`수정을 완료하시겠습니까?`, () => {
                  onAddRoom(rooms);
                })
              }
            >
              등록
            </Button>
          </UtilBox>
        </ContainerModalContents>
        <ModalRoomPrice
          visible={roomPriceContents.visible}
          contents={roomPriceContents.contents}
          onClose={() => clearRoomPriceModal()}
          onUpdatePrice={setRoomPrice}
        />
      </ModalDefault>
    </>
  );
}

export default ModalAddRoom;
