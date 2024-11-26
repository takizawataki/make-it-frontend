import { defineConfig } from 'orval';

export default defineConfig({
  makeIt: {
    input: '../make-it-api-specification/make-it-api-spec.yaml',
    output: {
      mode: 'single',
      target: './src/lib/generatedApi.ts',
      baseUrl: '/api',
      mock: true,
      override: {
        mutator: {
          path: './src/lib/apiClient.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
