---
title: 구성 파일
metaTitle: 구성 파일 | Sugar
description: Sugar 구성 파일의 자세한 개요입니다.
---

Sugar는 에셋을 업로드하고 Candy Machine을 구성하기 위해 JSON 구성 파일을 사용합니다. 대부분의 경우 파일 이름은 `config.json`입니다. 구성에는 Candy Machine을 초기화하고 업데이트하는 데 사용되는 설정과 민팅할 에셋을 업로드하는 설정이 포함됩니다. 또한 민팅에 대한 접근 제어를 제공할 가드의 구성도 포함됩니다.

기본 구성 파일은 아래와 같습니다:

```json
{
  "tokenStandard": "pnft",
  "number": 10,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "ruleSet": "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
  "creators": [
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    },
    {
      "address": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8",
      "share": 50
    }
  ],
  "hiddenSettings": null,
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "pinataConfig": null,
  "sdriveApiKey": null,
  "guards": {
    "default": {
      "botTax": {
        "value": 0.01,
        "lastInstruction": true
      }
    },
    "groups": [
      {
        "label": "OGs",
        "guards": {
          "startDate": {
            "date": "2022-10-20 12:00:00 +0000"
          },
          "tokenGate": {
            "amount": 1,
            "mint": "7nE1GmnMmDKiycFkpHF7mKtxt356FQzVonZqBWsTWZNf"
          },
          "solPayment": {
            "value": 1,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      },
      {
        "label": "Public",
        "guards": {
          "startDate": {
            "date": "2022-10-20 18:00:00 +0000"
          },
          "solPayment": {
            "value": 2,
            "destination": "PanbgtcTiZ2PveV96t2FHSffiLHXXjMuhvoabUUKKm8"
          }
        }
      }
    ]
  }
}
```

구성 파일은 세 가지 주요 부분으로 볼 수 있습니다: Candy Machine 설정(`"tokenStandard"`부터 `"hiddenSettings"`까지), 업로드 설정(`"uploadMethod"`부터 `"sdriveApiKey"`까지) 및 가드 설정(`"guards"`).

## Candy Machine 설정

Candy Machine 설정은 에셋의 유형, 사용 가능한 에셋 수 및 메타데이터 정보를 결정합니다.

| 설정 | 옵션 | 값/타입 | 설명               |
| ------- | ------- | --------------- | ------------------------- |
| tokenStandard |   |                 |                           |
|         |         | "nft"           | 대체 불가능한 에셋 (`NFT`)        |
|         |         | "pnft"           | 프로그래밍 가능한 대체 불가능한 에셋 (`pNFT`) |
| number  |         | Integer         | 사용 가능한 항목 수 |
| symbol  |         | String          | NFT의 심볼을 나타내는 문자열 |
| sellerFeeBasisPoint  |         | Integer          | 창작자가 공유하는 로열티(베이시스 포인트, 즉 550은 5.5%를 의미)  |
| isMutable |       | Boolean         | NFT 메타데이터 계정을 업데이트할 수 있는지를 나타내는 불린 값 |
| isSequential |    | Boolean         | 민팅 중에 순차적 인덱스 생성을 사용할지를 나타내는 불린 값 |
| ruleSet  |        | Public Key | *(선택사항)* 민팅된 `pNFT`가 사용하는 규칙 세트 |

`creators` 설정을 사용하면 최대 4개의 주소와 그들의 백분율 지분을 지정할 수 있습니다.

| 설정 | 옵션 | 값/타입 | 설명               |
| ------- | ------- | --------------- | ------------------------- |
| creators |        | 최대 4명의 창작자 | 창작자 목록 및 로열티의 백분율 지분 |
|          | address | Public Key | 창작자 공개 키 |
|          | share | Integer | `0`과 `100` 사이의 값 |

{% callout %}

온체인 메타데이터는 최대 5명의 창작자를 저장하지만, Candy Machine은 창작자 중 하나로 설정됩니다. 따라서 최대 4명의 창작자만 허용됩니다.

지분 값의 합계는 100이 되어야 하며, 그렇지 않으면 오류가 발생합니다.

