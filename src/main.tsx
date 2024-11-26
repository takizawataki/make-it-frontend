import '@/index.css';
import '@aws-amplify/ui-react/styles.css';
import 'regenerator-runtime';
import { ThemeProvider } from '@emotion/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthenticatorWithPasswordless } from '@/authenticator';
import { routeTree } from '@/routeTree.gen';
import theme from '@/theme';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: 'ap-northeast-1:c2c4fc9b-2bef-4aae-9898-d7069cdded57',
    endpoint: 'https://dataplane.rum.ap-northeast-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false,
  };

  const APPLICATION_ID: string = 'ade6419a-0a95-408b-8ddf-41de3da668f5';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'ap-northeast-1';

  new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

const router = createRouter({ routeTree });

// 型安全のためにルーターインスタンスを登録する
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * @see https://mswjs.io/docs/integrations/browser
 */
async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  return worker.start({ onUnhandledRequest: 'bypass' });
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  enableMocking().then(() => {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <AuthenticatorWithPasswordless>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthenticatorWithPasswordless>
      </StrictMode>,
    );
  });
}
