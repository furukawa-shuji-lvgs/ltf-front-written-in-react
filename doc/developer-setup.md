# ltf-react 開発者セットアップ

`ltf-react` は Next.js 15 App Router / React 19 / pnpm / Buf / gRPC を使う移行先アプリです。ローカル開発では、このディレクトリを作業ルートにします。

```bash
cd /Users/shujifurukawa/programing/work/ownd/front/ltf-react
```

## 前提

- Node.js: `24.18.0`
- pnpm: `10.23.0`
- Docker: Docker イメージをローカル確認する場合のみ
- Playwright ブラウザ: E2E / VRT を実行する場合のみ

Node.js と pnpm は `.node-version`、`package.json`、CI で固定しています。`engine-strict=true` のため、バージョンがずれていると `pnpm install` が失敗します。

```bash
node -v
corepack enable
corepack prepare pnpm@10.23.0 --activate
pnpm -v
```

GitHub Packages のプライベートパッケージが依存に入っている環境でインストールが失敗する場合は、事前に `NODE_AUTH_TOKEN` を設定してください。

## 初回セットアップ

```bash
pnpm install --frozen-lockfile
pnpm proto:generate
pnpm exec playwright install chromium
```

`contracts/grpc/generated/` は `pnpm proto:generate` で再生成します。proto / Buf の詳細は `doc/buf.md` を参照してください。

## ローカル起動

通常のローカル開発は、同梱の gRPC モックサーバーを使います。ターミナルを 2 つ開いて起動してください。

```bash
# ターミナル 1
pnpm grpc:mock
```

```bash
# ターミナル 2
CUSTOM_ENV=local GRPC_MOCK_INSECURE=true pnpm dev
```

アプリは `http://localhost:3000` で起動します。`CUSTOM_ENV` の未指定時はアプリ設定上 `local` 扱いになりますが、gRPC credential の判定は環境変数も見ているため、ローカル開発では `CUSTOM_ENV=local` を明示してください。

`GRPC_MOCK_INSECURE=true` はモックサーバーに insecure gRPC で接続するために必要です。付けない場合、gRPC client は SSL credential で接続します。

## 環境設定

アプリの環境別設定は `env/` にあります。

- `env/local.ts`: ローカルモックサーバー向け。`GRPC_HOST` は `127.0.0.1:60051`
- `env/development.ts`: 開発環境向け
- `env/staging.ts`: ステージング環境向け
- `env/production.ts`: 本番環境向け

`CUSTOM_ENV` に指定できる値は `local`、`development`、`staging`、`production` です。

## よく使うコマンド

```bash
pnpm check
pnpm boundaries:check
pnpm typecheck
pnpm test:run
pnpm test:coverage:thresholds
pnpm build
pnpm verify
```

`pnpm verify` は CI の主要ゲートで、Biome、境界チェック、型チェック、ユニット/統合テスト、proto CI、Next.js ビルドをまとめて実行します。

## E2E / VRT

E2E は Playwright で実行します。`E2E_BASE_URL` を指定しない場合、Playwright がモックサーバーと Next.js 開発サーバーを自動起動します。

```bash
pnpm e2e
```

既存の起動済みアプリに対して実行する場合:

```bash
E2E_BASE_URL=http://localhost:3000 pnpm e2e
```

VRT は `ltf-front` のスナップショットを基準画像にします。通常は `ltf-react` の隣に `ltf-front` がある前提です。別の場所にある場合は `LTF_FRONT_ROOT` を指定してください。

```bash
pnpm e2e:visual:baseline:check
pnpm e2e:visual
```

```bash
LTF_FRONT_ROOT=/path/to/ltf-front pnpm e2e:visual
```

VRT 用の開発サーバーは `http://127.0.0.1:3001` で起動します。

## proto / Buf

proto を変更した場合は、生成物とチェックを必ず更新します。

```bash
pnpm proto:format
pnpm proto:generate
pnpm proto:ci
```

`pnpm proto:breaking` は既定で `.git#branch=main,subdir=contracts/grpc` と比較します。比較先を変える場合は `BUF_BREAKING_AGAINST` を指定してください。

```bash
BUF_BREAKING_AGAINST=.git#branch=develop,subdir=contracts/grpc pnpm proto:breaking
```

## Docker 確認

本番コンテナは `next.config.mjs` の `output: "standalone"` を使い、`docker/node/Dockerfile` で `.next/standalone` を起動します。

```bash
docker build \
  -f docker/node/Dockerfile \
  --build-arg CUSTOM_ENV=development \
  -t ltf-react:local \
  .

docker run --rm -p 3000:3000 ltf-react:local
curl -fsS http://127.0.0.1:3000/api/health
```

Docker ビルド中に GitHub Packages の認証が必要な場合:

```bash
docker build \
  -f docker/node/Dockerfile \
  --build-arg CUSTOM_ENV=development \
  --secret id=node_auth_token,env=NODE_AUTH_TOKEN \
  -t ltf-react:local \
  .
```

## 開発時に読む文書

- `doc/migration-conventions.md`: `ltf-front` からの移行規約、設計、テスト方針
- `doc/buf.md`: Buf / proto / 生成 SDK の運用
- `doc/assets.md`: 旧アセットの扱い
- `tools/grpc-mock-server/README.md`: gRPC モックサーバーのスタブ形式

## トラブルシュート

- `pnpm install` が engine mismatch（実行バージョン不一致）で失敗する: Node.js `24.18.0` と pnpm `10.23.0` を使っているか確認する。
- ローカル画面で gRPC が失敗する: `pnpm grpc:mock` が `60051` で起動しているか、`GRPC_MOCK_INSECURE=true` を付けているか確認する。
- E2E のポートが衝突する: 既存の開発サーバー / モックサーバーを止めるか、`E2E_BASE_URL` で起動済みアプリを指定する。
- VRT の基準画像が見つからない: `ltf-front` が隣接ディレクトリにあるか確認し、違う場所なら `LTF_FRONT_ROOT` を指定する。
