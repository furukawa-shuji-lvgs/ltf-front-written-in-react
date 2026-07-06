# ltf-front (Nuxt) → ltf-react (Next.js 15 App Router) 移行規約

すべての移行作業はこの規約に従うこと。移行元: `/Users/shujifurukawa/programing/work/ownd/front/ltf-front`

## アーキテクチャ: Feature デザイン

Atomic デザイン（Atoms/Molecules/Organisms/Templates）は廃止し、機能単位で分割する。

```
src/
  app/                       # Next.js App Router（ルーティングのみ。ロジックを置かない）
    <route>/page.tsx         # features の Page コンポーネントを組み立てるだけの薄い層
    <route>/layout.tsx
  features/<feature>/
    components/              # この feature 専用のコンポーネント（*.tsx + *.module.scss）
    hooks/                   # この feature 専用のカスタムフック
    api/                     # サーバー側データ取得（gRPC 呼び出し + DTO マッピング）
    constants/               # この feature 専用の定数
    types.ts                 # この feature の型定義
  features/routeCatalog/
    routes.ts                # Nuxt 全ページ移行中のルート定義の正本
    routeMatcher.ts          # App Router の catch-all から feature Page を解決
  features/legacyVrt/        # 全ページ VRT 安定化中のみ使う暫定 UI / fixture / style
    api/
    components/LegacyVrtPageShell.tsx
    components/LegacyVrtPageParts.tsx
  shared/
    components/              # 複数 feature で使う UI（Header, Footer, Breadcrumbs, Pagination など）
    hooks/                   # 汎用フック
    lib/                     # env, device, grpc(callGrpc, credentials), date, seo などのユーティリティ
    constants/               # 全体共通の定数
    styles/                  # volt-tokens, variables, destyle, base, globals
    types/                   # 共通型
```

- feature 間の import は原則禁止。例外は全ページ移行中の `routeCatalog` のみ。
- `shared/` から `features/` への import は禁止。違反は `pnpm boundaries:check` で検出する。
- barrel file は Biome で警告対象。必要なファイルを直接 import する。
- ページ数が多くても feature は「ドメイン」単位でまとめる（例: guide 配下 6 ルート → `features/guide` 1 つ）。
- `LegacyVrtPageShell` は `legacyVrt` 専用の暫定 shell。旧 Nuxt の全ページ VRT が安定したら、各 feature の実装へ本文を段階的に移す。

## ルーティング対応

- Nuxt `pages/foo/[id]/index.vue` → `src/app/foo/[id]/page.tsx`
- ページネーション `p[page]` セグメントは `src/app/.../p[page]/page.tsx`（ディレクトリ名は `p[page]` のまま使える）
- `definePageMeta({ layout: "original" })` → App Router のネストレイアウト or Page 内で `<OriginalLayout>` を組む
- 動的ページは `generateMetadata` で TDKH（gRPC `shared/api/seo/getTdkh`）を設定する
- 旧 VRT 互換のため root id `#__nuxt` は残す。新しいテスト・実装上の locator は `data-testid="app-root"` を使う。

## コンポーネント実装

- デフォルトは Server Component。インタラクション（state/effect/イベント）がある末端のみ `"use client"`
- データ取得は Server Component から `features/<f>/api/*.ts` を直接 await（Nitro の `/api/grpc/**` 相当の Route Handler は作らない。POST は Server Actions か Route Handler）
- Node.js 専用 API、gRPC、env、旧画像 host 解決は `import "server-only";` を先頭に置く。
- PC/SP 出し分け: `@shared/lib/device` の `getDevice()`（UA 判定）を Server Component で使い、`XxxPc` / `XxxSp` を出し分ける（旧 `$device` 相当）
- 命名: コンポーネントは PascalCase。旧 `OrganismsProjectSearchConditions` のような接頭辞は外し、feature 内の意味のある名前にする（例: `SearchConditions`）

## API 層（gRPC）

移行元 `server/api/grpc/**/*.get.ts|post.ts` を `features/<f>/api/<name>.ts` に移植する。

