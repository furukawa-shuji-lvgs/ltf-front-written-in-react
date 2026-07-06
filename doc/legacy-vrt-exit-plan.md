# legacyVrt 廃止計画

`src/features/legacyVrt` は Nuxt 版との VRT 差分を小さくするための移行ブリッジです。恒久的な共通 UI ではないため、新規機能から直接参照しません。

## 現在許可している利用箇所

- 各 feature の `components/*Page.tsx`
- 各 feature の `components/*LegacyBody.tsx`

この制約は `pnpm boundaries:check` で検査します。上記以外で `@features/legacyVrt` を import すると CI で失敗します。

## 削除順序

1. `Page.tsx` から layout shell だけを feature 側の実装へ置き換える。
2. `LegacyBody.tsx` の section/card/list を feature 内 component へ移す。
3. 置き換えたページごとに E2E と VRT を通す。
4. 対象 feature から `legacyVrt` import が消えたら、該当 fixture/profile を削除する。
5. 全 feature から参照が消えた後に `src/features/legacyVrt` と境界チェックの legacy 例外を削除する。

## 完了条件

- `rg "@features/legacyVrt" src/features` が 0 件になる。
- `pnpm verify` と `pnpm e2e:visual` が通る。
- `scripts/check-boundaries.mjs` から `isLegacyVrtBridgeImporter` の例外を削除できる。
