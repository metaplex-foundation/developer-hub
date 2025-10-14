---
title: 메서드
metaTitle: 메서드 | DAS API
description: Metaplex DAS API 클라이언트를 위한 호출 가능한 API 메서드입니다.
---

DAS API는 다음 메서드를 지원합니다:

- [`getAsset`](/das-api/methods/get-asset): 메타데이터 및 소유자를 포함한 압축된/표준 자산의 정보를 반환합니다.
- [`getAssets`](/das-api/methods/get-assets): 메타데이터 및 소유자를 포함한 여러 압축된/표준 자산의 정보를 반환합니다.
- [`getAssetProof`](/das-api/methods/get-asset-proof): 압축된 자산에 대한 머클 트리 증명 정보를 반환합니다.
- [`getAssetProofs`](/das-api/methods/get-asset-proofs): 여러 압축된 자산에 대한 머클 트리 증명 정보를 반환합니다.
- [`getAssetSignatures`](/das-api/methods/get-asset-signatures): 압축된 자산에 대한 트랜잭션 서명을 반환합니다.
- [`getAssetsByAuthority`](/das-api/methods/get-asset-by-authority): 권한 주소가 지정된 자산 목록을 반환합니다.
- [`getAssetsByCreator`](/das-api/methods/get-asset-by-creator): 생성자 주소가 지정된 자산 목록을 반환합니다.
- [`getAssetsByGroup`](/das-api/methods/get-asset-by-group): 그룹(키, 값) 쌍이 지정된 자산 목록을 반환합니다. 예를 들어 컬렉션의 모든 자산을 가져오는 데 사용할 수 있습니다.
- [`getAssetsByOwner`](/das-api/methods/get-asset-by-owner): 소유자 주소가 지정된 자산 목록을 반환합니다.
- [`searchAssets`](/das-api/methods/search-assets): 검색 기준이 지정된 자산 목록을 반환합니다.
