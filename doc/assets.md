# アセット移行

`src/shared/lib/image.ts` は、Nuxt 版のアセット移行中でも旧画像パスの解決結果が安定するようにしています。

- `https://...` の URL はそのまま使う。
- 相対パスの旧画像は、`LEGACY_HOST` が設定されている場合に `${LEGACY_HOST}/images/...` へ解決する。
- `LEGACY_HOST` がないローカル環境と CI では、決定的な SVG data URI の fallback を返す。これにより、VRT が壊れた `/images/...` リクエストに依存しない。

アセットをこのリポジトリへ移す場合、静的公開ファイルは `public/` を優先し、本番で管理される画像ホストがあるものはそのホストを使う。相対パスの旧画像をすべて移行し終えたら、`env` から `LEGACY_HOST` を削除し、fallback 分岐も削除する。
