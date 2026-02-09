---
title: FAQ
metaTitle: FAQ | Token Metadata
description: Token Metadata에 대한 자주 묻는 질문
---

## `getProgramAccounts`를 사용하여 `creators` 배열 이후에 위치한 필드로 메타데이터 계정을 필터링하는 방법은?

[RPC API의 `getProgramAccounts` 메서드](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts)를 사용할 때, `memcmp` 필터를 사용하여 필드별로 계정을 필터링하고 싶은 경우가 일반적입니다.

`memcmp` 필터는 바이트 배열을 비교하므로, 이 접근 방식은 계정의 데이터 구조에 대한 지식이 필요합니다. 또한 찾고자 하는 필드의 위치를 모든 단일 계정에 대해 찾을 수 있도록 해당 데이터 구조의 길이가 고정되어야 합니다.

불행히도, **메타데이터 계정**의 `creators` 필드는 1명에서 5명의 크리에이터를 포함할 수 있는 벡터입니다. 이는 그 이후의 모든 필드의 위치가 계정이 가진 크리에이터의 수에 따라 달라진다는 의미입니다.

중대한 변경 없이 계정에 새 필드를 추가하려면 계정에 선택적 필드를 추가해야 한다는 점에 주목하세요. 이는 불행히도 메타데이터 계정에 추가할 수 있는 새로운 기능이 `creators` 필드 이후에 위치하게 되어 `getProgramAccounts`를 통한 필터링이 어려워진다는 것을 의미합니다.

이 문제를 해결하는 몇 가지 방법이 있습니다:

