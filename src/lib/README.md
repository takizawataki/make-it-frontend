# lib

## api.ts

- Restful API 用に HTTP 層のオペレーションを提供します
- HTTP クライアントの実装を隠蔽します
- プロジェクトに応じて HTTP クライアントを差し替えることができます

## generatedApi.ts

- [orval](https://orval.dev/) を使用して生成された API クライアントを提供します。
- `npm run generate:api` で生成されます。
  - `make-it-frontend` リポジトリと同階層に `make-it-api-specification` リポジトリが存在することを前提としています。
- 直接編集は禁止します。修正が必要な場合は、API 定義書もしくは orval の設定を変更して再生成してください。

## TODO

- プレゼンテーション層と API 通信の関心の分離を実現する
  - Repository パターン
    - 各 Entity ごとに CRUD 操作を提供する
    - API クライアントを inject して API 層は入れ替え可能にします (OpenAPI から生成したクライアントも将来的に使用できる想定)
  - Service 層の導入
  - ソフトウェア工学的アプローチ (要参考文献)
