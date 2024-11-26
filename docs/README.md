# docs

本プロジェクトにおける技術選定の経緯などを記載します。

## ベースプロジェクト

本プロジェクトは、以下のベースプロジェクトを利用しています。

# Vite

- フロントエンドプロジェクトのバンドラです
- https://vitejs.dev/
- 本 Boilerplate の 2.0 までは Next.js Static Exports を採用していたが、ルーティングなどに SPA での使いにくさがあったので Vite に移行した

# TanStack Router

- SPA 用のルーター
- https://tanstack.com/router/latest/docs/framework/react/quick-start
- TS 型安全を実現している

## MUI

- React の UI ライブラリ
- https://mui.com/
- React コンポーネントを提供しており、これを利用することで UI の実装を容易にすることができます
- [npm trends](https://npmtrends.com/@cloudscape-design/components-vs-@mui/material-vs-@nextui-org/react-vs-react-bootstrap) においても MUI が優位であることが定量的に示されています
- React コンポーネントを提供しない UI ライブラリは以下の理由により選択しません
  - React コンポーネントのスタイルを独自で実装する必要がある
  - UI レベルでの再利用可能な React コンポーネントが提供されていない

<!-- TODO: shadcn -->

## TypeScript

- 開発言語
- https://www.typescriptlang.org/
- JavaScript のスーパーセットであり、型を導入することで開発効率を向上させることができます
  - 静的解析による型エラーの検出
  - IDE による型情報の補完

## ESLint

- Linter
- https://eslint.org/
- [Configuring: ESLint | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/eslint) にならって設定しました
- [lint-staged](https://github.com/okonet/lint-staged) と [Husky](https://github.com/typicode/husky) も導入し、コミットのタイミングで Linter が動作するようにしています
- コードの品質を高めるため、 `.lintstagedrc.js` にて [--max-warnings](https://eslint.org/docs/latest/use/command-line-interface#--max-warnings) を設定しています
  - 警告が含まれるコードは commit できません
- [typescript-eslint](https://typescript-eslint.io/) を使用し TypeScript に対応させています
- import 順を以下のルールで検証しています
  - [Add sort rule for named imports](https://github.com/import-js/eslint-plugin-import/issues/1732#issuecomment-616246894)
  - [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)

## Prettier

- Formatter
- https://prettier.io/
- コードフォーマットを統一し可読性の向上を図る意図で導入しています
- VS Code の拡張機能設定でファイルを保存する際に Prettier によるフォーマットが実行されます
- [lint-staged](https://github.com/okonet/lint-staged) と [Husky](https://github.com/typicode/husky) も導入し、コミットのタイミングでフォーマットをチェックします

## Visual Studio Code 推奨 Extensions

本プロジェクトでは、以下の Extensions を推奨しています。
実案件で本プロジェクトをテンプレートとして使用する際は要件に応じて追加削除してください。

- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - タイポを防ぎます
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
  - エラーや警告がエディタ上に表示されます
  - Next.js プロジェクトでも採用されています
  - https://github.com/vercel/next.js/blob/canary/.vscode/extensions.json#L7
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Prettier についての説明](#prettier)
- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
  - `TODO` のようなアノテーションコメントがエディタ上でハイライトされます
  - https://github.com/vercel/next.js/blob/canary/.vscode/extensions.json#L16

## その他

### import スタイル

- alias import でモジュールをインポートすることを推奨しています
  - ESLint で alias import を lint する場合には [@dword-design/eslint-plugin-import-alias](https://github.com/dword-design/eslint-plugin-import-alias) のようなプラグインを導入してください。
  - (本プロジェクトでは該当プラグインの GitHub スター数を鑑みて導入していません。)
- import は named import で実施してください
  - SWC の tree-shaking によりバンドル時に最適化されます (TODO: Vite ではどうか要確認)

```typescript
// NG
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// OK - named import にまとめる
import { Home, Logout, Settings } from '@mui/icons-material';
```
