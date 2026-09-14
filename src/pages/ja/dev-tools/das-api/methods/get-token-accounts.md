---
title: トークンアカウントの取得
metaTitle: トークンアカウントの取得 | DAS API
description: 所有者またはミントでトークンアカウントのリストを取得
tableOfContents: false
---

所有者アドレス、ミントアドレス、または両方でフィルタリングされたトークンアカウントのリストを返します。ウォレットに関連付けられたすべてのトークンアカウント、または特定のトークンを保持するすべてのアカウントを見つけるのに便利です。

`ownerAddress` または `mintAddress` の少なくとも一方が必要です。

## パラメータ

| 名前           | 必須 | 説明                                          |
| -------------- | :------: | ---------------------------------------------------- |
| `ownerAddress` |    (`mintAddress`が提供されていない場合のみ必須)    | 所有者アドレスでフィルタリング。                             |
| `mintAddress`  |    (`ownerAddress`が提供されていない場合のみ必須)    | ミントアドレスでフィルタリング。                              |
| `cursor`       |         | ページネーション用のカーソル。                               |
| `page`         |         | ページネーション用のページ番号。                          |
| `limit`        |         | 返すトークンアカウントの最大数。          |
| `before`       |         | このカーソルより前のアカウントを返す。                  |
| `after`        |         | このカーソルより後のアカウントを返す。                   |
| `options`      |         | クエリの表示オプション。`displayOptions` としても受け付けます。 |
| `options.showZeroBalance` | | 残高ゼロのアカウントを結果に含めるかどうか。 |
| `options.showFungible` | | APIで受け付けられますが、このメソッドでは将来用に予約されています。 |
| `options.showCollectionMetadata` | | APIで受け付けられますが、このメソッドでは将来用に予約されています。 |
| `options.showUnverifiedCollections` | | APIで受け付けられますが、このメソッドでは将来用に予約されています。 |
| `options.showInscription` | | APIで受け付けられますが、このメソッドでは将来用に予約されています。 |

## レスポンス

レスポンスには以下が含まれます:

- `token_accounts` - 以下を含むトークンアカウントオブジェクトの配列:
  - `address` - トークンアカウントのアドレス
  - `amount` - アカウント内のトークン残高
  - `mint` - トークンのミントアドレス
  - `owner` - アカウントの所有者アドレス
  - `delegate` - デリゲートアドレス(存在する場合)
  - `delegated_amount` - デリゲートに委任された量
  - `frozen` - アカウントが凍結されているかどうか
  - `close_authority` - クローズ権限アドレス(存在する場合)
  - `extensions` - トークン拡張データ
- `errors` - 処理中に発生したエラーの配列
- `total` - 現在のページで返されたトークンアカウント数
- ページネーションフィールド: `cursor`, `page`, `limit`, `before`, `after`

一致するアカウントがない所有者またはミントの場合、エラーではなく空の `token_accounts` 配列が返されます。

## プレイグラウンド

{% apiRenderer method="getTokenAccounts" /%}
