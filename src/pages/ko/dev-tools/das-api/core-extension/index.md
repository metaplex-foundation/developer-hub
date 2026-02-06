---
title: Core DAS API 확장
metaTitle: 메서드 | Core DAS API 확장
description: MPL Core용 디지털 자산 표준 API 확장
---

일반 DAS SDK 외에도 [MPL Core](/ko/smart-contracts/core)용 확장이 생성되어 MPL Core SDK와 함께 사용할 수 있는 올바른 타입을 직접 반환합니다. 또한 컬렉션에서 상속된 자산의 플러그인을 자동으로 파생하고 [DAS-to-Core 타입 변환](/ko/dev-tools/das-api/core-extension/convert-das-asset-to-core)을 위한 함수를 제공합니다.

## 페칭

Core DAS API 확장은 다음 메서드를 지원합니다:

- [`getAsset`](/ko/dev-tools/das-api/core-extension/methods/get-asset): 메타데이터 및 소유자를 포함한 압축/표준 자산의 정보를 반환합니다.
- [`getCollection`](/ko/dev-tools/das-api/core-extension/methods/get-collection): 압축 자산에 대한 머클 트리 증명 정보를 반환합니다.
- [`getAssetsByAuthority`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-authority): 권한 주소가 주어진 자산 목록을 반환합니다.
- [`getAssetsByCollection`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-collection): 그룹(키, 값) 쌍이 주어진 자산 목록을 반환합니다. 예를 들어 컬렉션의 모든 자산을 가져오는 데 사용할 수 있습니다.
- [`getAssetsByOwner`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-owner): 소유자 주소가 주어진 자산 목록을 반환합니다.
- [`searchAssets`](/ko/dev-tools/das-api/core-extension/methods/search-assets): 검색 기준이 주어진 자산 목록을 반환합니다.
- [`searchCollections`](/ko/dev-tools/das-api/core-extension/methods/search-collections): 검색 기준이 주어진 컬렉션 목록을 반환합니다.

## 타입 변환

또한 일반 DAS 자산 타입을 Core 자산 및 Core 컬렉션으로 변환하는 함수를 제공합니다:

- [`dasAssetsToCoreAssets`](/ko/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): DAS 자산을 Core 자산 타입으로 변환
- [`dasAssetsToCoreCollection`](/ko/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): DAS 자산을 Core 컬렉션 타입으로 변환

## 플러그인 파생

이 라이브러리는 컬렉션에서 상속된 자산의 플러그인을 자동으로 파생합니다. 일반적인 플러그인 상속 및 우선순위에 대한 자세한 내용은 [Core 플러그인 페이지](/ko/smart-contracts/core/plugins)를 참조하세요.

파생을 비활성화하거나 수동으로 구현하려면 [플러그인 파생 페이지](/ko/dev-tools/das-api/core-extension/plugin-derivation)가 도움이 될 것입니다.
