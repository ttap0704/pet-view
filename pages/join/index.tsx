import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import InputOutlined from '../../src/components/input/InputOutlined';
import Button from '../../src/components/button/Button';
import UtilBox from '../../src/components/common/UtilBox';

const LoginWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '350px',
  margin: '2rem auto 0 !important',
  height: 'auto',
  padding: '1rem',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
}));

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}));

const JoinIndex = () => {
  const [loginInfo, setLoginInfo] = useState([
    {
      value: '',
      status: true,
      icon: <MdAttachEmail />,
      placeholder: '이메일을 입력해주세요.',
    },
    {
      value: '',
      status: true,
      icon: <RiLockPasswordFill />,
      placeholder: '비밀번호를 입력해주세요.',
    },
  ]);

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setLoginInfo(state => {
      return [
        ...state.map((info, index) => {
          if (index == idx) {
            return {
              ...info,
              value: e.target.value,
            };
          } else {
            return info;
          }
        }),
      ];
    });
  };

  return (
    <LoginWrap>
      <Typography variant='h4'>로그인</Typography>
      <LoginBox>
        {loginInfo.map((info, index) => {
          return (
            <InputOutlined
              startAdornment={info.icon}
              value={info.value}
              key={`login_contents_${index}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLoginInput(e, index)}
              placeholder={info.placeholder}
            />
          );
        })}
        <Button variant='contained' color='blue' sx={{ marginTop: '0.5rem' }}>
          로그인
        </Button>
      </LoginBox>
      <UtilBox sx={{ paddingX: '1rem' }}>
        <Button color='gray_2'>비밀번호 찾기</Button>
        <Button color='gray_2'>사업자 회원가입</Button>
      </UtilBox>
    </LoginWrap>
  );
};

export default JoinIndex;
