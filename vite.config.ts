import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    // https://qiita.com/fussy113/items/9459fad52cc98f868e4a を参考にした
    alias: [{ find: '@/', replacement: `${__dirname}/src/` }],
  },
  // NOTE: https://ja.vitejs.dev/config/server-options#server-host
  // 手元のスマホから確認するため
  server: {
    host: true,
  },
});