{% /callout %}

Candy Machine은 NFT가 민팅될 때 최종 메타데이터를 갖지 않도록 구성할 수 있습니다. 이는 민팅이 완료된 후 공개 단계를 계획할 때 유용합니다. 이 경우 *숨겨진* NFT에 대한 "플레이스홀더" 메타데이터 값을 지정할 수 있습니다:

| 설정 | 옵션 | 값/타입 | 설명               |
| ------- | ------- | --------------- | ------------------------- |
| hiddenSettings | | | |
| | name | String | 민트의 이름(`$ID$` 또는 `$ID+1$` 민트 인덱스 교체 변수를 사용해야 하므로 `sugar reveal`이 작동할 수 있음) |
| | uri | String | 민트의 URI(`$ID$` 또는 `$ID+1$` 민트 인덱스 교체 변수를 사용할 수 있음) |
| | hash | String | 32자 해시(대부분의 경우 민트 번호와 메타데이터 간의 매핑이 있는 캐시 파일의 해시로, 민트가 완료될 때 순서를 확인할 수 있음. `sugar hash`를 사용하여 찾을 수 있음)

{% totem %}
{% totem-accordion title="hiddenSettings 예시" %}
구성 파일의 `hiddenSettings` 섹션은 다음과 같을 수 있습니다:
```json
"hiddenSettings": {
    "name": "Name $ID+1$",
    "uri": "https://arweave.net/IM4NByHrEzG87g2AhFY4pY7lk7YNriUVUUbZWhZ0HHY/26.png",
    "hash": "49Bj8ZVSvSvAQwziKEts3iAeUhi27ATH"
}
```
{% /totem-accordion %}
{% /totem %}

## 업로드 설정

Sugar는 다양한 스토리지 공급자를 지원하며, 사용할 공급자는 `uploadMethod` 설정으로 정의됩니다. 공급자에 따라 추가 구성이 필요할 수 있습니다.

아래 표는 사용 가능한 설정에 대한 개요를 제공합니다:

