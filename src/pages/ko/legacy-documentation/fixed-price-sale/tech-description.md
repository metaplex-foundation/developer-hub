---
title: 기술 설명
metaTitle: 기술 설명 | Fixed Price Sale
description: Fixed Price Sale 프로그램의 기술 설명
---

## 크리에이터가 무언가를 판매하려면:

1. 스토어 생성

    - 마켓을 어떻게든 필터링해야 하기 때문에 필요합니다

    - 이름, 관리자 키, 설명을 포함합니다

2. 판매 리소스 초기화. 생성된 것일 수도 있고 우리 플랫폼이 생성할 수도 있습니다.

    - 사용자가 판매 리소스를 초기화하면 판매할 수 있는 리소스가 있는 객체가 생성됩니다

3. 마켓 생성

    - 판매 리소스에서 정의한 최대 공급량을 제외한 판매 항목에 대한 정보가 있는 객체 생성

## 사용자가 토큰을 구매하려면:

1. 스토어로 이동.

2. 토큰을 선택하고 "구매" 클릭

    - 내부적으로 다음과 같은 일이 발생합니다:

        - 이 사용자가 이미 구매한 토큰 수를 추적하는 TradeHistory 계정이 생성됩니다

        - 차변 및 대변 작업

        - 새 NFT 생성(민트 생성, 토큰 민트, 메타데이터 생성, 마스터에디션 생성)

3. 토큰이 지갑에 표시됩니다

# 계정

## Store

| 필드      | 타입 |설명|
| ----------- | ----------- | ------ |
| admin      | `Pubkey`       | 특정 스토어에서 판매 리소스 및 마켓을 생성할 수 있는 관리자 키       |
|  name  |  `String`  |   |
|  description  |  `String`  |   |

## Selling resource

| 필드      | 타입 |설명|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  owner  |  `Pubkey`  |  리소스의 소유자. 이 계정은 판매가 종료되면 리소스를 돌려받을 수 있습니다  |
|  resource  |  `Pubkey`  |  메타데이터가 첨부된 민트 계정. 민트 키를 알면 PDA를 계산할 수 있으므로 메타데이터 키를 저장할 필요가 없습니다  |
|  vault  |  `Pubkey`  |  마스터에디션을 보유하는 토큰 계정  |
|  vault_owner  |  `Pubkey`  |  시드가 ["mt_vault", resource.key(), store.key()]인 PDA  |
|  supply  |  `u64`  |  이미 판매된 토큰의 양  |
|  max_supply  |  `Option<u64>`  |  판매할 수 있는 토큰의 최대 양  |
|  state  |  `Enum{Uninitialised, Created, InUse, Exhausted, Stoped,}`  |  리소스의 상태  |

## Market

| 필드      | 타입 |설명|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  selling_resource  |  `Pubkey`  |    |
|  treasury_mint  |  `Pubkey`  |  마켓이 지불로 받을 토큰의 민트 계정  |
|  treasury_holder  |  `Pubkey`  |  구매자가 토큰을 보낼 토큰 계정. 마켓 소유자만 자산을 인출할 수 있습니다  |
|  treasury_owner  |  `Pubkey`  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  owner  |  `Pubkey`  |  마켓 소유자  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |  한 지갑에 판매할 수 있는 토큰 수  |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  state  |  `Enum {Uninitialised, Created, Active, Ended,}`  |    |
|  funds_collected  |  `u64`  |    |


## TradeHistory

### PDA ["history", wallet.key(), market.key()]

| 필드      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  `Pubkey`  |    |
|  wallet  |  `Pubkey`  |    |
|  already_bought  |  `u64`  |  사용자가 특정 마켓에서 이미 구매한 토큰 수  |

## PrimaryMetadataCreators

### PDA ["primary_creators", metadata.key()]

| 필드      | 타입 |설명|
| ----------- | ----------- | ------ |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  1차 판매 로열티를 받을 크리에이터 목록  |

# 명령어

## CreateStore

