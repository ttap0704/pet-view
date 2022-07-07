import Button from './Button';

const kakaoLogin = async () => {
  const kakao = (window as any).Kakao;

  console.log(kakao);
  // 카카오 로그인 구현
  kakao.Auth.login({
    success: () => {
      kakao.API.request({
        url: '/v2/user/me', // 사용자 정보 가져오기
        success: (res: any) => {
          // 로그인 성공할 경우 정보 확인 후 /kakao 페이지로 push
          console.log(res);
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

function ButtonKaKaoLogin() {
  return (
    <Button color='kakao_yellow' variant='contained' onClick={kakaoLogin}>
      카카오 로그인
    </Button>
  );
}

export default ButtonKaKaoLogin;
