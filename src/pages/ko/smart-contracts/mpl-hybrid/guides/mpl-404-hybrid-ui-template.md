---
title: Metaplex MPL-404 Hybrid Solana NextJs Tailwind 템플릿
metaTitle: Metaplex MPL-404 Hybrid NextJs Tailwind 템플릿 | Web UI Templates
description: Nextjs, Tailwind, Metaplex Umi, Solana WalletAdapter 및 Zustand를 사용하는 Metaplex MPL-404 Hybrid용 웹 UI 템플릿입니다.
created: 2024-12-16
---

Metaplex MPL-404 Hybrid UI 템플릿은 개발자와 사용자에게 개발 시작점을 제공하기 위해 구축되었습니다. 이 템플릿은 `.env` 예제 파일, 기능적인 UI 컴포넌트 및 트랜잭션 호출이 미리 설정되어 있어 하이브리드 컬렉션을 위한 프론트엔드 UI를 만들면서 개발을 빠르게 시작할 수 있습니다.

{% image src="/images/hybrid-ui-template-image.jpg" alt="MPL-404 Hybrid UI Template Screenshot" classes="m-auto" /%}

## 기능

- Nextjs React 프레임워크
- Tailwind
- Shadcn
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- 다크/라이트 모드
- Umi 헬퍼

이 UI 템플릿은 기본 Metaplex UI 템플릿을 사용하여 만들어졌습니다. 추가 문서는 다음에서 찾을 수 있습니다.

기본 템플릿 Github 저장소 - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

## 설치

```shell
git clone https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn.git
```

Github 저장소 - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)

## 설정

### .env 파일

`.env.example`을 `.env`로 이름을 변경합니다.

다음을 올바른 세부 정보로 채웁니다.

```
// Escrow Account
NEXT_PUBLIC_ESCROW="11111111111111111111111111111111"
NEXT_PUBLIC_COLLECTION="11111111111111111111111111111111"
NEXT_PUBLIC_TOKEN="11111111111111111111111111111111"

// RPC URL
NEXT_PUBLIC_RPC="https://myrpc.com/?api-key="
```

### 이미지 교체
src/assets/images/에 교체할 두 개의 이미지가 있습니다:

- collectionImage.jpg
- token.jpg

이 두 이미지는 이미지 uri에 액세스하기 위해 컬렉션 및 토큰 메타데이터를 가져오는 것을 방지하는 데 사용됩니다.

### RPC 변경

다음 방법 중 하나를 사용하여 원하는 방식으로 프로젝트의 RPC URL을 구성할 수 있습니다:

- .env
- constants.ts 파일
- umi에 직접 하드코딩

이 예제에서는 RPC url이 `src/store/useUmiStore.ts`의 21번째 줄에 있는 `umiStore` umi 상태에 하드코딩되어 있습니다.

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // add your own RPC here
  umi: createUmi('http://api.devnet.solana.com').use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```
## 추가 문서

이 템플릿이 구축된 헬퍼와 기능을 이해하기 위해 기본 템플릿에 대한 문서를 추가로 읽는 것이 좋습니다.

Github 저장소 - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)
