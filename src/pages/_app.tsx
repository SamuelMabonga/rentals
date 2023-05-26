import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';



import '../styles/globals.css';
import "../styles/ReactCrop.css"
import createEmotionCache from '@/utility/createEmotionCache';
import lightThemeOptions from '@/theme/lightThemeOptions';
import { SessionProvider, useSession } from 'next-auth/react';
import { CollectionsContext, CollectionsProvider } from 'context/context';
import DashboardLayout from 'Components/Dashboard/DashboardLayout';

function Auth({ children }: any) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } }: any = props;

  return (
    <CacheProvider value={emotionCache}>
      <CollectionsProvider>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <SessionProvider session={session}>
            {Component.auth ? (
              <Auth>
                <DashboardLayout>
                  <Component {...pageProps} />
                </DashboardLayout>
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </SessionProvider>
        </ThemeProvider>
      </CollectionsProvider>
    </CacheProvider>
  );
};

export default MyApp;