```ts
import "server-only"

import { GetXxxRequest } from "@generated/xxx"
import { XxxClient } from "@generated/xxx.grpc-client"
import { Result } from "@generated/results/result"
import { grpcCredentialOptions, grpcCredentials } from "@shared/lib/grpc/credentials"
import { callGrpc } from "@shared/lib/grpc/call"
import { getEnv } from "@shared/lib/env"

const client = new XxxClient(getEnv().GRPC_HOST, grpcCredentials, grpcCredentialOptions)

export const getXxx = async (req: GetXxxRequest): Promise<XxxDto> => {
    const response = await callGrpc(client.getXxx.bind(client), req)
    if (response.result !== Result.Success) return emptyDto
    return {
        /* protobuf → DTO のマッピング。?? でフォールバックする既存の流儀を踏襲 */
    }
}
```

- DTO interface は移行元の定義をそのまま移植し、`types.ts` に置く
- gRPC 失敗時は移行元と同じく「空 DTO を返す」挙動を維持する（reject するのは通信エラーのみ）
- `@grpc/grpc-js` は Client Component から辿れる依存に入れない。`pnpm boundaries:check` と `server-only` で検知できる形にする。

## スタイリング

- SCSS Modules（`Xxx.module.scss`）。volt-tokens / variables は `next.config.mjs` の `additionalData` で自動注入済みなので `@use` 不要
- 移行元の `.vue` の `<style lang="scss" scoped>` の中身をほぼそのまま移せる。クラス名は camelCase に変換（`styles.projectCard`）
- メディアクエリ mixin など `variables.scss` の定義（`@include mq()` 等）はそのまま使える
- Font は `next/font/google` で読み込む。外部 stylesheet link は追加しない。
- 画像は `LegacyImage` 経由で `next/image` を使う。SVG/data URL 以外は Next Image optimizer に乗せるため、外部 host は `next.config.mjs` の `images.remotePatterns` に追加する。

## テスト（テストピラミッド）

多い順に:
1. **ユニットテスト（最多・コロケーション）**: `src/**/*.test.ts(x)`。対象: `api/` の DTO マッピング（grpc-client をモック）、hooks、lib、ロジックを持つ関数すべて
2. **コンポーネントテスト**: Testing Library で `*.test.tsx`。対象: インタラクティブなコンポーネント（フォーム、開閉 UI、ページネーション）と、表示分岐のあるコンポーネント
3. **インテグレーションテスト（少数）**: `tests/integration/`。ページコンポーネントを api モックで render し、主要要素が揃うことを確認
4. **E2E（最少・スモーク）**: `tests/e2e/*.spec.ts`。Playwright。主要ページが 200 で表示され、クリティカルパス（検索、フォーム送信 UI）が動くことのみ

規約:
- テスト名は日本語で `前提 / 検証: 振る舞い / 期待: 結果` の形式にする
- テストケースは AAA（Arrange / Act / Assert）を空行で分け、Act は原則 1 回にする
- 1 テスト 1 振る舞いに絞り、曖昧な `toBeTruthy()` ではなく具体的な matcher を使う
- gRPC クライアントは `vi.mock("@generated/xxx.grpc-client")` でモック
- `next/headers` / `next/navigation` を使うものは `vi.mock` する
- コンポーネントテストは実装詳細（クラス名）でなくロール/テキストで検証
- E2E/VRT の全ページ route は `features/routeCatalog/routes.ts` を正本にし、`tests/e2e/fixtures/allPages.ts` では期待テキストと VRT 用クエリだけを補足する
- VRT は ltf-front のスナップショットを基準画像にし、`maxDiffPixelRatio: 0.3` を維持する。CI では `workflow_dispatch` または PR label `run-vrt` のときだけ実行する。

## コードスタイル

- インデント 2 スペース、ダブルクォート、セミコロンあり、複数行 trailing comma あり（`biome.json` 準拠）
- アロー関数コンポーネント + named export（`export const XxxPage = ...`）。`src/app/**` の page/layout のみ default export（Next の要件）
- 型は `interface` より `type` を優先しない — 移行元の定義に合わせる
- コメント・テスト名は日本語可（移行元の流儀に合わせる）
- Node.js は `.node-version` / Docker / CI で `24.18.0` に固定する。
- 本番コンテナは `next.config.mjs` の `output: "standalone"` を使い、`docker/node/Dockerfile` は `.next/standalone` を `node server.js` で起動する。
