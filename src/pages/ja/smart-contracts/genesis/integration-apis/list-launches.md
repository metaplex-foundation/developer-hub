---
title: ローンチ一覧
metaTitle: Genesis - ローンチ一覧 | REST API | Metaplex
description: アクティブおよび今後の Genesis ローンチリスティングを取得します。メタデータ付きのリストを返します。
method: GET
created: '01-15-2025'
updated: '02-26-2026'
keywords:
  - Genesis API
  - listings
  - active launches
  - launch directory
about:
  - API endpoint
  - Launch listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

アクティブおよび今後の Genesis ローンチリスティングを取得します。メタデータ、トークン情報、ソーシャルリンク付きのリストを返します。 {% .lead %}

## Summary

ステータスやスポットライトのオプションフィルタ付きで全 Genesis ローンチを一覧表示します。最新のアクティビティ順にソートされた `LaunchData` オブジェクトの配列を返します。

- `status`（`upcoming`、`live`、`graduated`）および/または `spotlight`（`true`、`false`）でフィルタ可能
- 結果は `lastActivityAt` の降順でソートされます
- 各エントリにはローンチ詳細、ベーストークンメタデータ、ソーシャルリンクが含まれます
- メインネット（デフォルト）およびデブネットを `network` クエリパラメータでサポート

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `GET` |
| **パス** | `/launches` |
| **認証** | 不要 |
| **レスポンス** | `LaunchData[]` |
| **ページネーション** | なし |

## エンドポイント

```
GET /launches
```

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `network` | `string` | いいえ | クエリするネットワーク。デフォルト：`solana-mainnet`。devnet の場合は `solana-devnet` を使用。 |
| `status` | `string` | いいえ | ステータスでフィルタ: `upcoming`, `live`, `graduated`。デフォルト: 全件返却。 |
| `spotlight` | `string` | いいえ | スポットライトでフィルタ: `true` または `false`。デフォルト: 全件返却。 |

## リクエスト例

```bash
curl "https://api.metaplex.com/v1/launches?status=live"
```

## レスポンス

結果は `lastActivityAt` の降順でソートされます。

```json
{
  "data": [
    {
      "launch": {
        "launchPage": "https://example.com/launch/mytoken",
        "mechanic": "launchpoolV2",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "spotlight": false,
        "startTime": "2026-01-15T14:00:00.000Z",
        "endTime": "2026-01-15T18:00:00.000Z",
        "status": "graduated",
        "heroUrl": "launches/abc123/hero.webp",
        "graduatedAt": "2026-01-15T18:05:00.000Z",
        "lastActivityAt": "2026-01-15T17:45:00.000Z",
        "type": "launchpool"
      },
      "baseToken": {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "name": "My Token",
        "symbol": "MTK",
        "image": "https://example.com/token-image.png",
        "description": "A community-driven token for the example ecosystem."
      },
      "website": "https://example.com",
      "socials": {
        "x": "https://x.com/mytoken",
        "telegram": "https://t.me/mytoken",
        "discord": "https://discord.gg/mytoken"
      }
    }
  ]
}
```

## レスポンス型

[共有型](/smart-contracts/genesis/integration-apis#shared-types)で `Launch`、`BaseToken`、`Socials` の定義を参照してください。

### TypeScript

```ts
interface LaunchData {
  launch: Launch;
  baseToken: BaseToken;
  website: string;
  socials: Socials;
}

interface LaunchesResponse {
  data: LaunchData[];
}
```

### Rust

```rust
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchesResponse {
    pub data: Vec<LaunchData>,
}
```

## 使用例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches?status=live"
);
const { data }: LaunchesResponse = await response.json();
console.log(`${data.length} launches`);
data.forEach((entry) => {
  console.log(entry.baseToken.name, entry.launch.status);
});
```

### Rust

```rust
let response: LaunchesResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches?status=live"
)
.await?
.json()
.await?;

println!("{} launches", response.data.len());
```

## Notes

- 結果はページネーションされません。エンドポイントは一致するすべてのローンチを単一のレスポンスで返します。
- `status` フィルタは `upcoming`、`live`、`graduated` を受け付けます。省略するとすべてのステータスを返します。
- `mechanic` フィールドは割り当てメカニズム（例：`launchpoolV2`、`presaleV2`）を示します。`type` フィールドはローンチの基盤メカニズム（`launchpool`、`presale`）を示します。

