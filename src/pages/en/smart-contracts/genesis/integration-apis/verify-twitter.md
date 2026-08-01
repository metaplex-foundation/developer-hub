---
title: Verify Twitter
metaTitle: Genesis - Verify Twitter | REST API | Metaplex
description: Exchange a Twitter OAuth access token for a verification token that proves ownership of a Twitter account when registering a launch.
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

Exchange a Twitter (X) OAuth access token for a short-lived verification token that proves ownership of a Twitter account. Pass the token to [Register Launch](/smart-contracts/genesis/integration-apis/register) to have the launch's Twitter link marked as verified. {% .lead %}

## Summary

- Verifies a user-supplied Twitter OAuth 2.0 access token against the X API
- Returns the account's username and a signed verification token
- The token is consumed by `POST /launches/register` via its optional `twitterVerificationToken` field

## Quick Reference

| Item | Value |
|------|-------|
| **Method** | `POST` |
| **Path** | `/twitter/verify` |
| **Auth** | None (the Twitter access token is the credential) |
| **Response** | Username + verification token |

## Endpoint

```
POST /twitter/verify
```

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accessToken` | `string` | Yes | A Twitter OAuth 2.0 user access token obtained by your application (must be authorized for `users.read`). |

## Example Request

```bash
curl -X POST "https://api.metaplex.com/v1/twitter/verify" \
  -H "Content-Type: application/json" \
  -d '{ "accessToken": "<twitter-oauth-access-token>" }'
```

## Response

```json
{
  "success": true,
  "username": "mytoken",
  "token": "<verification-token>"
}
```

Pass `token` as `twitterVerificationToken` when calling [Register Launch](/smart-contracts/genesis/integration-apis/register). The API compares the token's username against the handle in `launch.externalLinks.twitter` and marks the link verified on match.

## Errors

| Status | Body | Meaning |
|--------|------|---------|
| `400` | `{ "success": false, "error": "accessToken is required" }` | Missing or empty `accessToken`. |
| `401` | `{ "success": false, "error": "Could not verify Twitter account" }` | The X API rejected the access token. |
| `502` | `{ "success": false, "error": "Could not retrieve Twitter username" }` | The X API responded without a username. |

## Notes

- Obtaining the OAuth access token (the user consent flow) is your application's responsibility; this endpoint only validates it and issues the verification token.
- Verification is optional — launches register successfully without it, their Twitter link is simply left unverified.