새 Store 계정을 생성합니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |    |
|  store  |  Key, Signer, Writable  |  초기화되지 않은 계정  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |

## InitSellingResource

마켓에서 사용할 SellingResource 계정을 초기화합니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  store  |  Key  |    |
|  store_admin  |  Key, Signer, Writable  |  resource_token을 보유하고 selling_resource 계정 생성 비용을 지불합니다  |
|  selling_resource  |  Key, Signer, Writable  |  초기화되지 않은 계정  |
|  selling_resource_owner  |  Key  |  판매가 종료되면 마스터에디션을 인출할 수 있는 키  |
|  resource_mint  |  Key  |  메타데이터가 첨부된 민트 계정  |
|  master_edition  |  Key  |  시드가 ["metadata", tokenMetadataProgramID, resource_mint, "edition"]인 PDA  |
|  metadata  |  Key  |  마스터 에디션의 메타데이터  |
|  vault  |  Key, Writable  |  리소스를 보유할 토큰 계정  |
|  vault_owner  |  PDA ["mt_vault", resource_mint.key(), store.key()]  |  볼트 토큰 계정의 소유자  |
|  resource_token  |  Key, Writable  |  resource_mint에서 토큰을 보유하는 사용자의 토큰 계정  |
|  max_supply  |  `Option<u64>`  |  판매할 토큰의 최대 양  |

## CreateMarket

마켓 계정을 초기화합니다. 상태를 Created로 설정하며, 이는 소유자가 마켓이 Mutable로 표시된 경우 활성화되기 전에 일부 데이터를 변경할 수 있음을 의미합니다.

:::warning

사용자가 네이티브 SOL로 아트를 판매하려는 경우 `treasury_mint`는 `11111111111111111111111111111111`로 설정되어야 하며 treasury_holder와 treasury_owner는 동일한 계정 PDA여야 합니다. 이는 프로그램만 해당 SOL을 사용할 수 있도록 보안상의 이유로 필요합니다.

:::

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Signer, Writable  |  초기화되지 않은 계정  |
|  store  |  Key  |    |
|  selling_resource_owner  |  Key, Signer, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  treasury_mint  |  Key  |  지불로 받을 자산의 민트  |
|  treasury_holder  |  Key  |  토큰 계정  |
|  treasury_owner  |  PDA ["holder", treasury_mint.key(), selling_resource.key()]  |    |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |    |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  gating_config  |  `Option<GatingConfig{collection: Pubkey, expire_on_use: bool, gating_time: Option<u64>}>`  |  게이팅 토큰. 이 값이 설정되면 지정된 컬렉션의 NFT를 가진 사용자만 마켓에서 새 NFT를 구매할 수 있습니다.  |

## ChangeMarket

Market::mutable == true인 경우에만 사용할 수 있습니다. 다음을 변경할 수 있습니다: name, description, mutable, price, pieces_in_one_wallet.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  new_name  |  `Option<String>`  |    |
|  new_description  |  `Option<String>`  |    |
|  mutable  |  `Option<bool>`  |    |
|  new_price  |  `Option<u64>`  |    |
|  new_pieces_in_one_wallet  |  `Option<u64>`  |    |

## Buy

사용자는 현재 날짜 > Market::start_date인 경우에만 호출할 수 있습니다.

:::warning

사용자가 네이티브 SOL로 아트를 구매하는 경우 user_token_acc 및 user_wallet 계정은 동일해야 합니다.

