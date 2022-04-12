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

function FormServiceInfo(props: FormServiceInfoProps) {
  const data = props.data;
  const mode = props.mode;
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
  });
  const map_items: ServiceContents[] = ['contact', 'kakao_chat', 'site'];

  useEffect(() => {
    const tmp_info = { ...info };
    tmp_info.contact.value = data.contact;
    tmp_info.site.value = data.site;
    tmp_info.kakao_chat.value = data.kakao_chat;
    setInfo({ ...tmp_info });
  }, [data]);

  return (
    <>
      <FormContainer>
        {map_items.map((item, item_idx) => {
          return (
            <FormItems key={`form_service_info_item_${item_idx}`}>
              <TitleBox>{info[item].title}</TitleBox>
              <ContentsBox>
                <InputOutlined
                  className='none'
                  placeholder={info[item].placeholder}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInfo(item, e.target.value)}
                  value={info[item].value}
                />
              </ContentsBox>
            </FormItems>
          );
        })}
      </FormContainer>
    </>
  );
}

export default FormServiceInfo;
