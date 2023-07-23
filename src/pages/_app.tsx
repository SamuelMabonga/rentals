import * as React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';

import '../styles/globals.css';
import "../styles/ReactCrop.css"

import createEmotionCache from '@/utility/createEmotionCache';
import lightThemeOptions from '@/theme/lightThemeOptions';
import { SessionProvider, useSession } from 'next-auth/react';
import { CollectionsContext, CollectionsProvider } from 'context/context';
import DashboardLayout from 'Components/Dashboard/DashboardLayout';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXhfd3RcRGZdUkd2WEU=")




// const queryClient = new QueryClient();

function Auth({ children }: any) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  // if (status === "loading") {
  //   return <Box width="100vw" height="100vh">
  //     Loading...
  //   </Box>
  // }

  return children
}


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } }: any = props;

  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <CacheProvider value={emotionCache}>
      <CollectionsProvider>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <SessionProvider session={session}>
                {Component.auth ? (
                  <Auth>
                    {/* <QueryClientProvider client={queryClient}>
                      <Hydrate state={pageProps.dehydratedState}> */}
                        <DashboardLayout>
                          <Component {...pageProps} />
                        </DashboardLayout>
                      {/* </Hydrate>
                      <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider> */}
                  </Auth>
                ) : (
                  <Component {...pageProps} />
                )}
              </SessionProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>


        </ThemeProvider>
      </CollectionsProvider>
    </CacheProvider>
  );
};

export default MyApp;