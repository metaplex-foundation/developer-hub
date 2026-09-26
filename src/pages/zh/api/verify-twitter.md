---
title: 验证 Twitter
metaTitle: Metaplex API - 验证 Twitter | REST API | Metaplex
description: 将 Twitter OAuth 访问令牌兑换为验证令牌，用于在注册发行时证明 Twitter 账户的所有权。
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

将 Twitter（X）OAuth 访问令牌兑换为短期有效的验证令牌，用于证明 Twitter 账户的所有权。将该令牌传给[注册发行](/zh/api/register)，即可将发行的 Twitter 链接标记为已验证。 {% .lead %}

## Summary

- 对照 X API 验证用户提供的 Twitter OAuth 2.0 访问令牌
- 返回账户的用户名和已签名的验证令牌
- 该令牌由 `POST /launches/register` 通过其可选的 `twitterVerificationToken` 字段消费

## Quick Reference

| 项目 | 值 |
|------|-------|
| **方法** | `POST` |
| **路径** | `/twitter/verify` |
| **认证** | 无需（Twitter 访问令牌即为凭证） |
| **响应** | 用户名 + 验证令牌 |

## 端点

```
POST /twitter/verify
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `accessToken` | `string` | 是 | 由您的应用程序获取的 Twitter OAuth 2.0 用户访问令牌（必须已授权 `users.read`）。 |

## 请求示例

```bash
curl -X POST "https://api.metaplex.com/v1/twitter/verify" \
  -H "Content-Type: application/json" \
  -d '{ "accessToken": "<twitter-oauth-access-token>" }'
```

## 响应

```json
{
  "success": true,
  "username": "mytoken",
  "token": "<verification-token>"
}
```

调用[注册发行](/zh/api/register)时，将 `token` 作为 `twitterVerificationToken` 传入。API 会将令牌中的用户名与 `launch.externalLinks.twitter` 中的账号名进行比对，匹配时将该链接标记为已验证。

## 错误

| 状态码 | 响应体 | 含义 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "accessToken is required" }` | `accessToken` 缺失或为空。 |
| `401` | `{ "success": false, "error": "Could not verify Twitter account" }` | X API 拒绝了该访问令牌。 |
| `502` | `{ "success": false, "error": "Could not retrieve Twitter username" }` | X API 的响应中没有用户名。 |

## Notes

- 获取 OAuth 访问令牌（用户授权流程）是您的应用程序的责任；此端点仅验证令牌并签发验证令牌。
- 验证是可选的 — 未验证的发行也能成功注册，只是其 Twitter 链接会保持未验证状态。
