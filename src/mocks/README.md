# mocks

[MSW: Mock Service Worker](https://mswjs.io/) を使用して API 通信をモックします。

## 使い方

モックしたい API 対応するリクエストとレスポンスを handlers.ts に定義します

## 備考

1. モック未定義リクエストがあった場合、標準で出力される警告は `onUnhandledRequest` を使用して出力されないようにしています
