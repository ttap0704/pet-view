import React from 'react';
import { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '../src/assets/styles/globals.scss';
import dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from '../src/provider/ModalProvider';
import TableProvider from '../src/provider/TableProvider';
import theme from '../src/utils/theme';
import LayoutApp from '../src/components/layout/LayoutApp';
import LayoutManage from '../src/components/layout/LayoutManage';
import wrapper from '../src/store/configureStore';
import { setUser } from '../src/store/slices/user';

dotenv.config();
// store 설정파일 로드

const _APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [rootPath, setRootPath] = useState('');

  useEffect(() => {
    const root_path = router.pathname.split('/')[1];
    setRootPath(root_path);

    const session = window.sessionStorage;
    if (!session.getItem('restaurant')) session.setItem('restaurant', JSON.stringify({ list: [] }));
    if (!session.getItem('accommodation')) session.setItem('accommodation', JSON.stringify({ list: [] }));
  }, [router.pathname]);

  const Layout = () => {
    if (rootPath.indexOf('manage') >= 0) {
      return (
        <LayoutManage>
          <TableProvider>
            <Component {...pageProps} />
          </TableProvider>
        </LayoutManage>
      );
    } else if (['login', 'join'].includes(rootPath)) {
      return <Component {...pageProps} />;
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
      <script
        type='text/javascript'
        src={`//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services`}
        id='KAKAO_MAP_SERVICE'
      />
    </>
  );
};

export default wrapper.withRedux(_APP);
