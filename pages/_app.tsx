import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import configureStore from '../src/store/configureStore';
import '../src/assets/styles/globals.scss';
import dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from '../src/provider/ModalProvider';
import TableProvider from '../src/provider/TableProvider';
import theme from '../src/utils/theme';
import LayoutApp from '../src/components/layout/LayoutApp';
import LayoutManage from '../src/components/layout/LayoutManage';

dotenv.config();
// store 설정파일 로드
const store = configureStore();

const _APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [rootPath, setRootPath] = useState('');

  useEffect(() => {
    const root_path = router.pathname.split('/')[1];
    setRootPath(root_path);
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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <Layout />
        </ModalProvider>
      </ThemeProvider>
    </Provider>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default _APP;
