# アセット移行

ltf-react が管理する画像アセットは、すべて `public/images` 配下で完結させます。

## 配置

- Nuxt 版の `app/assets/images/foo/bar.webp` は `ltf-react/public/images/foo/bar.webp` へ置く。
- 外部アセットホストで管理されていた ltf-react 固有画像も `public/images` へ取り込む。
- コンテンツ本文など、外部サービスが所有する画像を扱う場合は ltf-react 管理アセットと分け、必要なホストを個別に設計する。

## 参照

`src/shared/lib/image.ts` は ltf-react 管理アセットの短いパスを公開パスへ変換します。

- `imageUrl("/common/logo_lt.svg")` は `/images/common/logo_lt.svg` を返す。
- `/images/...` は既に公開パスなのでそのまま返す。
- `https://...` / `http://...` / `data:...` は、外部またはインライン画像としてそのまま返す。

定数やコンポーネント内の ltf-react 管理アセットは、`/common/logo_lt.svg` のように `public/images` からの相対パスで持ち、表示直前に `imageUrl` を通します。OGP など Next Metadata で直接公開パスを指定する場合は `/images/...` を使います。

## 検証

`src/shared/lib/localAssets.test.ts` が、`src` 配下にある ltf-react 管理画像の参照先がすべて `public/images` に存在することを検証します。画像を追加・移植した場合は、参照リテラルと実ファイルを同じ変更に含めます。

旧環境の画像ホストへフォールバックする環境変数は使いません。VRT と CI は、ローカルに取り込まれた実アセットだけを前提にします。
