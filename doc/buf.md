# Buf ワークフロー

`ltf-react` では gRPC 契約を `contracts/grpc/` に置きます。

- `contracts/grpc/proto/`: バックエンド管理の Protobuf ソース。アプリが参照する。
- `contracts/grpc/generated/`: `protobuf-ts` の生成結果。`@generated/*` 経由で import する。
- `contracts/grpc/buf.yaml`: Buf v2 workspace の設定。
- `contracts/grpc/buf.gen.yaml`: ローカル TypeScript 生成の設定。

## ローカルコマンド

- `pnpm proto:format`: `buf format -w` で Protobuf ファイルを書き換える。
- `pnpm proto:format:check`: Protobuf のフォーマット結果が `buf format` と異なる場合に失敗する。
- `pnpm proto:build`: Protobuf ソースを Buf イメージとしてコンパイルする。
- `pnpm proto:lint`: Buf の lint rule を実行する。
- `pnpm proto:breaking`: `BUF_BREAKING_AGAINST` または `.git#branch=main` とスキーマ互換性を比較する。
- `pnpm proto:generate`: `protobuf-ts` で `contracts/grpc/generated/` を再生成する。
- `pnpm proto:deps:update`: 外部 `deps` を追加した場合に `buf.lock` を更新する。
- `pnpm proto:deps:prune`: `buf.lock` から未使用 entry を削除する。
- `pnpm proto:ci`: フォーマット、ビルド、lint、breaking、生成のローカル CI ゲートを実行する。
- `pnpm proto:push`: named module（名前付きモジュール）を BSR へ push する。

## 現在の制約

バックエンド管理の proto ファイルはそのまま利用します。一部の package 名、ディレクトリ構成、service 名、enum 名はまだ `STANDARD` を満たしていないため、`contracts/grpc/buf.yaml` では legacy rule の互換例外を残しています。新しい proto 変更では、例外を増やさないでください。

現時点では外部 Buf モジュールへの依存はありません。import が `buf.build/googleapis/googleapis` のような BSR モジュールへ移る場合は、`contracts/grpc/buf.yaml` の `deps` に追加し、`pnpm proto:deps:update` を実行して `contracts/grpc/buf.lock` を commit してください。

アプリは既存の `protobuf-ts` gRPC client API を import しているため、コード生成は意図的にローカルの `@protobuf-ts/plugin` を使います。リモートプラグインへ移すのは、生成 TypeScript API の移行を計画したタイミングに限定してください。

## CI

GitHub Actions では `input: contracts/grpc` の `bufbuild/buf-action@v1` と Buf CLI `1.71.0` を使います。pull request ではビルド、lint、フォーマット、breaking check（破壊的変更チェック）を実行します。push 時は `BUF_TOKEN` が設定されていれば named module（名前付きモジュール）を BSR へ push できます。
