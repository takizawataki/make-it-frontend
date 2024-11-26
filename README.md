# make it !

## 使い方

依存ライブラリのインストールと実行:

```bash
npm ci
npm run prepare
npm run dev
```

その他:

```bash
# コードのフォーマット
npm run format
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## デプロイについて

- production, staging ブランチへマージされた際に、自動で Amplify にデプロイが行われます

## もっと知る

さらに詳しく知るには:

- [Vite | 次世代フロントエンドツール](https://ja.vitejs.dev/) - Vite の機能 と API について学ぶ
- [Customizing Material UI](https://mui.com/material-ui/customization/how-to-customize/) - Material UI カスタマイズのアプローチ
- [TanStack Router](https://tanstack.com/router/latest) - Router の詳細はこちらを参照