| 설정 | 옵션 | 허용되는 값 | 설명               |
| ------- | ------- | --------------- | ------------------------- |
| uploadMethod |   |  | 이미지와 메타데이터를 업로드할 스토리지 구성 |
|  |   | "bundlr" |  [Bundlr](https://bundlr.network)을 사용하여 Arweave에 업로드하고 SOL로 결제 (메인넷과 데브넷 모두에서 작동; 데브넷에서는 7일 동안만 파일이 저장됨)
|  |   | "aws" | Amazon Web Services (AWS)에 업로드 |
|  |   | "pinata" | [Pinata](https://www.pinata.cloud)에 업로드 (모든 네트워크에서 작동; 무료 및 계층화된 구독) |
|  |   | "sdrive" | [SDrive Cloud Storage](https://sdrive.app)를 사용하여 Shadow Drive에 업로드 |
|awsConfig | | | *("aws"가 사용될 때 필수)* |
| | bucket | String | AWS 버킷 이름
| | profile | String | 자격 증명 파일에서 사용할 AWS 프로필 이름 |
| | directory | String | 항목을 업로드할 버킷 내의 디렉터리. 빈 문자열은 버킷 루트 디렉터리에 파일을 업로드함을 의미. |
| pinataConfig | | | *("pinata"가 사용될 때 필수)* |
| | JWT | String | JWT 인증 토큰 |
| | apiGateway | String | Pinata API에 연결할 URL |
| | apiContent | String | 에셋 링크 생성의 기반으로 사용할 URL |
| | parallelLimit | Integer | 동시 업로드 수; 속도 제한을 피하기 위해 이 설정 사용 |
| sdriveApiKey | | String | SDrive API 키 *("sdrive"가 사용될 때 필수)* |

특정 업로드 방법 설정:

{% totem %}
{% totem-accordion title="Bundlr" %}

`"bundlr"` 업로드 방법은 추가 구성이 필요하지 않습니다. 업로드와 관련된 모든 수수료는 구성된 키페어를 사용하여 `SOL`로 지불됩니다.

{% /totem-accordion %}
{% totem-accordion title="AWS" %}

`"aws"` 방법은 파일을 Amazon S3 스토리지에 업로드합니다. 이는 추가 구성이 필요하며, 구성 파일의 `"awsConfig"` 하에 `bucket`, `profile`, `directory` 및 `domain` 값을 지정하고 시스템에 자격 증명을 설정해야 합니다. 대부분의 경우 다음 속성으로 `~/.aws/credentials` 파일을 생성하는 것이 포함됩니다:

```
[default]
aws_access_key_id=<ACCESS KEY ID>
aws_secret_access_key=<SECRET ACCESS KEY>
region=<REGION>
```

또한 `"public-read"`를 활성화하고 다른 출처에서 요청된 콘텐츠 액세스를 가능하게 하는 Cross-Origin Resource Sharing (CORS) 규칙을 적용하여 버킷의 ACL 권한을 올바르게 설정하는 것이 중요합니다(지갑과 블록체인 탐색기가 메타데이터/미디어 파일을 로드할 수 있게 하기 위해 필요). 이러한 구성에 대한 더 많은 정보는 다음에서 찾을 수 있습니다:

* [버킷 정책 예시](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
* [CORS 구성](https://aws.amazon.com/premiumsupport/knowledge-center/s3-configure-cors/)

`profile` 값을 사용하면 자격 증명 파일에서 읽을 프로필을 지정할 수 있습니다. `directory` 값은 파일이 업로드될 버킷 내 디렉터리의 이름으로, 서로 다른 디렉터리로 구분된 단일 버킷에 여러 candy machine 또는 컬렉션을 가질 수 있게 합니다. 이를 빈 문자열로 두면 파일이 버킷의 루트에 업로드됩니다. (선택사항인) `domain`을 사용하면 AWS에서 데이터를 제공할 커스텀 도메인을 지정할 수 있습니다 — 예를 들어, 도메인을 `https://mydomain.com`으로 사용하면 `https://mydomain.com/0.json` 형식의 파일 링크를 생성합니다. 도메인을 지정하지 않으면 기본 AWS S3 도메인(`https://<BUCKET_NAME>.s3.amazonaws.com`)이 사용됩니다.

{% /totem-accordion %}
{% totem-accordion title="Pinata" %}

`"pinata"` 방법은 파일을 Pinata 스토리지에 업로드합니다. 구성 파일의 `"pinataConfig"` 하에 `jwt`, `apiGateway`, `contentGateway` 및 `parallelLimit` 값을 지정해야 합니다:

* `jwt`: JWT 인증 토큰
* `apiGateway`: Pinata API에 연결할 URL (공개 API 엔드포인트의 경우 `https://api.pinata.cloud` 사용)
* `contentGateway`: 에셋 링크 생성의 기반으로 사용할 URL (공개 게이트웨이의 경우 `https://gateway.pinata.cloud` 사용)
* `parallelLimit`: (선택사항) 동시 업로드 수, 속도 제한을 피하기 위해 이 값을 조정

{% callout %}

공개 게이트웨이는 프로덕션에서 사용하기 위한 것이 아닙니다 — 심하게 속도 제한이 있고 속도를 위해 설계되지 않았으므로 테스트에 사용하기에 좋습니다.

{% /callout %}

{% /totem-accordion %}
{% totem-accordion title="SDrive" %}

SDrive는 GenesysGo Shadow Drive 위에 구축된 스토리지 앱입니다. API 키(토큰)를 얻기 위해 계정을 등록해야 하며, 이는 구성 파일에서 `"sdriveApiKey"`로 지정해야 합니다.

{% /totem-accordion %}
{% /totem %}

## 가드 설정

`guards` 설정을 사용하면 Candy Machine에서 활성화될 가드를 지정할 수 있습니다.

Candy Machine은 민팅에 대한 접근 제어를 제공하는 여러 가드를 지원합니다. [가드](/ko/candy-machine/guards)는 "기본" [가드 그룹](/ko/candy-machine/guard-groups)으로 구성되거나 여러 가드 그룹에 나타날 수 있습니다.