- 필터링하려는 모든 단일 계정이 **동일한 수의 크리에이터**를 가지고 있다면, 다음 필드의 오프셋을 알아낼 수 있습니다. `creators` 오프셋에 `4 + 34 * n`을 추가하여 이를 수행할 수 있습니다. 여기서 `n`은 고정된 크리에이터 수이고 `4`는 벡터의 길이를 저장하는 데 4바이트가 사용되기 때문입니다. 이는 `creators` 필드 이후에 있는 고정 길이의 모든 필드에 대해 문제를 해결합니다. 불행히도 다른 벡터나 선택적 필드와 같은 가변 크기의 다른 필드에 도달하자마자 문제가 다시 발생합니다. 따라서 이 솔루션은 필터링하려는 필드 이전의 모든 가변 필드의 정확한 길이를 알고 있는 경우에만 유효합니다.
- 또 다른 솔루션은 **트랜잭션을 크롤링하여 찾고 있는 계정을 찾는 것**입니다. 이 접근 방식은 조금 더 복잡하고 우리의 필요에 맞는 맞춤형 절차를 구현해야 합니다. 예를 들어, `getSignaturesForAddress`를 사용하여 계정과 연관된 모든 트랜잭션을 가져온 다음, 각각에 대해 `getTransaction`을 사용하여 트랜잭션 데이터에 액세스한 후 우리의 사용 사례에 중요한 것들을 필터링할 수 있습니다. 새로운 명령어를 위해 폐기될 수 있는 명령어에 의존하게 될 수 있으므로 이 접근 방식이 가장 미래 보장적인 솔루션이 아닐 수 있다는 점도 고려할 가치가 있습니다.
- 마지막으로, **가장 견고한 솔루션은 [Geyser 플러그인](https://docs.solana.com/developing/plugins/geyser-plugins)을 사용하여 찾고 있는 데이터를 인덱싱하는 것**입니다. 이는 현재 상당한 설정이 필요하지만, Solana 블록체인의 데이터를 미러링하는 신뢰할 수 있는 데이터 저장소를 얻게 됩니다. 이는 필터링 문제를 해결할 뿐만 아니라 데이터에 액세스하는 훨씬 더 편리하고 효율적인 방법을 제공합니다.

## 컬렉션별로 메타데이터 계정을 필터링하는 방법은?

위 질문에서 언급했듯이, `creators` 배열 이후에 있는 필드로 필터링하는 것은 고정 크기 필드가 아니기 때문에 어려운 작업입니다. 컬렉션 민트를 얻는 가장 빠르고 쉬운 방법으로 DAS를 사용하는 것을 권장합니다. 체인에서 직접 데이터를 가져오고 싶다면 다음 방법을 사용할 수 있지만, 컬렉션의 모든 NFT를 가져오는 세 가지 다른 방법을 보여주는 [가이드](/ko/smart-contracts/token-metadata/guides/get-by-collection)가 있습니다.

## 소울바운드 자산을 만드는 방법은?

{% callout type="note" %}
새로운 프로젝트의 경우, 더 간단하고 효율적인 접근 방식을 제공하는 [Metaplex Core](/smart-contracts/core)를 소울바운드 NFT에 사용하는 것을 권장합니다. 자세한 내용은 [소울바운드 NFT 자산 생성 가이드](/smart-contracts/core/guides/create-soulbound-nft-asset)를 참조하세요.
{% /callout %}

Token Metadata를 사용하여 소울바운드 자산을 만들 수 있습니다. 이를 달성하는 가장 좋은 방법은 `non-transferrable` 토큰 확장과 함께 Token22를 기본 SPL 토큰으로 사용하는 것입니다.

{% totem %}
{% totem-accordion title="코드 예제 보기" %}

{% code-tabs-imported from="token-metadata/soulbound" frameworks="umi,kit" /%}

{% /totem-accordion %}
{% /totem %}

TokenKeg SPL 토큰을 사용해야 하는 경우, pNFT에서 [Locked Transfer 위임자](/ko/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only)를 사용한 다음 pNFT를 잠가서 소울바운드 자산을 만들 수 있습니다. 그러나 이는 소유자가 pNFT를 전송하는 것을 방지할 뿐만 아니라 소유자가 소각하는 것도 방지한다는 점에 주목하세요. 이것이 소울바운드 자산에 Token22 토큰을 사용하는 것을 권장하는 이유입니다.

## 민트 및 동결 권한이 Edition PDA로 이전되는 이유는?

우리가 자주 받는 질문 중 하나는: NFT를 생성할 때 Token Metadata 프로그램이 Mint 계정의 `Mint Authority`와 `Freeze Authority`를 Edition PDA로 이전하는 이유는 무엇인가요? 그냥 `None`으로 설정해서 무효화하지 않는 이유는 무엇인가요?

이 두 권한에 대해 각각 왜 그런지 살펴보겠습니다.

### Mint Authority

Mint Authority를 제어하는 것은 토큰의 대체 불가능성을 보장하는 데 중요한 단계입니다. 이 보호 없이는 누군가가 주어진 NFT에 대해 더 많은 토큰을 민팅하여 NFT를 대체 가능하게 만들 수 있습니다.

이를 방지하는 한 가지 방법은 Mint Authority를 `None`으로 설정하여 누구도 해당 NFT에 대해 더 많은 토큰을 민팅할 수 없도록 보장하는 것입니다. 그러나 Token Metadata 프로그램은 해당 권한을 Master Edition 계정 또는 Edition 계정과 연결되는 Edition PDA로 설정합니다.

**하지만 왜 그럴까요?** 간단한 답은: **훨씬 낮은 비용으로 Token Metadata 프로그램에 업그레이드를 배포할 수 있기 때문**입니다.

Mint Authority를 잃는 것은 되돌릴 수 없는 작업이므로 NFT를 새 버전으로 마이그레이션하는 데 이를 활용할 수 없습니다. 예를 들어, Original과 Printed NFT가 구조화되는 방식을 변경하고, Edition 계정 대신 토큰을 활용하고 싶다고 가정해보겠습니다. Mint Authority 없이는 NFT를 새 버전으로 마이그레이션하는 것이 단순히 불가능할 것입니다.

**이 권한을 잃는 것은 향후 구현하고 싶은 기능과 변경 사항의 범위를 제한할 것**이고, 그래서 우리는 이를 `None`으로 설정하지 않습니다.

그러나 이것이 누군가가 해당 Mint Authority를 사용하여 NFT에 더 많은 토큰을 민팅할 수 있다는 의미는 아닙니다. Mint Authority는 누군가의 공개 키로 이전되지 않고, Token Metadata 프로그램에 속하는 PDA로 이전됩니다. 따라서 프로그램에서 제공하는 명령어만이 이를 사용할 수 있으며, 그러한 명령어는 프로그램에 존재하지 않습니다. Token Metadata 프로그램이 완전히 오픈 소스이므로 누구나 이를 검사하여 Mint Authority가 더 많은 토큰을 민팅하는 데 사용되지 않음을 확인할 수 있다는 점이 중요합니다.

### Freeze Authority

Freeze Authority를 제어하면 Token 계정을 동결하여 해당 계정이 해동될 때까지 불변으로 만들 수 있습니다.

이 권한이 Token Metadata 프로그램의 Edition PDA로 이전되는 한 가지 이유는 Mint Authority와 마찬가지로 잠재적인 새로운 기능과 업그레이드의 범위를 증가시키기 때문입니다.

그러나 Mint Authority와 달리, 우리는 실제로 프로그램에서 해당 권한을 사용합니다.

`FreezeDelegatedAccount`와 `ThawDelegatedAccount` 명령어는 Freeze Authority를 사용하는 유일한 명령어입니다. 이들은 Token 계정의 위임자가 해당 Token 계정을 동결(및 해동)하여 우리가 "**전송 불가능한 NFT**"라고 부르는 것을 만들 수 있게 해줍니다. 이는 에스크로 없는 마켓플레이스에 상장되어 있는 동안 누군가가 NFT를 판매하는 것을 방지하는 등 다양한 사용 사례를 가능하게 합니다.

## 메타데이터 계정이 온체인과 오프체인 데이터를 모두 가지는 이유는?

**메타데이터 계정**은 온체인 데이터를 포함하지만, 추가 데이터를 제공하는 오프체인 JSON 파일을 가리키는 `URI` 속성도 가지고 있습니다. 그렇다면 왜 그럴까요? 모든 것을 온체인에 저장할 수는 없을까요? 그에는 몇 가지 문제가 있습니다:

- 온체인에 데이터를 저장하려면 임대료를 지불해야 합니다. NFT의 설명과 같은 긴 텍스트를 포함할 수 있는 모든 것을 메타데이터 계정 내에 저장해야 한다면, 훨씬 더 많은 바이트가 필요하고 NFT 민팅이 갑자기 훨씬 더 비싸질 것입니다.
- 온체인 데이터는 훨씬 덜 유연합니다. 특정 구조를 사용하여 계정이 생성되면 쉽게 변경할 수 없습니다. 따라서 모든 것을 온체인에 저장해야 한다면, NFT 표준이 생태계의 요구에 따라 진화하기가 훨씬 어려울 것입니다.

따라서 데이터를 온체인과 오프체인 데이터로 나누는 것은 온체인 데이터는 프로그램이 **사용자를 위한 보장과 기대를 만드는 데** 사용할 수 있고, 오프체인 데이터는 **표준화되었지만 유연한 정보를 제공하는 데** 사용할 수 있는 두 세계의 장점을 모두 얻을 수 있게 해줍니다.

## Token Metadata를 사용하는 데 비용이 있나요?

Token Metadata는 현재 특정 명령어 호출자에게 0.001 SOL에서 0.01 SOL 사이의 매우 작은 수수료를 부과합니다. 자세한 내용은 [프로토콜 수수료 페이지](/protocol-fees)에서 확인할 수 있습니다.

## 폐기된 명령어는 어디에서 찾을 수 있나요?

Token Metadata 프로그램의 일부 명령어는 몇 번의 반복을 거쳐 새로운 것들을 위해 폐기되었습니다. 폐기된 명령어는 여전히 프로그램에서 사용할 수 있지만 더 이상 프로그램과 상호 작용하는 권장 방법이 아니므로 Developer Hub에서 문서화되지 않습니다. 그렇긴 하지만, 폐기된 명령어를 찾고 있다면 Token Metadata 프로그램 저장소에서 찾을 수 있습니다. 다음은 그 목록입니다:

- [CreateMetadataAccountV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L448)는 [CreateV1](/ko/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts)로 대체되었습니다.
- [UpdateMetadataAccountV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L241)는 [CreateV1](/ko/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts)로 대체되었습니다.
- [UpdatePrimarySaleHappenedViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L112)
- [SignMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L146) 대신 [Verify](/ko/smart-contracts/token-metadata/collections)를 사용하세요.
- [RemoveCreatorVerification](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L388) 대신 [Unverify](/ko/smart-contracts/token-metadata/collections#unverify)를 사용하세요.
- [CreateMasterEditionV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L267)는 [CreateV1](/ko/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts)로 대체되었습니다.
- [MintNewEditionFromMasterEditionViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L202)는 [CreateV1](/ko/smart-contracts/token-metadata/mint#creating-mint-and-metadata-accounts)로 대체되었습니다.
- [ConvertMasterEditionV1ToV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L210)
- [PuffMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L236)
- [VerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L278) 대신 [Verify](/ko/smart-contracts/token-metadata/collections)를 사용하세요.
- [SetAndVerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L367) 대신 [Verify](/ko/smart-contracts/token-metadata/collections)를 사용하세요.
- [UnverifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L334) 대신 [Unverify](/ko/smart-contracts/token-metadata/collections#unverify)를 사용하세요.
- [Utilize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L296) - 사용 기능이 폐기되었습니다.
- [ApproveUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L311) - 사용 기능이 폐기되었습니다.
- [RevokeUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L324) - 사용 기능이 폐기되었습니다.
- [ApproveCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L346) 대신 [Delegate](/ko/smart-contracts/token-metadata/delegates)를 사용하세요.
- [RevokeCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L354) 대신 [Revoke](/ko/smart-contracts/token-metadata/delegates)를 사용하세요.
- [FreezeDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L375)
- [ThawDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383)
- [BurnNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383)는 [Burn](https://developers.metaplex.com/token-metadata/burn)으로 대체되었습니다.
- [BurnEditionNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L487)는 [Burn](https://developers.metaplex.com/token-metadata/burn)으로 대체되었습니다.
- [VerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L411) 크기가 지정된 컬렉션이 폐기되었습니다.
- [SetAndVerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L437) 크기가 지정된 컬렉션이 폐기되었습니다.
- [UnverifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L423) 크기가 지정된 컬렉션이 폐기되었습니다.
- [SetCollectionSize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L456) 크기가 지정된 컬렉션이 폐기되었습니다.
- [SetTokenStandard](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L464) 토큰 표준이 이제 자동으로 설정됩니다.

## Token Metadata 계정 크기 감소에 대해 어디서 더 자세히 알 수 있나요?
더 많은 정보는 [특별 FAQ](/ko/smart-contracts/token-metadata/guides/account-size-reduction)를 확인하거나 남은 질문이 있는 경우 [Discord](https://discord.gg/metaplex)에 참여하세요.
