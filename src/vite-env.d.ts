/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATE_RESPONSE_URL: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_USER_POOL_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
