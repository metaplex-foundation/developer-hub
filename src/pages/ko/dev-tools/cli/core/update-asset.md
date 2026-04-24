---
title: 자산 업데이트
metaTitle: 자산 업데이트 | Metaplex CLI
description: Metaplex CLI의 mplx core asset update 명령어를 사용하여 MPL Core 자산의 메타데이터, 이름, URI, 이미지 또는 컬렉션 멤버십을 업데이트합니다.
keywords:
  - mplx cli
  - core asset update
  - MPL Core
  - update NFT
  - metaplex cli update
  - core update
  - collection management
  - add to collection
  - remove from collection
  - move collection
about:
  - MPL Core Asset update
  - Metaplex CLI
  - collection management
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '04-17-2026'
---

## Summary

`mplx core asset update` 명령어는 [MPL Core 자산](/core)의 온체인 이름, URI, 이미지, 오프체인 메타데이터 또는 [컬렉션](/core/collections) 멤버십을 수정합니다.

- 메타데이터 필드를 개별적으로 (`--name`, `--uri`) 또는 JSON 파일 (`--offchain`)로 업데이트
- `--image`로 새 이미지 업로드 및 할당
- 자산을 컬렉션에 추가, 컬렉션 간 이동 또는 컬렉션에서 제거
- 호출자는 자산의 현재 [업데이트 권한](/core/update)이어야 합니다 (컬렉션 자산의 경우 컬렉션의 업데이트 권한)

## Basic Usage

```bash {% title="Update an asset" %}
mplx core asset update <assetId> [options]
```

최소 하나의 업데이트 플래그를 제공해야 합니다. 여러 플래그를 하나의 명령어에 결합할 수 있습니다. 예를 들어, 이름 업데이트와 컬렉션 추가를 동시에 수행할 수 있습니다.

## Update Options

다음 플래그는 `mplx core asset update` 명령어가 자산에서 수정하는 내용을 제어합니다.

| Flag | Description |
|------|-------------|
| `--name <string>` | 자산의 새 이름 (`--offchain`과 함께 사용 불가) |
| `--uri <string>` | 자산 메타데이터의 새 URI (`--offchain`과 함께 사용 불가) |
| `--image <path>` | 업로드할 새 이미지 파일 경로 |
| `--offchain <path>` | JSON 메타데이터 파일 경로 (`--name` 또는 `--uri`와 함께 사용 불가) |
| `--collection <collectionId>` | 자산을 컬렉션에 추가하거나 다른 컬렉션으로 이동 (`--remove-collection`과 함께 사용 불가) |
| `--remove-collection` | 현재 컬렉션에서 자산 제거 (`--collection`과 함께 사용 불가) |

## Global Flags

이 플래그는 모든 `mplx core` 명령어에 적용되며 CLI 런타임을 구성합니다.

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | 설정 파일 경로. 기본값은 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 키페어 파일 또는 렛저 경로 (예: `usb://ledger?key=0`) |
| `-p, --payer <value>` | 지불자 키페어 파일 또는 렛저 경로 |
| `-r, --rpc <value>` | 클러스터의 RPC URL |
| `--commitment <option>` | 커밋먼트 레벨: `processed`, `confirmed` 또는 `finalized` |
| `--json` | 출력을 JSON 형식으로 지정 |
| `--log-level <option>` | 로깅 레벨: `debug`, `warn`, `error`, `info` 또는 `trace` (기본값: `info`) |

## Update Metadata

자산의 이름, URI, 이미지 또는 오프체인 메타데이터를 업데이트합니다. `--offchain` 플래그는 로컬 JSON 파일을 읽어 그 `name` 필드에서 온체인 이름을 동기화합니다. `--image` 플래그는 파일을 업로드하고 메타데이터의 이미지 URI를 업데이트합니다.

{% code-tabs-imported from="core/update-asset" frameworks="cli" /%}

## Manage Collection Membership

