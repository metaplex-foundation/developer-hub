---
title: 메서드
metaTitle: 메서드 | DAS API
description: Metaplex DAS API 클라이언트를 위한 호출 가능한 API 메서드입니다.
keywords:
  - DAS API methods
  - getAsset
  - getAssets
  - searchAssets
  - digital asset standard
  - Metaplex
about:
  - DAS API
  - Digital Asset Standard
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-13-2026'
---

## Summary

DAS API 메서드 색인은 Core, Token Metadata, 압축 NFT 표준에 걸쳐 Solana 디지털 자산을 가져오고, 증명하고, 검색하는 모든 JSON-RPC 엔드포인트를 나열합니다.

- **단일 및 일괄 읽기** — `getAsset`, `getAssets`, 머클 증명, 트랜잭션 서명
- **필터 조회** — 소유자, 생성자, 권한, 그룹, 에디션, 토큰 계정별
- **에이전트 검색** — `searchAssets`는 인덱싱된 Core 행에 대한 `isAgent`, `agentToken`, `assetSigner` 필터를 지원합니다

## Quick Reference

| 메서드 | 설명 |
|--------|-------------|
| [`getAsset`](/ko/dev-tools/das-api/methods/get-asset) | 압축 또는 표준 자산 1건의 메타데이터와 소유자를 반환합니다. `MplCoreAsset` 응답에는 에이전트 필드(`is_agent`, `asset_signer`, `agent_token`)가 포함될 수 있으며, 컬렉션과 그룹 응답에는 `is_agent: false`가 포함될 수 있습니다. |
| [`getAssets`](/ko/dev-tools/das-api/methods/get-assets) | 여러 압축 또는 표준 자산을 반환합니다. 각 항목은 `getAsset`과 동일한 자산 형태를 사용하며, `MplCoreAsset` 행에는 에이전트 필드가 포함될 수 있고 컬렉션과 그룹 행에는 `is_agent: false`가 포함될 수도 있습니다. |
| [`getAssetProof`](/ko/dev-tools/das-api/methods/get-asset-proof) | 압축 자산의 머클 트리 증명을 반환합니다. |
| [`getAssetProofs`](/ko/dev-tools/das-api/methods/get-asset-proofs) | 여러 압축 자산의 머클 트리 증명을 반환합니다. |
| [`getAssetSignatures`](/ko/dev-tools/das-api/methods/get-asset-signatures) | 압축 자산의 트랜잭션 서명을 반환합니다. |
| [`getAssetsByAuthority`](/ko/dev-tools/das-api/methods/get-assets-by-authority) | 권한 주소에 연결된 자산을 반환합니다. |
| [`getAssetsByCreator`](/ko/dev-tools/das-api/methods/get-assets-by-creator) | 생성자 주소에 연결된 자산을 반환합니다. |
| [`getAssetsByGroup`](/ko/dev-tools/das-api/methods/get-assets-by-group) | 그룹 키/값 쌍(예: 컬렉션)에 연결된 자산을 반환합니다. |
| [`getAssetsByOwner`](/ko/dev-tools/das-api/methods/get-assets-by-owner) | 소유자 주소에 연결된 자산을 반환합니다. |
| [`getNftEditions`](/ko/dev-tools/das-api/methods/get-nft-editions) | 마스터 에디션 NFT 민트의 인쇄 가능한 에디션을 반환합니다. |
| [`getTokenAccounts`](/ko/dev-tools/das-api/methods/get-token-accounts) | 소유자 또는 민트별 토큰 계정을 반환합니다. |
| [`searchAssets`](/ko/dev-tools/das-api/methods/search-assets) | 검색 조건과 일치하는 자산을 반환합니다. 에이전트 필터(`isAgent`, `agentToken`, `assetSigner`) 지원 — [에이전트 데이터 읽기](/ko/agents/read-agent-data#read-agent-data-via-das-api) 참조. |

## Notes

- 에이전트 응답 필드(`is_agent`, `asset_signer`, `agent_token`)는 Core 인터페이스에서 인덱싱됩니다. 에이전트(`is_agent: true`)가 될 수 있는 것은 개별 `MplCoreAsset` 행뿐입니다. 자세한 내용은 [`getAsset`](/ko/dev-tools/das-api/methods/get-asset)을 참조하세요.
- `searchAssets` 요청 매개변수는 camelCase(`isAgent`, `agentToken`, `assetSigner`)를 사용하고 JSON-RPC 응답은 snake_case를 사용합니다.
- 에이전트 필드에 대한 제공업체 지원은 다양합니다 — [DAS 제공업체](/solana/rpcs-and-das)가 에이전트 레지스트리 지원 인덱서를 실행하는지 확인하세요.
