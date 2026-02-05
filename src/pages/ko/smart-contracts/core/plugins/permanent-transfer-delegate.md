---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: 소유권 변경 후에도 유지되는 영구적인 transfer 권한을 부여합니다. 게임 메커니즘, 구독 서비스, 자동화된 자산 관리에 사용할 수 있습니다.
updated: '01-31-2026'
keywords:
  - permanent transfer
  - irrevocable delegate
  - automated transfers
  - game mechanics
about:
  - Permanent delegation
  - Automated management
  - Game integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Transfer Delegate와 Permanent Transfer Delegate의 차이점은 무엇인가요?
    a: 일반 Transfer Delegate는 1회 전송 후 취소됩니다. Permanent Transfer Delegate는 영구적으로 유지되며 무제한으로 전송할 수 있습니다.
  - q: Permanent Transfer Delegate가 동결된 Asset을 전송할 수 있나요?
    a: 네. Permanent plugin은 forceApprove를 사용하여 동결 거부를 무시합니다.
  - q: 기존 Asset에 이것을 추가할 수 있나요?
    a: 아니요. Permanent plugin은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Transfer Delegate를 사용하세요.
  - q: Collection 레벨의 Permanent Transfer Delegate는 어떻게 작동하나요?
    a: delegate는 Collection 내의 개별 Asset을 전송할 수 있지만, 한 번에 모두 전송할 수는 없습니다. 각 전송은 별도의 트랜잭션입니다.
---
**Permanent Transfer Delegate Plugin**은 영구적으로 유지되는 취소 불가능한 transfer 권한을 제공합니다. 일반 Transfer Delegate와 달리 이 권한은 취소되지 않으며 Asset을 반복적으로 전송할 수 있습니다. {% .lead %}
{% callout title="학습 내용" %}
- 영구 transfer 기능이 있는 Asset 생성
- Collection 전체 transfer 권한 활성화
- 사용 사례: 게임, 구독, 자동화 시스템
- permanent vs 일반 transfer delegate 이해
{% /callout %}
## 개요
**Permanent Transfer Delegate**는 생성 시에만 추가할 수 있는 permanent plugin입니다. delegate는 소유자 승인 없이 무제한으로 Asset을 전송할 수 있습니다.
- Asset/Collection 생성 시에만 추가 가능
- 권한은 영구적으로 유지 (취소되지 않음)
- `forceApprove` 사용 - 동결 상태에서도 전송 가능
- Collection 레벨: Collection 내의 모든 Asset 전송 가능
## 범위 외
일반 transfer delegate ([Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) 참조), 에스크로 없는 리스팅 (일반 delegate 사용), Token Metadata transfer 권한.
## 빠른 시작
**바로가기:** [Asset 생성](#creating-a-mpl-core-asset-with-a-permanent-transfer-plugin)
1. Asset/Collection 생성 시 `PermanentTransferDelegate` plugin 추가
2. authority를 프로그램 또는 delegate 주소로 설정
3. delegate는 언제든지 무제한으로 Asset 전송 가능
{% callout type="note" title="Permanent vs 일반 Transfer Delegate" %}
| 기능 | Transfer Delegate | Permanent Transfer Delegate |
|---------|-------------------|----------------------------|
| 생성 후 추가 | ✅ 가능 | ❌ 생성 시에만 |
| 전송 후 권한 유지 | ❌ 1회 전송 후 취소 | ✅ 영구 유지 |
| 다중 전송 | ❌ 1회성 | ✅ 무제한 |
| 동결된 Asset 전송 가능 | ❌ 불가 | ✅ 가능 (forceApprove) |
| Collection에서 동작 | ❌ 불가 | ✅ 가능 |
**[Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) 선택**: 1회성 에스크로 없는 판매가 필요한 경우.
**Permanent Transfer Delegate 선택**: 게임, 렌탈, 또는 반복 전송이 필요한 자동화 시스템의 경우.
{% /callout %}
## 일반적인 사용 사례
- **게임 메커니즘**: 게임 이벤트 (전투 패배, 거래) 발생 시 Asset 전송
- **렌탈 반환**: 렌탈한 NFT를 자동으로 소유자에게 반환
- **구독 관리**: 구독 종료 또는 갱신 시 토큰 전송
- **DAO 트레저리 관리**: DAO가 Asset 배포를 관리할 수 있도록 허용
- **자동화 시스템**: 전송마다 승인 없이 Asset을 이동해야 하는 프로그램
## 호환성
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
### 동작
- **Asset**: delegated 주소를 사용하여 Asset 전송을 허용합니다.
- **Collection**: collection authority를 사용하여 Collection 내의 모든 Asset 전송을 허용합니다. 한 번에 모두 전송하지 않습니다.
## 인수
| 인수    | 값 |
| ------ | ----- |
| frozen | bool  |
## Permanent Transfer Plugin이 있는 MPL Core Asset 생성
{% dialect-switcher title="Permanent Transfer Plugin이 있는 MPL Core Asset 생성" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentTransferDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 일반적인 오류
### `Cannot add permanent plugin after creation`
Permanent plugin은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에는 Permanent Transfer Delegate를 추가할 수 없습니다.
### `Authority mismatch`
plugin authority만 전송할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.
## 참고 사항
- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **Force approve**: 동결 상태에서도 전송 가능
- **Collection 동작**: Collection 내의 모든 Asset을 개별적으로 전송 가능
- **영구적**: 권한은 취소되지 않음
- **무제한 전송**: delegate가 전송할 수 있는 횟수에 제한 없음
## FAQ
### Transfer Delegate와 Permanent Transfer Delegate의 차이점은 무엇인가요?
일반 Transfer Delegate는 1회 전송 후 취소됩니다. Permanent Transfer Delegate는 영구적으로 유지되며 무제한으로 전송할 수 있습니다.
### Permanent Transfer Delegate가 동결된 Asset을 전송할 수 있나요?
네. Permanent plugin은 `forceApprove`를 사용하여 동결 거부를 무시합니다.
### 기존 Asset에 이것을 추가할 수 있나요?
아니요. Permanent plugin은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Transfer Delegate를 사용하세요.
### Collection 레벨의 Permanent Transfer Delegate는 어떻게 작동하나요?
delegate는 Collection 내의 개별 Asset을 전송할 수 있지만, 한 번에 모두 전송할 수는 없습니다. 각 전송은 별도의 트랜잭션입니다.
## 관련 Plugin
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 1회성 transfer 권한
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) - 영구적인 freeze 권한
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) - 영구적인 burn 권한
## 용어집
| 용어 | 정의 |
|------|------------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 Plugin |
| **forceApprove** | 다른 plugin의 거부를 무시하는 검증 |
| **Collection Transfer** | Collection 내의 모든 Asset을 전송하는 기능 |
