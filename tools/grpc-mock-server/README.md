# ltf gRPC モックサーバー

`ltf-react` のローカル開発と E2E から使う gRPC モックサーバーです。

## 起動

```bash
# ltf-react 直下から
node tools/grpc-mock-server/server.mjs

# ltf-react から
pnpm grpc:mock
```

デフォルトでは `0.0.0.0:60051` で listen します。`env/local.ts` はすでに `GRPC_HOST: "127.0.0.1:60051"` です。

モックサーバーは insecure gRPC なので、アプリ側は `CUSTOM_ENV=local` に加えて `GRPC_MOCK_INSECURE=true` を付けて起動してください。`GRPC_MOCK_INSECURE` を付けない `CUSTOM_ENV=local` は、従来どおり STG backend 接続向けの SSL 設定です。

```bash
cd ltf-react
CUSTOM_ENV=local GRPC_MOCK_INSECURE=true pnpm dev
```

## オプション

```bash
node tools/grpc-mock-server/server.mjs \
  --protoDir ./contracts/grpc/proto \
  --stubDir ./tools/grpc-mock-server/stubs \
  --depsDir . \
  --port 60051 \
  --verbose
```

- `protoDir`: proto のルートディレクトリ
- `stubDir`: JSON stub を置くディレクトリ
- `depsDir`: `@grpc/grpc-js` と `@grpc/proto-loader` を解決するアプリディレクトリ
- `port`: gRPC listen port
- `verbose`: request log を出す

## stub 形式

ファイル名は service 名に合わせます。

- `SharedSeo.json`
- `ProjectSearch.json`
- `shared_seo.json` も可

キーは RPC 名です。`GetTdkh` / `getTdkh` のどちらでも解決します。

```json
{
    "getTdkh": {
        "tdkh": {
            "key": "mock",
            "title": "VRT Mock",
            "description": "VRT用のレスポンスです。",
            "keywords": "VRT,Mock",
            "h1": "VRT Mock"
        },
        "result": "Success"
    }
}
```

レスポンスは `camelCase` / `snake_case` のどちらでも書けます。モックサーバー側で `camelCase` に正規化します。

未定義 RPC は proto の response 型から VRT 向けの非空データを自動生成します。

- repeated field は 3 件返します
- `result` は `Success` 相当の `1` を返します
- `errors` / `error` / `failed` は成功レスポンスとして省略します
- `google.protobuf.*Value` は `{ "value": ... }` の形で返します
- text / url / image / price / count などの field 名は画面が空になりにくいサンプル値に寄せます

画面固有の見え方を安定させたい RPC だけ `stubs/*.json` に具体値を足してください。stub がある場合は自動生成より stub が優先されます。

`__default.json` には `Service.Method` または `methodName` 単位の上書きだけを書けます。global default を置くと全 RPC が同じ薄いレスポンスになり、VRT 用データが不足しやすいため使いません。

エラーを返したい場合:

```json
{
    "getTdkh": {
        "__isError": true,
        "code": 14,
        "message": "UNAVAILABLE"
    }
}
```
