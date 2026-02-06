---
title: Candy Machine으로 Solana에서 Token Metadata NFT 컬렉션 생성하기
metaTitle: Candy Machine으로 Solana에서 Token Metadata NFT 컬렉션 생성하기 | Candy Machine
description: Candy Machine을 사용하여 Solana 블록체인에서 NFT 컬렉션을 생성하는 방법입니다.
---

Solana에서 NFT 컬렉션을 출시하려는 경우 Sugar CLI 도구 키트가 더 복잡한 설정 및 관리 단계를 추상화하여 Solana 블록체인에서 Candy Machine을 생성할 수 있는 자동화된 출시 시스템을 제공합니다.

## 사전 준비 사항

- Solana CLI가 설치되고 구성되어 있어야 합니다. [설치](https://docs.solanalabs.com/cli/install)
  - CLI를 사용하여 생성된 파일 시스템 지갑
  - 메인넷 또는 데브넷 SOL로 지갑에 자금이 있어야 함

## 초기 설정

### Sugar 설치

#### Mac/Linux

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

다음 URL을 사용하여 설치 실행 파일을 다운로드하여 Sugar를 설치할 수 있습니다:

```
https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe
```

더블 클릭으로 바이너리를 실행해 보세요. 신뢰할 수 없는 바이너리에 대한 팝업 메시지 경고가 나타나면 "추가 정보"를 클릭한 다음 "실행"을 클릭해 보세요.

## 에셋 준비

NFT는 `이미지`와 `메타데이터`라는 두 가지 기본 부분을 가집니다.

이미지는 지갑과 마켓에서 보여지고 표시되는 것이며, `메타데이터`에는 `이름`, `이미지`를 찾을 링크, NFT의 `속성` 등 블록체인에서 해당 NFT에 대한 모든 관련 정보가 포함됩니다.

### Assets 폴더

Sugar에서 명령어를 실행할 때, Sugar는 명령어를 실행하는 디렉터리에서 `assets` 폴더를 찾을 것으로 예상합니다.

이미지와 메타데이터 파일 모두 `assets` 폴더에 있어야 합니다.

### 파일 명명

이미지와 메타데이터 JSON 파일은 0부터 시작하는 증분 인덱스 명명 규칙을 따라야 합니다.

인덱스가 누락되거나 `이미지`와 `메타데이터` 폴더에 동일한 수의 파일이 포함되지 않으면 폴더 검증이 실패합니다.

```
assets/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

### 메타데이터 JSON

{% partial file="token-standard-full.md" /%}

```json
{
  "name": "My NFT #1",
  "description": "My NFT Collection",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### 예시 이미지와 메타데이터

Candy Machine을 생성하기 위해 예시 이미지와 메타데이터를 사용하고 싶다면 여기 GitHub에서 녹색 `code` 버튼을 클릭하고 `zip 형식`을 선택하여 zip 형식으로 다운로드할 수 있습니다.

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

또는 git이 설치되어 있다면 에셋을 시스템에 복제하거나 제공된 링크에서 압축된 사본을 다운로드할 수 있습니다

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```

### 이미지와 메타데이터 생성기

레이어에서 아트워크 이미지와 메타데이터를 생성해야 한다면 생성기에 이미지 레이어와 프로젝트에 대한 기본 정보를 제공하면 주어진 매개변수에 따라 x개의 에셋 이미지와 JSON 메타데이터 조합을 생성하는 여러 자동화 스크립트와 웹사이트가 있습니다.

| 이름                                                        | 타입   | 난이도 | 요구사항 | 무료 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | 스크립트 | ⭐⭐⭐⭐   | JS 지식 | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | 스크립트 | ⭐⭐⭐⭐   | JS 지식 | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | 웹 UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | 웹 UI | 알 수 없음    |              |      |

### 컬렉션 세부사항

컬렉션 생성을 위해서는 NFT 에셋과 같은 세부사항이 필요한데, 이는 `이미지` 파일과 `메타데이터` json 파일입니다. 이들은 다음과 같이 `assets/` 폴더의 루트에 배치됩니다:

```
assets/
├─ collection.jpg
├─ collection.json
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

컬렉션 메타데이터 파일은 NFT 에셋 json 파일과 동일한 형식입니다. 컬렉션의 경우 `attributes` 필드 작성을 생략할 수 있습니다.

```json
{
  "name": "My Collection",
  "description": "This is My Nft Collection",
  "image": "collection.jpg",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

## Sugar

기본적으로 **Sugar**는 Solana CLI에서 사용하는 것과 동일한 구성 파일을 사용하여 다음과 같은 기본값을 로드합니다:

- Solana CLI에서 설정한 지갑
- Solana CLI에서 설정한 RPC URL

### Sugar Launch

에셋 폴더가 준비되면 **Sugar**로 배포 프로세스를 시작할 수 있습니다. 실행할 첫 번째 명령어는

```shell
sugar launch
```

이는 Candy Machine 배포와 관련된 정보를 수집하기 위해 **Sugar**의 CLI 프로세스를 시작합니다.

`sugar`가 구성 파일을 찾지 못하면 하나를 생성하라고 요청할 것입니다.

그런 다음 작성할 다음 질문들이 나타날 것입니다

```
Found xx file pairs in "assets". Is this how many NFTs you will have in your candy machine?
```

```
Found symbol "xxxx" in your metadata file. Is this value correct?
```

```
Found value xxx for seller fee basis points in your metadata file. Is this value correct?
```

```
Do you want to use a sequential mint index generation? We recommend you choose no.
```

```
How many creator wallets do you have? (max limit of 4)
```

창작자 지갑은 로열티를 분배하는 데 사용됩니다. 선택하면 각 지갑에 대한 `주소`와 `지분` 금액을 입력하라는 메시지가 나타납니다.

```
Which extra features do you want to use? (use [SPACEBAR] to select options you want and hit [ENTER] when done)
```

이 가이드에서는 `hidden settings`를 선택하지 않은 상태로 두고 `enter`를 눌러 진행하겠습니다.

```
What upload method do you want to use?
```

이 가이드에서는 `Bundlr`을 선택하겠습니다.

```
Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes.
```

나중에 필요하면 NFT를 편집할 수 있도록 이 옵션에서 예(y)를 선택하세요.

Sugar는 이제 다음 프로세스를 시작해야 합니다:

- 컬렉션 NFT 생성 및 업로드
- Irys (이전 Bundlr)를 사용하여 Arweave에 에셋 업로드
- Candy Machine 생성

성공하면 링크 내에 자신의 Candy Machine 주소가 포함된 다음 메시지가 표시됩니다:

```
https://www.solaneyes.com/address/Beag81WvAPUCeFpJ2qFnvd2f1CFCpQBf3abTJXA1fH9o?cluster=devnet
```

축하합니다! Solana에서 Candy Machine을 생성했습니다.
위 링크를 클릭하면 온체인에서 Candy Machine 세부 정보를 볼 수 있습니다.

### 가드와 그룹으로 Candy Machine 업데이트

현재 Candy Machine에는 가드가 연결되어 있지 않습니다. 기본적으로 Candy Guard가 Candy Machine에 연결되지 않으면 **민트 권한**(당신)만 Candy Machine에서 민팅할 수 있습니다.

이를 해결하기 위해 Candy Machine에 가드를 연결해야 하며, 이를 통해 일련의 규칙에 따라 공개적으로 Candy Machine에서 민팅할 수 있게 됩니다. 예를 들어, 사용자에게 1 SOL을 청구하면서 공개적으로 Candy Machine에서 민팅할 수 있게 하고 싶을 수 있습니다. 이를 위해 **Sol Payment Guard**를 사용할 수 있습니다.

#### 가드 추가 (SOL Payment)

Candy Machine에 Sol Payment Guard를 추가하려면 터미널에서 `sugar launch`를 실행한 폴더의 루트에 Sugar가 생성한 `config.json` 파일을 열어야 합니다.

구성 파일은 다음과 같을 것입니다:

```json
{
  "tokenStandard": "nft",
  "number": 16,
  "symbol": "NUMBERS",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "creators": [
    {
      "address": "B1kwbSHRiXFPYvNbuhCX92ibngzxdmfBzfaJYuy9WYp5",
      "share": 100
    }
  ],
  "uploadMethod": "bundlr",
  "ruleSet": null,
  "awsConfig": null,
  "sdriveApiKey": null,
  "pinataConfig": null,
  "hiddenSettings": null,
  "guards": null,
  "maxEditionSupply": null
}
```

여기서 구성 파일 끝 부분의 `guards` 필드를 편집하고 SOL Payment가 전송될 대상 주소를 작성할 수 있습니다.

```json
"guards": {
    "default": {
        "solPayment": {
            "value": 1,
            "destination": "11111111111111111111111111111111"
        }
    }
},
```

`config.json`에 가드를 추가한 후 파일을 저장하고 다음 명령어를 실행하세요:

```
sugar guard add
```

이전에 이미 Candy Guard를 생성했다면 대신 다음 명령어를 실행할 수 있습니다:

```
sugar guard update
```

이는 Candy Guard를 생성하고 기본 가드 목록에 **SOL Payment Guard**를 추가합니다.

## Candy Machine 보기

터미널에서 Candy Machine 세부 정보를 보려면 다음 명령어를 실행할 수 있습니다

```shell
sugar show
```

이는 삽입된 모든 항목을 제외한 모든 Candy Machine과 가드 세부 정보를 나열합니다.

## Candy Guard 보기

터미널에서 Candy Machine 세부 정보를 보려면 다음 명령어를 실행할 수 있습니다

```shell
sugar guard show
```

이는 삽입된 모든 항목을 제외한 모든 Candy Machine과 가드 세부 정보를 나열합니다.

## 다음 단계

이제 작동하는 Candy Machine이 있으므로 사람들이 Candy Machine에서 민팅할 수 있도록 웹 UI에서 Candy Machine을 호스팅해야 합니다.

자체 UI를 생성하고 `umi` 클라이언트 래퍼와 `mpl-candy-machine` SDK를 사용하거나 미리 구축된 커뮤니티 UI를 사용하고 Candy Machine의 세부 정보만 제공할 수 있습니다.

### UI 개발 리소스

- nextJS/React 권장
- Metaplex Umi - [https://developers.metaplex.com/umi](https://developers.metaplex.com/umi)
- Metaplex Candy Machine SDK - [https://developers.metaplex.com/candy-machine](https://developers.metaplex.com/candy-machine)

### 추가 읽을거리

- [Sugar CLI 문서](/ko/smart-contracts/candy-machine/sugar)
