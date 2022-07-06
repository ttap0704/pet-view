import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '../src/assets/styles/globals.scss';
import dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from '../src/provider/ModalProvider';
import TableProvider from '../src/provider/TableProvider';
import theme from '../src/utils/theme';
import LayoutApp from '../src/components/layout/LayoutApp';
import LayoutAdmin from '../src/components/layout/LayoutAdmin';
import wrapper from '../src/store/configureStore';
import { setUser, setUserMobile } from '../src/store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { GetServerSidePropsContext } from 'next';
import { fetchGetApi, fetchPostApi } from '../src/utils/api';

dotenv.config();
// store 설정파일 로드

const excepted_path = [
  '/admin/join',
  '/admin/login',
  '/admin/join/success',
  '/admin/join/certification/[id]',
  '/super/login',
];

const _APP = ({ Component, pageProps }: AppProps) => {
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();

  const router = useRouter();
  const [rootPath, setRootPath] = useState('');

  useEffect(() => {
    // 실사용
    // if (pageProps.is_mobile) {
    //   setUserMobile({ is_mobile: pageProps.is_mobile });
    // }

    // 임시
    dispatch(setUserMobile({ is_mobile: true }));

    if (!excepted_path.includes(router.pathname) && !user.uid) {
      const user = sessionStorage.getItem('user');
      if (user) {
        const session: UserType = JSON.parse(user);
        dispatch(setUser(session));
      }
    }
  }, []);

  useEffect(() => {
    const root_path = router.pathname.split('/')[1];
    setRootPath(root_path);

    const session = window.sessionStorage;
    if (!session.getItem('restaurant')) session.setItem('restaurant', JSON.stringify({ list: [] }));
    if (!session.getItem('accommodation')) session.setItem('accommodation', JSON.stringify({ list: [] }));
  }, [router.pathname]);

  const Layout = () => {
    if (rootPath.indexOf('admin') >= 0) {
      return (
        <LayoutAdmin>
          <TableProvider>
            <Component {...pageProps} />
          </TableProvider>
        </LayoutAdmin>
      );
    } else if (['login', 'join'].includes(rootPath)) {
      return <Component {...pageProps} />;
    } else if (rootPath.indexOf('super') >= 0) {
      return (
        <LayoutAdmin>
          <TableProvider>
            <Component {...pageProps} />
          </TableProvider>
        </LayoutAdmin>
      );
    } else {
      return (
        <LayoutApp>
          <Component style={{ width: '100%', height: 'auto' }} {...pageProps} />
        </LayoutApp>
      );
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <Layout />
        </ModalProvider>
      </ThemeProvider>
      {/* <script src='/node_modules/quill-image-resize-module/image-resize.min.js'></script> */}
      <script
        type='text/javascript'
        src={`//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services`}
        id='KAKAO_MAP_SERVICE'
      />
    </>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const userAgent = (await appContext.ctx.req) ? appContext.ctx.req?.headers['user-agent'] : navigator.userAgent;
  const mobile = await userAgent?.indexOf('Mobi');
  appProps.pageProps.isMobile = (await (mobile !== -1)) ? true : false;

  if (appContext.ctx.req && appContext.ctx.res) {
    const { headers } = appContext.ctx.req;
    const context = appContext.ctx;
    if (headers.cookie) {
      const cookie = headers.cookie.split('; ').filter(item => item.includes('a-token'));
      if (cookie.length > 0) {
        const token_res = await fetchGetApi('/auth', context);
        if (token_res.statusCode && token_res.statusCode == 401) {
          const new_token_res = await fetchPostApi('/auth/token', { token: cookie[0].replace('a-token=', '') });
          const three_month_later = new Date(new Date().setMonth(new Date().getMonth() + 3));

          console.log(new_token_res, new_token_res.new_token, three_month_later);

          if (new_token_res.new_token) {
            appContext.ctx.res.setHeader('Set-Cookie', `a-token=; expires=2022-12-31 12:33:30; path=/`);
            // appContext.ctx.res.setHeader('Set-Cookie', `a-token=${123}; expires=${three_month_later}; path=/`);
            appContext.ctx.res.end();
          }
        }
        // const a_token = cookie[0].replace('a-token=', '');
      }
    }
  }

  return { ...appProps };
};

export default wrapper.withRedux(_APP);
