---
title: 프로그래머블 NFT (pNFT)
metaTitle: 프로그래머블 NFT (pNFT) | Token Metadata
description: Token Metadata의 프로그래머블 NFT(일명 pNFT)에 대해 자세히 알아보세요
---

[개요 페이지](/ko/smart-contracts/token-metadata#pnfts)에서 언급했듯이, 프로그래머블 NFT(pNFT)는 크리에이터가 특정 작업에 대한 사용자 정의 규칙을 정의하고 서드파티 권한에 보다 세분화된 권한을 위임할 수 있도록 하는 새로운 자산 표준입니다. {% .lead %}

## Token Metadata 우회 방지

Token Metadata 프로그램은 SPL Token 프로그램 위에 구축되어 있기 때문에, 모든 소유자나 spl-token 위임자는 SPL Token 프로그램과 직접 상호작용하여 전송 및 소각과 같은 중요한 작업에서 Token Metadata 프로그램을 우회할 수 있습니다. 이는 프로그램 간의 훌륭한 구성 가능성 패턴을 만들지만, Token Metadata 프로그램이 크리에이터를 대신하여 규칙을 시행할 수 없다는 의미이기도 합니다.

이것이 문제가 될 수 있는 좋은 예는 Token Metadata가 2차 판매 로열티를 강제할 수 없다는 것입니다. 로열티 비율이 **Metadata** 계정에 저장되어 있더라도, 전송을 수행하는 사용자나 프로그램이 이를 존중할지 여부를 결정하는 것은 그들의 몫입니다. 이에 대해 자세히 설명하고 pNFT가 이 문제를 해결하는 방법은 [아래 섹션](#use-case-royalty-enforcement)에서 다룹니다.

프로그래머블 NFT는 **크리에이터가 자산의 인증 레이어를 커스터마이즈할 수 있도록** 하는 유연한 방식으로 이 문제를 해결하기 위해 도입되었습니다.

프로그래머블 NFT는 다음과 같이 작동합니다:

- **pNFT의 Token 계정은 SPL Token 프로그램에서 항상 동결됩니다.** pNFT가 위임되었는지 여부에 관계없이 말입니다. 이는 아무도 SPL Token 프로그램과 직접 상호작용하여 Token Metadata 프로그램을 우회할 수 없도록 보장합니다.
- pNFT의 Token 계정에서 작업이 수행될 때마다, Token Metadata 프로그램은 **계정을 해동하고, 작업을 수행한 다음, 계정을 다시 동결합니다**. 이 모든 것이 동일한 명령어에서 **원자적으로** 발생합니다. 이렇게 하면 SPL Token 프로그램에서 수행할 수 있는 모든 작업이 pNFT에서도 여전히 사용 가능하지만, 항상 Token Metadata 프로그램을 통해 수행됩니다.
- pNFT에 [Token Delegate](/ko/smart-contracts/token-metadata/delegates#token-delegates)가 설정되면, 정보는 **Token Record** 계정에 저장됩니다. pNFT는 SPL Token 프로그램에서 항상 동결되어 있기 때문에, pNFT가 실제로 잠겨있는지 여부를 추적하는 것은 Token Record 계정의 책임입니다.
- pNFT에 영향을 미치는 모든 단일 작업이 Token Metadata 프로그램을 거쳐야 하므로, 우리는 이러한 작업에 대한 인증 규칙을 시행할 수 있는 병목 지점을 만들었습니다. 이러한 규칙은 **Token Auth Rules** 프로그램이 관리하는 **Rule Set** 계정에 정의됩니다.

본질적으로, 이는 pNFT에 다음과 같은 능력을 제공합니다:

1. 더 세분화된 위임자를 가짐.
2. 모든 작업에 대한 규칙 시행.

이 두 가지 능력에 대해 더 자세히 살펴보겠습니다.

## 더 세분화된 위임자

모든 pNFT 작업이 Token Metadata 프로그램을 거쳐야 하므로, spl-token 위임자 위에 새로운 위임자 시스템을 만들 수 있습니다. 더 세분화되고 pNFT 소유자가 서드파티에 위임하고자 하는 작업을 선택할 수 있도록 하는 시스템입니다.

이 새로운 위임자 시스템에 대한 정보는 pNFT의 Mint 계정과 Token 계정 모두에서 파생된 특별한 **Token Record** PDA에 저장됩니다. 새로운 위임자 권한이 pNFT에 할당되면, Token Metadata 프로그램은 Token 계정과 Token Record 계정 모두에서 해당 정보를 동기화합니다.

이러한 위임자에 대해서는 [위임된 권한 페이지의 "Token Delegates" 섹션](/ko/smart-contracts/token-metadata/delegates#token-delegates)에서 더 자세히 논의합니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="0" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## 추가 계정

pNFT는 대부분의 작업에서 추가 계정이 필요하며, 여기에는 `tokenRecord`, `authorizationRules`, `authorizationRulesProgram`이 포함됩니다.

### Token Record

`tokenRecord` 계정은 토큰과 `delegates`, `lock` 상태와 같은 상태에 대한 세부 정보를 보유할 책임이 있습니다.

`tokenRecord` 계정에 액세스하는 몇 가지 방법이 있으며, 이는 메타데이터, 토큰 계정 및 토큰 레코드를 포함하여 필요한 모든 계정을 반환하는 `fetchDigitalAssetWithAssociatedToken`이거나, 또는 `findTokenRecordPda` 함수로 mint ID와 토큰 계정 주소를 사용하여 토큰 레코드 PDA 주소를 생성하는 것입니다.

#### Asset With Token

메타데이터 계정, 토큰 계정, 토큰 레코드 계정과 같은 데이터를 반환하는 `fetchDigitalAssetWithAssociatedToken` 함수로 필요한 모든 계정을 가져올 수 있습니다.

{% code-tabs-imported from="token-metadata/pnft-fetch-with-token" frameworks="umi,kit" /%}

#### Token Record PDA

pNFT 자산이 저장된 지갑의 `mintId`와 `tokenAccount`로 `tokenRecord` 계정의 PDA 주소를 생성합니다.

{% code-tabs-imported from="token-metadata/pnft-find-token-record-pda" frameworks="umi,kit" /%}

### RuleSet

`metadata` 계정 데이터가 사용 가능한 경우, 메타데이터 계정의 `programmableConfig` 필드를 확인하여 룰셋을 가져올 수 있습니다.

{% code-tabs-imported from="token-metadata/pnft-get-ruleset" frameworks="umi,kit" /%}

### Authorization Rules Program

pNFT 자산에 `ruleSet`이 설정되어 있는 경우, `ruleSet`을 검증할 수 있도록 **Authorization Rules Program ID**를 전달해야 합니다.

{% code-tabs-imported from="token-metadata/pnft-auth-rules-program" frameworks="umi,kit" /%}

### Authorization Data

검증을 위해 추가 데이터가 필요한 `ruleSet`이 pNFT 자산에 있는 경우 명령어 매개변수에서 `authorizationData: { payload: ... }`로 전달합니다.

## 모든 작업에 대한 규칙 시행

프로그래머블 NFT의 가장 중요한 기능 중 하나는 자산에 영향을 미치는 모든 작업에 대해 규칙 세트를 시행할 수 있는 능력입니다. 전체 인증 레이어는 [Token Auth Rules](/ko/smart-contracts/token-auth-rules)라고 불리는 또 다른 Metaplex 프로그램에서 제공됩니다. 그 프로그램이 pNFT를 프로그래머블하게 만드는 데 사용되지만, 모든 사용 사례에 대한 인증 규칙을 생성하고 검증하는 데 사용할 수 있는 일반적인 프로그램입니다.

pNFT의 경우, 다음 작업들이 지원됩니다:

| 작업                         | 설명                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Transfer:Owner`             | pNFT 소유자가 시작한 전송                                                                                                                                           |
| `Transfer:SaleDelegate`      | [Sale delegate](/ko/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only)가 시작한 전송                                                                                            |
| `Transfer:TransferDelegate`  | [Transfer](/ko/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only) 또는 [Locked Transfer](/ko/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) delegate가 시작한 전송 |
| `Transfer:MigrationDelegate` | Migration delegate가 시작한 전송 (pNFT 마이그레이션 기간 동안 사용된 레거시 delegate)                                                                                    |
| `Transfer:WalletToWallet`    | 지갑 간 전송 (현재 사용되지 않음)                                                                                                                                       |
| `Delegate:Sale`              | [Sale delegate](/ko/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only) 승인                                                                                                          |
| `Delegate:Transfer`          | [Transfer delegate](/ko/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only) 승인                                                                                                  |
| `Delegate:LockedTransfer`    | [Locked Transfer delegate](/ko/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) 승인                                                                                    |
| `Delegate:Utility`           | [Utility delegate](/ko/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only) 승인                                                                                                    |
| `Delegate:Staking`           | [Staking delegate](/ko/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only) 승인                                                                                                    |

크리에이터는 이러한 작업 중 어느 것에든 사용자 정의 **Rule**을 할당할 수 있습니다. 해당 작업이 수행될 때, Token Metadata 프로그램은 작업이 진행되도록 허용하기 전에 규칙이 유효한지 확인합니다. 사용 가능한 규칙은 Token Auth Rules 프로그램에 의해 직접 문서화되지만, 두 가지 유형의 규칙이 있다는 것을 주목할 가치가 있습니다:

- **원시 규칙**: 이러한 규칙은 작업이 허용되는지 여부를 명시적으로 알려줍니다. 예를 들어: `PubkeyMatch` 규칙은 주어진 필드의 공개 키가 주어진 공개 키와 일치하는 경우에만 통과합니다; `ProgramOwnedList`는 주어진 필드에서 계정을 소유하는 프로그램이 주어진 프로그램 목록의 일부인 경우에만 통과합니다; `Pass` 규칙은 항상 통과합니다; 등등.
- **복합 규칙**: 이러한 규칙은 여러 규칙을 집계하여 더 복잡한 인증 로직을 만듭니다. 예를 들어: `All` 규칙은 포함된 모든 규칙이 통과하는 경우에만 통과합니다; `Any` 규칙은 포함된 규칙 중 적어도 하나가 통과하는 경우에만 통과합니다; `Not` 규칙은 포함된 규칙이 통과하지 않는 경우에만 통과합니다; 등등.

작업에 대한 모든 규칙이 정의되면, Token Auth Rules 프로그램의 **Rule Set** 계정에 저장할 수 있습니다. 이 Rule Set에 변경이 필요할 때마다, 새로운 **Rule Set Revision**이 Rule Set 계정에 추가됩니다. 이는 특정 리비전 내에 현재 잠겨있는 모든 pNFT가 최신 리비전으로 이동하기 전에 잠금 해제될 수 있도록 보장합니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="41" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #ruleset-revision label="Rule Set Revision" theme="orange" z=1 /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-80" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" theme="orange" z=1 /%}
{% /node %}

{% node parent="metadata" x="-260" %}
{% node #ruleset label="Rule Set Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% node label="Header" /%}
{% node label="Rule Set Revision 0" /%}
{% node #ruleset-revision-1 label="Rule Set Revision 1" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" fromPosition="top" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" path="straight" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" dashed=true arrow="none" animated=true /%}
{% edge from="ruleset-revision" to="ruleset-revision-1" dashed=true arrow="none" animated=true toPosition="left" /%}
{% /diagram %}

## 사용 사례: 로열티 시행

이제 pNFT를 조금 더 잘 이해했으니, pNFT로 해결할 수 있는 구체적인 사용 사례를 살펴보겠습니다: 로열티 시행.

위에서 언급했듯이, pNFT 없이는 누구든지 SPL Token 프로그램과 직접 상호작용하여 **Metadata** 계정에 저장된 로열티 비율을 우회할 수 있습니다. 이는 크리에이터가 자신의 자산과 상호작용하는 사용자와 프로그램의 선의에 의존해야 함을 의미합니다.

그러나 pNFT를 사용하면, 크리에이터는 **로열티를 시행하지 않는 프로그램이 자신의 자산에 대한 전송을 수행하는 것을 금지하도록** 보장하는 **Rule Set**을 설계할 수 있습니다. 그들은 규칙의 조합을 사용하여 필요에 따라 허용 목록이나 거부 목록을 만들 수 있습니다.

또한, Rule Set은 여러 pNFT 간에 공유되고 재사용될 수 있으므로, 크리에이터는 **커뮤니티 Rule Set**을 만들고 공유하여 로열티 지원을 중단하는 프로그램이 그러한 커뮤니티 Rule Set을 사용하는 모든 pNFT와의 상호작용에서 즉시 차단되도록 할 수 있습니다. 이는 프로그램이 로열티를 지원하도록 하는 강력한 인센티브를 만듭니다. 그렇지 않으면 수많은 자산과의 상호작용에서 차단될 것이기 때문입니다.
