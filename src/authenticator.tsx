import {
  ThemeProvider as AmplifyThemeProvider,
  Authenticator,
} from '@aws-amplify/ui-react';
import { Passwordless } from 'amazon-cognito-passwordless-auth';
import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react';
import { ReactNode } from 'react';
import { amplifyTheme } from '@/amplifyAuthInit';
import 'amazon-cognito-passwordless-auth/passwordless.css';

Passwordless.configure({
  clientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID, //replace with client id attribute in the CloudFormation output
  cognitoIdpEndpoint: 'ap-northeast-1', //replace with region, e.g. "us-east-1"
  debug: console.trace,
});

export function AuthenticatorWithPasswordless({
  children,
}: {
  children: ReactNode;
}) {
  const withoutAuthPath = ['/login-with-magic-link'];
  const isLoginWithMagicLink = withoutAuthPath.includes(location.pathname);
  return (
    <>
      {isLoginWithMagicLink ? (
        <>
          <PasswordlessContextProvider>{children}</PasswordlessContextProvider>
        </>
      ) : (
        <AmplifyThemeProvider theme={amplifyTheme}>
          <Authenticator>{children}</Authenticator>
        </AmplifyThemeProvider>
      )}
    </>
  );
}