`--collection` 및 `--remove-collection` 플래그는 자산이 속한 [컬렉션](/core/collections)을 제어합니다. 이러한 플래그는 단독으로 사용하거나 메타데이터 업데이트 플래그와 결합하여 단일 트랜잭션에서 사용할 수 있습니다.

### Add an Asset to a Collection

`--collection` 플래그는 독립된 자산을 컬렉션에 할당합니다. 자산의 [업데이트 권한](/core/update)이 주소에서 컬렉션으로 변경됩니다.

{% code-tabs-imported from="core/add-to-collection" frameworks="cli" /%}

Output:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
자산을 컬렉션에 추가하려면 자산과 대상 컬렉션 모두의 업데이트 권한이 있어야 합니다.
{% /callout %}

### Move an Asset to a Different Collection

이미 컬렉션에 속해 있는 자산에 동일한 `--collection` 플래그를 사용합니다. CLI는 기존 컬렉션을 감지하고 자산을 새 컬렉션으로 이동합니다.

{% code-tabs-imported from="core/change-collection" frameworks="cli" /%}

Output:

```
✔ Asset moved to new collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
자산의 현재 컬렉션과 대상 컬렉션 모두의 업데이트 권한이 있어야 합니다.
{% /callout %}

### Remove an Asset from a Collection

`--remove-collection` 플래그는 자산을 현재 컬렉션에서 분리합니다. 자산의 업데이트 권한은 컬렉션에서 서명자의 주소로 되돌아갑니다.

{% code-tabs-imported from="core/remove-from-collection" frameworks="cli" /%}

Output:

```
✔ Asset removed from collection (Tx: <transactionSignature>)
```

컬렉션에 속하지 않은 자산에 대해 `--remove-collection`을 실행하면 오류가 발생합니다:

```
✖ Asset is not in a collection
  Error: Cannot remove from collection: asset does not belong to a collection
```

{% callout type="note" %}
컬렉션 플래그는 메타데이터 플래그와 결합하여 단일 트랜잭션에서 사용할 수 있습니다. 예: `mplx core asset update <assetId> --name "New Name" --collection <collectionId>`.
{% /callout %}

## Output

메타데이터 업데이트가 성공하면 명령어가 다음을 표시합니다:

```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

컬렉션 전용 작업의 경우 출력은 단일 확인 라인입니다:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

구조화된 출력을 위해 `--json`을 사용합니다:

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## Quick Reference

`mplx core asset update`의 명령어 세부정보, 범위 및 소스 위치를 한눈에 확인합니다.

| Item | Value |
|------|-------|
| Update command | `mplx core asset update` |
| Add-to-collection alias | `mplx core collection add` (컬렉션 추가 케이스에만 해당; 이동, 제거 또는 메타데이터 전용 업데이트에는 적용되지 않음) |
| Applies to | [MPL Core Assets](/core)만 해당 — Token Metadata NFT는 해당 없음 |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- 최소 하나의 업데이트 플래그를 제공해야 합니다: `--name`, `--uri`, `--image`, `--offchain`, `--collection` 또는 `--remove-collection`
- `--name` 및 `--uri` 플래그는 `--offchain`과 함께 사용할 수 없습니다
- `--collection` 및 `--remove-collection` 플래그는 상호 배타적입니다
- `--offchain`을 사용할 때 JSON 메타데이터 파일은 유효한 `name` 필드를 포함해야 합니다 — 온체인 이름이 이로부터 동기화됩니다
- `--image` 플래그는 파일을 업로드하고 메타데이터의 이미지 URI를 자동으로 업데이트합니다
- 컬렉션 작업은 자산의 [업데이트 권한](/core/update)을 변경합니다: 컬렉션에 추가하면 컬렉션 주소로 설정되고, 제거하면 서명자의 지갑 주소로 되돌아갑니다
- 호출자는 모든 업데이트를 수행하기 위해 자산의 업데이트 권한 (또는 컬렉션 자산의 경우 컬렉션의 업데이트 권한)이어야 합니다
- 이 명령어는 [MPL Core Assets](/core)에만 적용됩니다 — Token Metadata NFT의 경우 다른 업데이트 명령어를 사용하세요
