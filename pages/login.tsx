import { useRouter } from 'next/router';

import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../src/store/slices/user';

import LayoutLogin from '../src/components/layout/LayoutLogin';

import { ModalContext } from '../src/provider/ModalProvider';
import { fetchGetApi, fetchPostApi } from '../src/utils/api';

const LoginIndex = () => {
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

    const login_res = await fetchPostApi('/users/login', login_data);
    if (login_res.pass) {
      const user: UserType = login_res.user;
      const saved_user = {
        ...user,
        uid: user.id,
        profile_path: user.profile_path ? `http://localhost:3080${user.profile_path}` : '',
      };
      sessionStorage.setItem('user', JSON.stringify({ ...saved_user }));
      sessionStorage.setItem('likes', JSON.stringify({ ...(await fetchGetApi(`/users/${user.id}/like-product`)) }));
      dispatch(setUser({ ...saved_user }));
      modal_notice.openModalNotice(`${user.nickname}님 환영합니다!`, () => {
        router.push('/');
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
    <>
      <LayoutLogin onSubmit={userLogin} join={true} />
    </>
  );
};

export default LoginIndex;
