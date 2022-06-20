import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { setUser } from '../../src/store/slices/user';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import InputOutlined from '../../src/components/input/InputOutlined';
import Button from '../../src/components/button/Button';
import UtilBox from '../../src/components/common/UtilBox';

import { ModalContext } from '../../src/provider/ModalProvider';
import { fetchPostApi } from '../../src/utils/api';
import { RootState } from '../../src/store';
import LayoutLogin from '../../src/components/layout/LayoutLogin';

const SuperLogin = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();
  const dispatch = useDispatch();

  const { modal_alert, modal_notice } = useContext(ModalContext);

  const userLogin = async (data: { id: string; password: string }) => {
    const login_data = {
      login_id: data.id,
      password: data.password,
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
    <LayoutLogin onSubmit={userLogin}>
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
    </LayoutLogin>
  );
};

export default SuperLogin;
