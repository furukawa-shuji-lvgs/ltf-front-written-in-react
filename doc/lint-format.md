# lint と format

JavaScript / TypeScript の lint は [oxlint](https://oxc.rs/docs/guide/usage/linter)、整形は [oxfmt](https://oxc.rs/docs/guide/usage/formatter) を使います。設定はルートの `.oxlintrc.json` と `.oxfmtrc.json` です。

## コマンド

| コマンド            | 内容                                             |
| ------------------- | ------------------------------------------------ |
| `pnpm lint`         | 型情報を含む lint。error があると失敗する        |
| `pnpm lint:strict`  | warning も含めて失敗させる                       |
| `pnpm lint:fix`     | oxlint の通常の自動修正を適用する                |
| `pnpm format`       | oxfmt で整形する                                 |
| `pnpm format:check` | ファイルを書き換えずに整形差分を検出する         |
| `pnpm check`        | lint と整形チェックを順に実行する                |
| `pnpm check:fix`    | lint を自動修正し、残存 error がなければ整形する |

`pnpm verify` / `pnpm ci` と GitHub Actions の verify ジョブは `pnpm check` を通ります。自動修正できない error が残る場合は修正後に再実行してください。通常のチェックでは warning は報告のみで、`pnpm lint:strict` では失敗します。

## oxlint の方針

- `correctness` は error、`suspicious` / `pedantic` / `perf` / `style` は warning としてカテゴリ全体を有効にします。
- `restriction` は一律禁止にすると async/await、optional chaining、JSX の文字列なども禁止されるため、console、危険な DOM 操作、循環 import、非 null アサーションなど、個別に選んだルールを有効にします。開発中の `nursery` カテゴリは無効です。
- TypeScript、Unicorn、Oxc、Import、JSDoc、React、React Perf、Next.js、JSX A11y、Promise、Node の組み込みプラグインを使います。React Hooks と React Compiler 系のチェックも React プラグインに含まれます。
- Vitest プラグインはユニット / 統合テストだけに追加し、Playwright の E2E / VRT には適用しません。
- `describe` には対象関数も指定できるようにし、`prefer-describe-function-title` と `valid-title` の設定を揃えます。`it` / `test` の名前は文字列として検証します。
- `options.typeAware: true` と `oxlint-tsgolint` で Promise、危険な型操作、switch の網羅性などを検査します。TypeScript コンパイラのチェックは引き続き `pnpm typecheck` で行います。
- React 19 の JSX runtime に合わせ、React の明示 import は要求しません。Next.js の `Link` / `Image` を認識し、App Router の規約ファイルと設定ファイルでは default export を許可します。`nextjs/no-img-element` は移行前と同じ warning です。
- ロガー / CLI / モックサーバーの console と、設定の読み取り箇所の `process.env` は許可します。
- 個別の named export、型の `interface` / `type` の併用、JSX の三項演算子と props 展開、React の `null` を許可します。型 import は独立した `import type` に統一します。
- ファイル名は既存のコンポーネント / 関数 / Next.js 規約に合わせて PascalCase、camelCase、kebab-case を許可します。
- import の並べ替えは oxfmt に任せます。オブジェクトのキー順は実行時に意味を持つ場合があるため、辞書順を強制しません。
- 無効化コメントは `oxlint-disable-next-line plugin/rule -- 理由` を使います。不要になった無効化コメントは error にします。

ルールはインストール済みバージョンに含まれるものが対象です。`pnpm exec oxlint --rules` で一覧、`pnpm exec oxlint --print-config` で解決済み設定を確認できます。カテゴリ全体を有効化しているため、oxlint の更新時は追加されたルールの影響も確認してください。

### strict の適用範囲

`pnpm lint:strict` は warning / error がともに 0 件で通る状態を維持します。次の用途別設定は `.oxlintrc.json` の `rules` / `overrides` に記載しています。

- JSX の深さは 5、関数は実コード 100 行 / 30 文 / 引数 5 個、ファイルは実コード 500 行を上限にします。テストのケース数と静的なリンク定義は行数制限から除きます。
- 数値の `-1` / `0` / `1` / `2`、配列インデックス、引数の初期値、enum の値などは許可します。テストと VRT の表示データでは数値を直接記述できます。アプリの制約値は名前付き定数にします。
- 自作の表示データと引数は readonly に揃えます。推論されたコールバック引数、外部ライブラリの型、HTML 属性をそのまま受け取るラッパー、生成された gRPC 型のテスト、可変のモック状態には用途別の例外があります。
- React の通常の性能チェックは維持し、テストで作る JSX の props は性能チェックから除きます。Effect の任意の cleanup は `consistent-return` の対象外です。
- `require-await` は型情報を使う TypeScript 版に統一します。Vitest の呼び出し回数 1 回の検証は `toHaveBeenCalledExactlyOnceWith` / `toHaveBeenCalledOnce` 系を使い、競合する `prefer-called-times` を除きます。
- gRPC のコールバック境界、逐次リトライ、ブラウザのフレーム待機、送信完了を待たない処理は、対象ファイルまたは理由付きの行コメントで例外を指定します。CLI とファイル検査テストでは同期 I/O を許可します。
- CLI の JavaScript は JSDoc で型を定義し、JSON 入力は Zod で検証します。`scripts/tsconfig.json` と `tools/tsconfig.json` に Node.js 用の型情報を設定しています。

`--fix-suggestions` は挙動が変わる場合があるため、通常の一括修正コマンドには含めません。適用する場合は差分を確認し、型チェック・テスト・ビルドも実行してください。

## oxfmt の方針

2 スペース、100 桁、LF、末尾改行、ダブルクォート、セミコロン、trailing comma、アロー関数の括弧、属性ごとの改行を明示します。埋め込み言語と JSDoc の整形、import と package.json のソートも有効です。

import は型、外部パッケージ、内部 alias、相対パスなどでグループ化します。`@/`、`@features/`、`@shared/`、`@generated/` は内部 alias として扱います。副作用 import の実行順を保持するため、`sortSideEffects` は無効です。Tailwind CSS はこのプロジェクトで使っていないため、Tailwind 専用ソートは設定していません。

生成コード、Next.js の生成型、ビルド / テスト成果物、ブラウザー監視スクリプト、エージェント管理用の `.agents` / `.codex` は両ツールの対象外です。pnpm のロックファイルは整形しません。CSS / SCSS / JSON / HTML / Markdown / YAML などは oxfmt の対応範囲で整形しますが、oxlint の lint 対象は JavaScript / TypeScript です。Protobuf は引き続き Buf で検査・整形します。
