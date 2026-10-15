---
title: Twitter 検証
metaTitle: Metaplex API - Twitter 検証 | REST API | Metaplex
description: Twitter OAuth アクセストークンを、ローンチ登録時に Twitter アカウントの所有権を証明する検証トークンと交換します。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Genesis API
  - Twitter verification
  - social verification
  - launch registration
about:
  - API endpoint
  - Social verification
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Twitter（X）の OAuth アクセストークンを、Twitter アカウントの所有権を証明する短期有効の検証トークンと交換します。このトークンを[ローンチの登録](/ja/api/register)に渡すと、ローンチの Twitter リンクが検証済みとしてマークされます。 {% .lead %}

## Summary

- ユーザーが提供した Twitter OAuth 2.0 アクセストークンを X API に対して検証します
- アカウントのユーザー名と署名付き検証トークンを返します
- トークンは `POST /launches/register` のオプションフィールド `twitterVerificationToken` で消費されます

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `POST` |
| **パス** | `/twitter/verify` |
| **認証** | 不要（Twitter アクセストークンがクレデンシャル） |
| **レスポンス** | ユーザー名 + 検証トークン |

## エンドポイント

```
POST /twitter/verify
```

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `accessToken` | `string` | はい | アプリケーションが取得した Twitter OAuth 2.0 ユーザーアクセストークン（`users.read` の認可が必要）。 |

## リクエスト例

```bash
curl -X POST "https://api.metaplex.com/v1/twitter/verify" \
  -H "Content-Type: application/json" \
  -d '{ "accessToken": "<twitter-oauth-access-token>" }'
```

## レスポンス

```json
{
  "success": true,
  "username": "mytoken",
  "token": "<verification-token>"
}
```

[ローンチの登録](/ja/api/register)を呼び出す際に、`token` を `twitterVerificationToken` として渡します。API はトークンのユーザー名を `launch.externalLinks.twitter` のハンドルと比較し、一致した場合にリンクを検証済みとしてマークします。

## エラー

| ステータス | ボディ | 意味 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "accessToken is required" }` | `accessToken` が欠落しているか空。 |
| `401` | `{ "success": false, "error": "Could not verify Twitter account" }` | X API がアクセストークンを拒否した。 |
| `502` | `{ "success": false, "error": "Could not retrieve Twitter username" }` | X API がユーザー名なしで応答した。 |

## Notes

- OAuth アクセストークンの取得（ユーザーの同意フロー）はアプリケーション側の責任です。このエンドポイントはそれを検証し、検証トークンを発行するだけです。
- 検証はオプションです — 検証なしでもローンチの登録は成功し、Twitter リンクが未検証のままになるだけです。
