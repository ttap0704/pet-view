import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import InputOutlined from '../../../src/components/input/InputOutlined';
import Button from '../../../src/components/button/Button';
import UtilBox from '../../../src/components/common/UtilBox';

import { fetchPostApi } from '../../../src/utils/api';

import { ModalContext } from '../../../src/provider/ModalProvider';

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
  justifyContent: 'center',
  gap: '1rem',
}));

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));

const LoginIndex = () => {
  const router = useRouter();

  const { modal_alert, modal_notice } = useContext(ModalContext);
  const [joinInfo, setJoinInfo] = useState([
    {
      value: '',
      status: true,
      placeholder: '이메일을 입력해주세요.',
      title: '이메일',
      type: 'text',
    },
    {
      value: '',
      status: true,
      placeholder: '비밀번호를 입력해주세요.',
      title: '비밀번호',
      type: 'password',
    },
    {
      value: '',
      status: true,
      placeholder: '비밀번호를 입력해주세요.',
      title: '비밀번호 확인',
      type: 'password',
    },
    {
      value: '',
      status: true,
      placeholder: '이름을 입력해주세요.',
      title: '이름',
      type: 'text',
    },
    {
      value: '',
      status: true,
      placeholder: '닉네임을 입력해주세요.',
      title: '닉네임',
      type: 'text',
    },
  ]);

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setJoinInfo(state => {
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

  const joinUser = async () => {
    const join_data = {
      id: joinInfo[0].value,
      password: joinInfo[1].value,
      password_check: joinInfo[2].value,
      name: joinInfo[3].value,
      nickname: joinInfo[4].value,
    };

    if (
      join_data.id.length == 0 ||
      join_data.password.length == 0 ||
      join_data.password_check.length == 0 ||
      join_data.name.length == 0 ||
      join_data.nickname.length == 0
    ) {
      modal_alert.openModalAlert('모든 정보를 입력해주세요.');
    } else if (join_data.password.length != join_data.password_check.length) {
      modal_alert.openModalAlert('비밀번호가 일치하지 않습니다.');
    }

    const user = await fetchPostApi('/user/join', join_data);

    if (user.id) {
      modal_notice.openModalNotice('회원가입이 완료되었습니다.', () => {
        router.push('/manage/login');
      });
    }
  };

  return (
    <LoginWrap>
      <Typography variant='h4'>회원가입</Typography>
      <Divider sx={{ width: '50%', margin: '0.5rem auto' }} />
      <LoginBox>
        {joinInfo.map((info, index) => {
          return (
            <Box key={`join_contents_${index}`}>
              <Typography>{info.title}</Typography>
              <InputOutlined
                type={info.type}
                value={info.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLoginInput(e, index)}
                placeholder={info.placeholder}
              />
            </Box>
          );
        })}
        <Button variant='contained' color='orange' sx={{ marginTop: '0.5rem' }} onClick={joinUser}>
          회원가입
        </Button>
      </LoginBox>
      {/* <UtilBox sx={{ paddingX: '1rem' }}>
        <Button color='gray_2'>비밀번호 찾기</Button>
        <Button color='gray_2'>
          <Link href='/join'>사업자 회원가입</Link>
        </Button>
      </UtilBox> */}
    </LoginWrap>
  );
};

export default LoginIndex;
