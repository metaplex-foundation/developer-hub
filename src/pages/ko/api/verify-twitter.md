---
title: Twitter 인증
metaTitle: Metaplex API - Twitter 인증 | REST API | Metaplex
description: Twitter OAuth 액세스 토큰을 런칭 등록 시 Twitter 계정 소유권을 증명하는 인증 토큰으로 교환합니다.
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

Twitter(X) OAuth 액세스 토큰을 Twitter 계정 소유권을 증명하는 단기 유효 인증 토큰으로 교환합니다. 이 토큰을 [Register Launch](/ko/api/register)에 전달하면 런칭의 Twitter 링크가 인증됨으로 표시됩니다. {% .lead %}

## Summary

- 사용자가 제공한 Twitter OAuth 2.0 액세스 토큰을 X API를 통해 검증
- 계정의 사용자 이름과 서명된 인증 토큰 반환
- 토큰은 `POST /launches/register`의 선택적 `twitterVerificationToken` 필드를 통해 사용됨

## Quick Reference

| 항목 | 값 |
|------|-------|
| **메서드** | `POST` |
| **경로** | `/twitter/verify` |
| **인증** | 불필요 (Twitter 액세스 토큰이 자격 증명 역할) |
| **응답** | 사용자 이름 + 인증 토큰 |

## 엔드포인트

```
POST /twitter/verify
```

## 요청 본문

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|-------------|
| `accessToken` | `string` | 예 | 애플리케이션이 획득한 Twitter OAuth 2.0 사용자 액세스 토큰 (`users.read` 권한이 부여되어 있어야 함) |

## 요청 예시

```bash
curl -X POST "https://api.metaplex.com/v1/twitter/verify" \
  -H "Content-Type: application/json" \
  -d '{ "accessToken": "<twitter-oauth-access-token>" }'
```

## 응답

```json
{
  "success": true,
  "username": "mytoken",
  "token": "<verification-token>"
}
```

[Register Launch](/ko/api/register)를 호출할 때 `token`을 `twitterVerificationToken`으로 전달하세요. API는 토큰의 사용자 이름을 `launch.externalLinks.twitter`의 핸들과 비교하여 일치하면 링크를 인증됨으로 표시합니다.

## 오류

| 상태 | 본문 | 의미 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "accessToken is required" }` | `accessToken`이 누락되었거나 비어 있습니다. |
| `401` | `{ "success": false, "error": "Could not verify Twitter account" }` | X API가 액세스 토큰을 거부했습니다. |
| `502` | `{ "success": false, "error": "Could not retrieve Twitter username" }` | X API가 사용자 이름 없이 응답했습니다. |

## Notes

- OAuth 액세스 토큰 획득(사용자 동의 플로우)은 애플리케이션의 책임입니다. 이 엔드포인트는 토큰을 검증하고 인증 토큰을 발급하기만 합니다.
- 인증은 선택 사항입니다. 인증 없이도 런칭은 정상적으로 등록되며, Twitter 링크가 미인증 상태로 남을 뿐입니다.
