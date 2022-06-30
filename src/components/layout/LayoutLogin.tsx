import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useState } from 'react';
import { styled } from '@mui/material/styles';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import InputOutlined from '../input/InputOutlined';
import Button from '../button/Button';

interface LayoutLoginProps {
  children?: React.ReactChild;
  onSubmit: (data: { id: string; password: string }) => void;
  join?: boolean;
}

const LoginWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '2rem auto 0 !important',
  height: 'auto',
  padding: '1rem',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  position: 'relative',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '350px',
  },
  [theme.breakpoints.between('md', 'lg')]: {
    maxWidth: '325px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '275px',
  },
}));

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
}));

const LayoutLogin = (props: LayoutLoginProps) => {
  const router = useRouter();
  const children = props.children;
  const onSubmit = props.onSubmit;
  const join = props.join;

  const [loginInfo, setLoginInfo] = useState([
    {
      value: '',
      status: true,
      icon: <MdAttachEmail />,
      placeholder: '이메일을 입력해주세요.',
      type: 'text',
    },
    {
      value: '',
      status: true,
      icon: <RiLockPasswordFill />,
      placeholder: '비밀번호를 입력해주세요.',
      type: 'password',
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

  const handleLogin = async () => {
    const data = {
      id: loginInfo[0].value,
      password: loginInfo[1].value,
    };

    onSubmit(data);
  };

  const moveJoin = () => {
    if (router.pathname.includes('admin')) {
      router.push('/admin/join');
    } else {
      router.push('/join');
    }
  };

  return (
    <LoginWrap>
      {/* <BackButton
        color='gray_2'
        onClick={() => {
          router.push('/');
        }}
      >
        돌아가기
      </BackButton> */}
      <Typography variant='h4'>로그인</Typography>
      <LoginBox>
        {loginInfo.map((info, index) => {
          return (
            <InputOutlined
              type={info.type}
              startAdornment={info.icon}
              value={info.value}
              key={`login_contents_${index}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLoginInput(e, index)}
              placeholder={info.placeholder}
            />
          );
        })}
        <Button variant='contained' color='orange' sx={{ marginTop: '0.5rem' }} onClick={handleLogin}>
          로그인
        </Button>

        {join ? (
          <Button variant='outlined' color='orange' sx={{ marginTop: '0rem' }} onClick={moveJoin}>
            회원가입
          </Button>
        ) : null}
      </LoginBox>
      {children}
    </LoginWrap>
  );
};

export default LayoutLogin;
