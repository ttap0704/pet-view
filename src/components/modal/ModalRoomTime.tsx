import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

import InputOutlined from '../input/InputOutlined';
import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';

interface ModalRoomTimeProps {
  visible: boolean;
  contents: {
    entrance: string;
    leaving: string;
  };
  onClose: () => void;
  onUpdateTime: (data: { [key: string]: string }, check_all: boolean) => void;
}

interface TimeContentsType {
  [key: string]: {
    title: string;
    time: string;
  };
}

const ModalRoomTimeContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '40rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  gap: '1rem',

  '&.read': {
    width: '25rem',
  },
}));

const TimeInputBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '100%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

function ModalRoomTime(props: ModalRoomTimeProps) {
  const { modal_confirm } = useContext(ModalContext);

  const visible = props.visible;
  const contents = props.contents;
  const onClose = props.onClose;
  const onUpdateTime = props.onUpdateTime;

  const [timeContents, setTimeContents] = useState<TimeContentsType>({});

  useEffect(() => {
    if (visible) {
      setTimeContents({
        entrance: {
          title: '입실 시간',
          time: contents.entrance,
        },
        leaving: {
          title: '퇴실 시간',
          time: contents.leaving,
        },
      });
    }
  }, [visible]);

  const confirmUpdate = () => {
    modal_confirm.openModalConfirm('객실 입실/퇴실 시간을 등록하시겠습니까?', () => {
      const time_data: { [key: string]: string } = {};
      for (const [key, val] of Object.entries(timeContents)) {
        time_data[key] = val.time;
      }

      setTimeout(() => {
        modal_confirm.openModalConfirm(
          '모든 객실에 해당 시간을 적용하시겠습니까?',
          () => {
            onUpdateTime(time_data, true);
          },
          () => {
            onUpdateTime(time_data, false);
          },
        );
      }, 200);
    });
  };

  const onChangePirce = (value: string, key: string) => {
    setTimeContents(state => {
      return {
        ...state,
        [key]: {
          ...state[key],
          time: value,
        },
      };
    });
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='입실/퇴실 시간 설정' onClose={onClose} />
          <ModalRoomTimeContentsBox>
            {Object.keys(timeContents).map((key, item_idx) => {
              return (
                <TimeInputBox key={`room_price_${item_idx}`}>
                  <Typography sx={{ fontWeight: 'bold' }}>{timeContents[key].title}</Typography>
                  <InputOutlined
                    align='right'
                    width='70%'
                    value={timeContents[key].time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePirce(e.target.value, key)}
                    format=''
                    startAdornment={key == 'leaving' ? '익일' : ''}
                  />
                </TimeInputBox>
              );
            })}
          </ModalRoomTimeContentsBox>
          <UtilBox>
            <Button variant='contained' color='orange' onClick={confirmUpdate}>
              등록
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalRoomTime;
