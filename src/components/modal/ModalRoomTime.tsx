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

import validation from '../../../src/utils/validation';

interface ModalRoomTimeProps {
  visible: boolean;
  mode?: string;
  type?: string;
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
  width: '25rem',
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
  const { modal_confirm, modal_alert } = useContext(ModalContext);

  const visible = props.visible;
  const contents = props.contents;
  const mode = props.mode;
  const type = props.type;
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
    const time_data: { [key: string]: string } = {};
    for (const [key, val] of Object.entries(timeContents)) {
      time_data[key] = val.time;

      if (!validation.time(val.time)) {
        modal_alert.openModalAlert('[ OO:OO ] 형식으로 입력해주세요.');
        return;
      }
    }

    modal_confirm.openModalConfirm('객실 입실/퇴실 시간을 등록하시겠습니까?', () => {
      if (type != 'edit') {
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
      } else {
        onUpdateTime(time_data, false);
      }
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
                  {mode != 'read' ? (
                    <InputOutlined
                      align='right'
                      width='70%'
                      value={timeContents[key].time}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePirce(e.target.value, key)}
                      format=''
                      startAdornment={key == 'leaving' ? '익일' : ''}
                    />
                  ) : (
                    <>
                      <Typography>
                        {key == 'leaving' ? '익일 ' : ''}
                        {timeContents[key].time}
                      </Typography>
                    </>
                  )}
                </TimeInputBox>
              );
            })}
          </ModalRoomTimeContentsBox>
          {mode != 'read' ? (
            <UtilBox>
              <Button variant='contained' color='orange' onClick={confirmUpdate}>
                등록
              </Button>
            </UtilBox>
          ) : null}
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalRoomTime;
