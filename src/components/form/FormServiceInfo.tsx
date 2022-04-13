import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import { Box, Typography, IconButton } from '@mui/material';
import InputOutlined from '../input/InputOutlined';
import { getDate } from '../../utils/tools';
import { TiDelete } from 'react-icons/ti';
import Dropdown from '../dropdown/Dropdown';

interface FormServiceInfoProps {
  data: ServiceInfoType;
  type: string;
  mode?: string;
  onChangeInfo: (key: ServiceContents, value: string) => void;
}

type FormServiceDataType = {
  [key in ServiceContents]: {
    title: string;
    value: string;
    placeholder: string;
  };
};

const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'space-between',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
}));

const FormItems = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '3rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '&:not(:last-of-type)': {
    borderBottom: '1px solid',
    borderColor: theme.palette.gray_4.main,
  },
}));

const TitleBox = styled(Box)(({ theme }) => ({
  width: '20%',
  height: '3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.gray_5.main,
}));

const ContentsBox = styled(Box)(({ theme }) => ({
  width: '80%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
}));

interface ReadContentsProps {
  length: number;
}
const ReadContents = styled(Typography)<ReadContentsProps>(props => {
  const color = props.length > 0 ? props.theme.palette.black.main : props.theme.palette.gray_1.main;
  return {
    paddingLeft: '1rem',
    color,
  };
});

function FormServiceInfo(props: FormServiceInfoProps) {
  const data = props.data;
  const mode = props.mode;
  const type = props.type;
  const onChangeInfo = props.onChangeInfo;

  const [info, setInfo] = useState<FormServiceDataType>({
    contact: {
      title: '전화번호',
      value: '',
      placeholder: '문의 가능한 핸드폰 또는 유선 전화번호를 입력해주세요. (숫자만 입력해주세요.)',
    },
    kakao_chat: {
      title: '카카오톡 오픈채팅',
      value: '',
      placeholder: '문의 가능한 카카오톡 오픈채팅 방 주소를 입력해주세요.',
    },
    site: {
      title: '웹 사이트',
      value: '',
      placeholder: '전용 웹사이트를 입력해주세요.',
    },
    open: {
      title: '오픈 시간',
      value: '',
      placeholder: '오픈 시간을 [ HH:MM ]형식으로 입력해주세요. ex) 10:00',
    },
    close: {
      title: '마감 시간',
      value: '',
      placeholder: '마감 시간을 [ HH:MM ]형식으로 입력해주세요. ex) 21:00',
    },
    last_order: {
      title: '마지막 주문 시간',
      value: '',
      placeholder: '마지막 주문 시간을 [ HH:MM ]형식으로 입력해주세요. ex) 20:30',
    },
  });
  const [mapItems, setMapItems] = useState<ServiceContents[]>([]);

  useEffect(() => {
    const tmp_info = { ...info };
    tmp_info.contact.value = data.contact;
    tmp_info.site.value = data.site;
    tmp_info.kakao_chat.value = data.kakao_chat;

    if (type == 'accommodation') {
      setMapItems(['contact', 'kakao_chat', 'site']);
    } else {
      tmp_info.open.value = `${data.open}`;
      tmp_info.close.value = `${data.close}`;
      tmp_info.last_order.value = `${data.last_order}`;
      setMapItems(['contact', 'kakao_chat', 'site', 'open', 'close', 'last_order']);
    }

    setInfo({ ...tmp_info });
  }, [data]);

  return (
    <>
      <FormContainer>
        {mapItems.map((key, item_idx) => {
          return (
            <FormItems key={`form_service_info_item_${item_idx}`}>
              <TitleBox>{info[key].title}</TitleBox>
              <ContentsBox>
                {mode != 'read' ? (
                  <InputOutlined
                    className='none'
                    placeholder={info[key].placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInfo(key, e.target.value)}
                    value={info[key].value}
                  />
                ) : (
                  <ReadContents length={info[key].value.length}>
                    {info[key].value ? info[key].value : '등록된 정보가 없습니다.'}
                  </ReadContents>
                )}
              </ContentsBox>
            </FormItems>
          );
        })}
      </FormContainer>
    </>
  );
}

export default FormServiceInfo;
