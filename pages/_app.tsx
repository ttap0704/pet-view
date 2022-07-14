import React, { useContext } from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '../src/assets/styles/globals.scss';
import dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider, { ModalContext } from '../src/provider/ModalProvider';
import TableProvider from '../src/provider/TableProvider';
import theme from '../src/utils/theme';
import LayoutApp from '../src/components/layout/LayoutApp';
import LayoutAdmin from '../src/components/layout/LayoutAdmin';
import wrapper from '../src/store/configureStore';
import { setUser, setUserMobile, resetUser } from '../src/store/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { GetServerSidePropsContext } from 'next';
import { fetchGetApi, fetchPostApi } from '../src/utils/api';
import { checkAppRedirect } from '../src/utils/tools';
import Head from 'next/head';

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
  const { modal_alert } = useContext(ModalContext);

  const router = useRouter();
  const [rootPath, setRootPath] = useState('');

  useEffect(() => {
    if (pageProps.tokenExpired) {
      dispatch(resetUser());
      window.sessionStorage.removeItem('user');
    } else {
      if (!excepted_path.includes(router.pathname) && !user.uid) {
        const session_user = sessionStorage.getItem('user');
        if (session_user) {
          const session: UserType = JSON.parse(session_user);
          dispatch(setUser(session));
        }
      }
    }

    // 실사용
    // if (pageProps.is_mobile) {
    //   setUserMobile({ is_mobile: pageProps.is_mobile });
    // }
    // 임시
    dispatch(setUserMobile({ is_mobile: false }));
  }, []);

  useEffect(() => {
    const root_path = router.pathname.split('/')[1];
    setRootPath(root_path);

    const local = window.localStorage;
    if (!local.getItem('restaurant')) {
      local.setItem('restaurant', JSON.stringify({ list: {} }));
    } else {
      const rest_list = local.getItem('restaurant');
      if (rest_list) {
        const rest_list_json: { list: { [key: string]: number[] } } = JSON.parse(rest_list);
        const target_list = rest_list_json.list;

        for (const key of Object.keys(target_list)) {
          if (
            new Date(key).getTime() <
            new Date(new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 6)).getTime()
          ) {
            delete target_list[key];
          }
        }

        local.setItem('restaurant', JSON.stringify({ list: target_list }));
      }
    }
    if (!local.getItem('accommodation')) {
      local.setItem('accommodation', JSON.stringify({ list: {} }));
    } else {
      const rest_list = local.getItem('accommodation');
      if (rest_list) {
        const rest_list_json: { list: { [key: string]: number[] } } = JSON.parse(rest_list);
        const target_list = rest_list_json.list;

        for (const key of Object.keys(target_list)) {
          if (
            new Date(key).getTime() <
            new Date(new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 6)).getTime()
          ) {
            delete target_list[key];
          }
        }

        local.setItem('accommodation', JSON.stringify({ list: target_list }));
      }
    }
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
      <Head>
        <script src='https://developers.kakao.com/sdk/js/kakao.js'></script>
        <script
          type='text/javascript'
          src={`//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services`}
          id='KAKAO_MAP_SERVICE'
        />
        <script>Kakao.init(`7f3acef0dda383251e1144046bfaba5b`)</script>
      </Head>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <Layout />
        </ModalProvider>
      </ThemeProvider>
    </>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const userAgent = (await appContext.ctx.req) ? appContext.ctx.req?.headers['user-agent'] : navigator.userAgent;
  const mobile = await userAgent?.indexOf('Mobi');
  const path = appContext.router.pathname;
  appProps.pageProps.isMobile = (await (mobile !== -1)) ? true : false;

  if (appContext.ctx.req && appContext.ctx.res) {
    const { headers } = appContext.ctx.req;
    const context = appContext.ctx;
    if (headers.cookie) {
      const cookie = headers.cookie.split('; ').filter(item => item.includes('a-token'));
      if (cookie.length > 0) {
        let type = '';
        if (path.includes('admin')) {
          type = 'admin';
        } else if (path.includes('super')) {
          type = 'super';
        }
        const token_res = await fetchGetApi(`/auth?type=${type}`, context);
        if (token_res.statusCode && token_res.statusCode == 401) {
          const new_token_res = await fetchPostApi('/auth/token', { token: cookie[0].replace('a-token=', '') });
          const three_month_later = new Date(new Date().setMonth(new Date().getMonth() + 3)).toUTCString();

          if (new_token_res.pass && new_token_res.new_token) {
            appContext.ctx.res.setHeader(
              'Set-Cookie',
              `a-token=${new_token_res.new_token}; expires=${three_month_later}; path=/`,
            );
          } else {
            appProps.pageProps.token_expires = true;

            const check_redirect = await checkAppRedirect(path);
            if (check_redirect.redirect_state) {
              appContext.ctx.res.setHeader('Set-Cookie', `a-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`);
              appContext.ctx.res.writeHead(307, { Location: check_redirect.redirect.destination });
              appContext.ctx.res.end();
            }
          }

          appContext.ctx.res.end();
        }
      } else {
        const check_redirect = await checkAppRedirect(path);
        if (check_redirect.redirect_state) {
          appContext.ctx.res.setHeader('Set-Cookie', `a-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`);
          appContext.ctx.res.writeHead(307, { Location: check_redirect.redirect.destination });
          appContext.ctx.res.end();
        }
      }
    }
  }

  return { ...appProps };
};

export default wrapper.withRedux(_APP);
