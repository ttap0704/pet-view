import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEffect, useState, useContext, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { setUser } from '../../../src/store/slices/user';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { HiArrowNarrowLeft } from 'react-icons/hi';

import InputOutlined from '../../../src/components/input/InputOutlined';
import Button from '../../../src/components/button/Button';
import UtilBox from '../../../src/components/common/UtilBox';

import { ModalContext } from '../../../src/provider/ModalProvider';
import { fetchPostApi } from '../../../src/utils/api';
import { RootState } from '../../../src/store';
import wrapper from '../../../src/store/configureStore';

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

  useEffect(() => {
    if (user.uid) {
      router.push('/manage');
    }
  }, []);

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
      id: loginInfo[0].value,
      password: loginInfo[1].value,
    };

    if (login_data.id.length == 0 || login_data.password.length == 0) {
      modal_alert.openModalAlert('모든 정보를 입력해주세요.');
      return;
    }

    const user = await fetchPostApi('/user/login', login_data);
    if (user.pass) {
      const saved_user = {
        uid: user.uid,
        unick: user.nickname,
        profile_path: user.profile_path,
      };
      sessionStorage.setItem('user', JSON.stringify({ ...saved_user }));
      dispatch(setUser({ ...saved_user }));
      modal_notice.openModalNotice(user.message, () => {
        router.push('/manage');
      });
    } else {
      modal_alert.openModalAlert(user.message, true);
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
      <UtilBox sx={{ paddingX: '1rem' }}>
        <Button color='gray_2'>비밀번호 찾기</Button>
        <Link href='/manage/join'>
          <Typography component='a'>
            <Button color='gray_2'>사업자 회원가입</Button>
          </Typography>
        </Link>
      </UtilBox>
      <UtilBox>
        <Button
          color='gray_2'
          onClick={() => {
            router.push('/');
          }}
        >
          <HiArrowNarrowLeft />
          돌아가기
        </Button>
      </UtilBox>
    </LoginWrap>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(store => async ({ params }) => {
//   console.log(store.getState().userReducer, 'loginPage');
//   const { dispatch } = store;
//   dispatch(setUser({ uid: 100, unick: '', profile_path: '' }));
//   return { props: {} };
// });

export default LoginIndex;
