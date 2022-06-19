import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEffect, useState, useContext, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { setUser } from '../../src/store/slices/user';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { HiArrowNarrowLeft } from 'react-icons/hi';

import InputOutlined from '../../src/components/input/InputOutlined';
import Button from '../../src/components/button/Button';
import UtilBox from '../../src/components/common/UtilBox';

import { ModalContext } from '../../src/provider/ModalProvider';
import { fetchPostApi } from '../../src/utils/api';
import { RootState } from '../../src/store';
import wrapper from '../../src/store/configureStore';
import { fetchGetApi } from '../../src/utils/api_back';

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

const LoginIndex = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();
  const dispatch = useDispatch();

  const { modal_alert, modal_notice } = useContext(ModalContext);

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

  const userLogin = async () => {
    const login_data = {
      login_id: loginInfo[0].value,
      password: loginInfo[1].value,
    };

    if (login_data.login_id.length == 0 || login_data.password.length == 0) {
      modal_alert.openModalAlert('모든 정보를 입력해주세요.');
      return;
    }

    const login_res = await fetchPostApi('/super/login', login_data);
    if (login_res.pass && login_res.user.type == 0) {
      const user: UserType = login_res.user;
      const saved_user = {
        uid: user.id,
        ...user,
      };
      sessionStorage.setItem('user', JSON.stringify({ ...saved_user }));
      dispatch(setUser({ ...saved_user }));
      modal_notice.openModalNotice(`${user.nickname}님 환영합니다!`, () => {
        router.push('/super');
      });
    } else {
      let message = '';
      let callback = () => {
        return;
      };
      if (login_res.message == 'Before Certification') {
        message = '이메일 인증 완료 후\r\n로그인 해주세요.';
      } else if (login_res.message == 'Not Super') {
        message = '접근 권한이 없습니다.';
        callback = () => {
          router.push('/');
        };
      } else {
        message = '아이디 또는 비밀번호가 틀렸습니다.';
      }
      modal_alert.openModalAlert(message, true, callback);
    }
  };

  return (
    <LoginWrap>
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
        <Button variant='contained' color='orange' sx={{ marginTop: '0.5rem' }} onClick={userLogin}>
          로그인
        </Button>
      </LoginBox>
      <UtilBox>
        <Button
          onClick={() => {
            router.push('/');
          }}
          variant='outlined'
        >
          앱
        </Button>

        <Button
          onClick={() => {
            router.push('/admin');
          }}
          variant='outlined'
        >
          관리자
        </Button>
      </UtilBox>
    </LoginWrap>
  );
};

export default LoginIndex;
