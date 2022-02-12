import React from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import configureStore from '../src/store/configureStore';
import '../src/assets/styles/globals.scss';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/utils/theme';

// store 설정파일 로드
const store = configureStore();

const _APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  function rest(test: string) {
    console.log(test);
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component style={{ width: '100%', height: '100%' }} {...pageProps} />
        <div className='hihi' onClick={() => rest('test')}>
          hi
        </div>
      </ThemeProvider>
    </Provider>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default _APP;