:::

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  user_token_acc  |  Key, Writable  |  멤버 토큰 비용을 지불할 토큰 계정. 이 토큰 계정의 민트는 == treasury_mint여야 합니다  |
|  user_wallet  |  Key, Signer, Writable  |    |
|  trade_history  |  Key, Writable  |  사용자가 이미 구매한 NFT 수를 추적하는 계정  |
|  treasury_holder  |  Key, Writable  |    |
|  new_metadata_acc  |  Key, Writable  |    |
|  new_edition_acc  |  Key, Writable  |    |
|  master_edition_acc  |  Key, Writable  |    |
|  new_mint  |  Key, Writable  |    |
|  edition_marker  |  Key, Writable  |  PDA, 시드는 token-metadata 프로그램에서 찾을 수 있습니다  |
|  vault  |  Key  |    |
|  vault_owner  |  PDA ["mt_vault", resource.key(), store.key()]  |    |
|  master_edition_metadata  |  Key  |    |
|    |  아래 계정은 선택 사항이며 게이팅 기능이 활성화된 경우에만 전달되어야 합니다 ↓  |    |
|  user_collection_token_account  |  Key, Writable  |  컬렉션의 사용자 토큰 계정  |
|  token_account_mint  |  Key, Writable  |  토큰의 민트 계정  |
|  metadata_account  |  Key  |  위에서 언급한 민트의 메타데이터 계정  |

## SuspendMarket

아무도 항목을 구매할 수 없고 마켓 소유자가 데이터를 변경할 수 있도록 마켓을 일시 중단합니다. 명령어는 Market::mutable == true인 경우에만 사용할 수 있습니다. 그렇지 않으면 일시 중단할 이유가 없기 때문입니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## ResumeMarket

일시 중단된 후 마켓을 재개하는 명령어입니다. 마켓이 일시 중단 상태인 경우에만 호출할 수 있습니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## CloseMarket

이 명령어는 마켓이 무제한 기간으로 생성된 경우에만 호출할 수 있습니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## Withdraw

수집된 재무 자금을 인출하기 위해 마켓 소유자가 호출합니다. Market::state == Ended인 경우에만 사용할 수 있습니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  selling_resource  |  Key  |    |
|  metadata  |  Key  |    |
|  treasury_holder  |  Key, Writable  |  Market::treasury_holder. 판매 중에 사용자로부터 받은 모든 토큰을 보유하는 토큰 계정  |
|  treasury_mint  |  Key  |    |
|  funder  |  Key  |    |
|  payer  |  Key, Signer  |    |
|  payout_ticket  |  Key, Writable  |  PDA["payout_ticket", market.key(), funder.key()]  |
|  treasury_owner  |  Key  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  destination  |  Key, Writable  |  토큰을 전송할 토큰 계정  |
|    |  아래 계정은 선택 사항이며 1차 판매 중에만 전달되어야 합니다 ↓  |    |
|  primary_metadata_creators_data  |  Key  |  1차 판매에서 로열티를 받아야 하는 크리에이터 목록  |

## ClaimResource

리소스 소유자가 호출합니다. SellingResource::state == Exhausted 또는 Market::state == Ended인 경우에만 사용할 수 있습니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  treasury_holder  |  Key  |    |
|  selling_resource  |  Key  |    |
|  selling_resource_owner  |  Key, Signer  |    |
|  source  |  Key, Writable  |  SellingResource::vault. 마스터 에디션을 보유하는 토큰 계정  |
|  metadata  |  Key  |  판매된 토큰의 메타데이터  |
|  vault_owner  |  Key  |  시드가 ["mt_vault", resource.key(), store.key()]인 PDA  |
|  secondary_metadata_creators  |  Key  |    |
|  destination  |  Key, Writable  |  마스터 에디션을 전송할 토큰 계정  |

## SavePrimaryMetadataCreators

마켓이 생성되기 전에 호출됩니다. 이 크리에이터 목록은 인출 명령어에서 로열티를 분배하는 데 사용됩니다. `primary_sale_happen = true`인 마스터 에디션에서 NFT를 판매하려는 경우 이 명령어를 호출할 필요가 없습니다.

| 매개변수      | 타입 |설명|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |  메타데이터의 업데이트 권한  |
|  metadata  |  Key, Writable  |    |
|  primary_metadata_creators  |  Key, Writable  |  시드가 ["primary_creators", metadata.key()]인 PDA  |
|  system_program  |  Key  |    |
|  primary_metadata_creators  |  `u8`  |  primary_metadata_creators 키 범프  |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  1차 로열티를 받을 크리에이터 목록  |
