import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ModalContext } from '../../provider/ModalProvider';
import { setUser } from '../../store/slices/user';
import { fetchGetApi, fetchPostApi } from '../../utils/api';
import Button from './Button';

function ButtonKaKaoLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { modal_notice } = useContext(ModalContext);

  const kakaoLogin = async () => {
    const kakao = (window as any).Kakao;

    kakao.Auth.login({
      success: () => {
        kakao.API.request({
          url: '/v2/user/me', // 사용자 정보 가져오기
          success: (res: any) => {
            const data = {
              login_id: res.kakao_account.email,
              nickname: res.kakao_account.profile.nickname,
            };
            checkLogin(data);
          },
          fail: (error: any) => {
            console.log(error);
          },
        });
      },
      fail: (error: any) => {
        console.log(error);
      },
    });
  };

  const checkLogin = async (data: { login_id: string; nickname: string }) => {
    const user = await fetchGetApi(`/users/platform/kakao?login_id=${data.login_id}`);

    if (user === false) {
      router.push(
        {
          pathname: '/join',
          query: {
            ...data,
            kakao: true,
          },
        },
        '/join',
      );
    } else {
      const login_res = await fetchPostApi('/users/login', { login_id: data.login_id, password: '123' });
      if (login_res.pass) {
        const user: UserType = login_res.user;
        const saved_user = {
          ...user,
          uid: user.id,
          profile_path: user.profile_path ? `http://localhost:3080${user.profile_path}` : '',
          likes: await fetchGetApi(`/users/${user.id}/like-product`),
        };
        sessionStorage.setItem('user', JSON.stringify({ ...saved_user }));
        dispatch(setUser({ ...saved_user }));
        modal_notice.openModalNotice(`${user.nickname}님 환영합니다!`, () => {
          router.push('/');
        });
      }
    }
  };

  return (
    <Button color='kakao_yellow' variant='contained' onClick={kakaoLogin}>
      카카오 로그인
    </Button>
  );
}

export default ButtonKaKaoLogin;
