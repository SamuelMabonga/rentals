import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { SessionProvider } from "next-auth/react"



import '../styles/globals.css';
import createEmotionCache from '@/utility/createEmotionCache';
import lightThemeOptions from '@/theme/lightThemeOptions';


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <SessionProvider
          session={session}
          // Re-fetch session every 5 minutes
          refetchInterval={5 * 60}
          // Re-fetches session when window is focused
          refetchOnWindowFocus={true}
          refetchWhenOffline={false}
        >
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;