---
title: 개요
metaTitle: 개요 | Token Metadata
description: Solana NFT 표준에 대한 고수준 개요를 제공합니다.
---

Token Metadata 프로그램은 Solana 블록체인에서 NFT와 대체 가능한 자산을 다룰 때 기본이 되는 프로그램입니다. 이 개요에서는 이 프로그램이 무엇을 하는지, 그리고 다양한 기능을 어떻게 활용할 수 있는지를 높은 수준에서 설명합니다. {% .lead %}

{% callout %}
Please note that certain Token Metadata instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="token-metadata" /%}

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/smart-contracts/token-metadata/getting-started" description="원하는 언어나 라이브러리를 찾아 Solana에서 디지털 자산을 시작해보세요." /%}

{% quick-link title="API 레퍼런스" icon="CodeBracketSquare" href="https://mpl-token-metadata.typedoc.metaplex.com/" target="_blank" description="특정한 것을 찾고 계신가요? API 레퍼런스를 살펴보고 답을 찾아보세요." /%}

{% /quick-links %}

## 소개

Token Metadata 프로그램은 Solana 블록체인에서 NFT를 다룰 때 가장 중요한 프로그램 중 하나입니다. 이 프로그램의 주요 목표는 **Solana의 [대체 가능한](https://en.wikipedia.org/wiki/Fungibility) 또는 대체 불가능한 [토큰](https://spl.solana.com/token)에 추가 데이터를 첨부하는 것**입니다.

이는 Mint 계정의 주소에서 _파생된_ [Program Derived Addresses](/ko/solana/understanding-programs#program-derived-addresses-pda) (PDA)를 사용하여 달성됩니다. [Solana의 Token 프로그램](https://spl.solana.com/token)에 익숙하지 않으시다면, _Mint 계정_은 토큰의 전역 정보를 저장하는 역할을 하고 _Token 계정_은 지갑과 Mint 계정 간의 관계를 저장합니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="누군가의 지갑." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="token" theme="transparent" %}
지갑이 소유한 토큰의 \
수량을 다른 것들과 \
함께 저장합니다.
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="mint" theme="transparent" %}
토큰 자체에 대한 정보를 \
저장합니다. 예: 현재 \
공급량과 권한.
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}

{% /diagram %}

Mint 계정에는 현재 공급량과 같은 몇 가지 데이터 속성이 포함되어 있지만, 앱과 마켓플레이스에서 이해할 수 있는 표준화된 데이터를 주입할 수 있는 기능은 제공하지 않습니다.

이것이 바로 Token Metadata 프로그램이 PDA를 통해 Mint 계정에 자신을 첨부하는 **Metadata 계정**을 제공하는 이유입니다.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}

{% /diagram %}

이 Metadata 계정은 생태계 전반에서 사용할 수 있는 많은 귀중한 정보를 보유하고 있습니다. 예를 들어, 토큰의 크리에이터 목록을 유지 관리합니다. 각 크리에이터는 `True`일 때 해당 크리에이터가 토큰에 서명했음을 보장하는 `Verified` 속성을 가지고 있습니다. 각 크리에이터는 또한 마켓플레이스에서 로열티를 분배하는 데 사용할 수 있는 `Share` 속성을 가지고 있습니다.

Mint 계정에 더 많은 데이터를 첨부함으로써, **Token Metadata 프로그램은 일반적인 온체인 토큰을 디지털 자산으로 만들 수 있습니다**.

## JSON 표준

Metadata 계정의 중요한 속성 중 하나는 오프체인 JSON 파일을 가리키는 `URI` 속성입니다. 이는 온체인 데이터 저장과 관련된 수수료에 제약을 받지 않으면서 안전하게 추가 데이터를 제공하는 데 사용됩니다. 이 JSON 파일은 [특정 표준](/ko/smart-contracts/token-metadata/token-standard)을 따르며 누구나 토큰에 대한 유용한 정보를 찾는 데 사용할 수 있습니다.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node #uri label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
오프체인 \
JSON 메타데이터
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

이 JSON 파일은 업데이트할 수 없도록 보장하기 위해 Arweave와 같은 영구 저장 솔루션을 사용하여 저장할 수 있습니다. 또한 Metadata 계정의 `Is Mutable` 속성을 사용하여 불변으로 만들고, 따라서 `URI` 속성과 `Name` 및 `Creators`와 같은 다른 속성들이 변경되는 것을 금지할 수 있습니다. 이 조합을 사용하면 오프체인 JSON 파일의 불변성을 보장할 수 있습니다.

## NFT

이것이 NFT와 무슨 관련이 있는지 궁금할 수 있습니다. NFT는 대체 불가능한 특별한 토큰입니다.

더 정확히 말하면, Solana의 NFT는 다음과 같은 특성을 가진 Mint 계정입니다:

- **공급량이 1**이며, 이는 오직 하나의 토큰만 유통된다는 의미입니다.
- **소수점이 0**이며, 이는 0.5 토큰과 같은 것이 존재할 수 없다는 의미입니다.
- **민트 권한이 없으며**, 이는 누구도 추가 토큰을 민트할 수 없다는 의미입니다.

결국 우리가 얻는 것은 같은 종류의 다른 것과 거래할 수 없는 토큰이며, 이것이 바로 대체 불가능한 토큰(NFT)의 정의입니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = None" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% /diagram %}

이 특별하지만 인기 있는 경우에, Metadata 계정의 목표는 해당 NFT의 실제 데이터를 제공하여 유용한 디지털 자산으로 만드는 것입니다.

또한 Token Metadata 프로그램은 NFT를 위해 특별히 **Master Edition 계정**이라는 또 다른 계정을 제공합니다. 이 계정도 Mint 계정에서 파생된 PDA입니다.

이 계정을 생성하기 전에, Token Metadata 프로그램은 위에 나열된 대체 불가능한 토큰의 특별한 특성이 충족되는지 확인합니다. 그러나 주목할 점은 Mint Authority를 무효화하는 대신, Token Metadata 프로그램을 거치지 않고는 누구도 토큰을 민트하거나 동결할 수 없도록 보장하기 위해 Mint Authority와 Freeze Authority를 모두 Master Edition PDA로 이전한다는 것입니다. [이 결정이 내려진 이유에 대해 FAQ에서 더 자세히 읽을 수 있습니다](/ko/smart-contracts/token-metadata/faq#why-are-the-mint-and-freeze-authorities-transferred-to-the-edition-pda).

따라서 **Master Edition 계정의 존재는 해당 Mint 계정에 대한 대체 불가능성의 증거 역할을 합니다**.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-240" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% /diagram %}

## 에디션 인쇄

대체 불가능성 증거가 되는 것 외에도, Master Edition 계정은 사용자가 NFT의 하나 또는 여러 복사본을 인쇄할 수 있게 해줍니다.

이 기능은 자신의 1/1 NFT의 여러 복사본을 관객에게 제공하고자 하는 크리에이터에게 특히 유용합니다.

Master Edition 계정에는 이런 방식으로 인쇄할 수 있는 NFT의 최대 수량을 지정하는 선택적 `Max Supply` 속성이 포함되어 있습니다. `0`으로 설정되면 인쇄가 비활성화됩니다. `None`으로 설정되면 무제한 복사본을 인쇄할 수 있습니다.

Original NFT라고도 하는 Master Edition NFT는 복사본(Print NFT라고도 함)을 인쇄하는 데 사용할 수 있는 마스터 레코드 역할을 합니다.

각 Print NFT는 자체 Mint 계정과 Original NFT에서 데이터가 복사된 자체 Metadata 계정으로 구성됩니다. 그러나 Mint 계정에 Master Edition 계정이 첨부되는 대신, Print NFT는 **Edition 계정**이라는 또 다른 PDA 계정을 사용합니다. 이 계정은 에디션 번호와 그것이 유래한 부모 Master Edition을 추적합니다.

Master Edition 계정과 Edition 계정은 PDA에 대해 동일한 시드를 공유한다는 점에 주목하세요. 이는 NFT가 둘 중 하나일 수는 있지만 둘 다일 수는 없다는 의미입니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-160" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## 반-대체 가능한 토큰

NFT가 Token Metadata 프로그램의 가장 큰 사용 사례이지만, 이 프로그램이 대체 가능한 토큰과 우리가 반-대체 가능한 토큰 또는 대체 가능한 자산이라고 부르는 것들과도 작동한다는 점에 주목하는 것이 중요합니다.

결국 Metadata 계정은 대체 가능성에 관계없이 토큰에 데이터를 첨부하는 데 도움이 됩니다. 그러나 오프체인 JSON 파일의 표준은 그들의 필요에 맞게 약간 다를 것입니다.

토큰의 대체 가능성을 안전하게 식별하고, 따라서 사용해야 하는 표준을 식별하기 위해, Metadata 계정은 `Token Standard` 속성에서 해당 정보를 추적합니다. 이 속성은 프로그램에 의해 자동으로 계산되며 수동으로 업데이트할 수 없습니다. 다음 값을 가질 수 있습니다.

- `NonFungible`: Mint 계정이 Master Edition 계정과 연결되어 있으므로 대체 불가능합니다. 이것이 일반적인 NFT 표준입니다.
- `NonFungibleEdition`: 이는 `NonFungible`과 동일하지만 NFT가 Original NFT에서 인쇄되었으므로 Master Edition 계정 대신 Edition 계정과 연결되어 있습니다.
- `FungibleAsset`: Mint 계정은 대체 가능하지만 소수점 자리가 0입니다. 소수점이 0이라는 것은 토큰을 공급량이 1로 제한되지 않는 자산으로 취급할 수 있다는 의미입니다. 예를 들어, 대체 가능한 자산은 게임 산업에서 "Wood"나 "Iron"과 같은 리소스를 저장하는 데 사용할 수 있습니다.
- `Fungible`: Mint 계정은 대체 가능하며 소수점 자리가 1개 이상입니다. 이는 분산 통화로 사용될 가능성이 높은 토큰입니다.
- `ProgrammableNonFungible`: 맞춤형 승인 규칙을 적용하기 위해 항상 동결되어 있는 특별한 `NonFungible` 토큰입니다. 자세한 내용은 다음 섹션을 참조하세요.

[토큰 표준](/ko/smart-contracts/token-metadata/token-standard)에 대해 더 자세히 읽을 수 있습니다.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

## 프로그래머블 NFT {% #pnfts %}

Token Metadata 프로그램이 Solana Token 프로그램 위에 구축되기 때문에, 누구나 Token Metadata 프로그램을 거치지 않고 토큰(대체 가능하거나 그렇지 않은)을 전송할 수 있습니다. 이는 프로그램 조합성에는 좋지만, Token Metadata 프로그램이 자신이 첨부된 토큰에 대한 규칙을 적용할 수 없다는 의미이기도 합니다.

이것이 문제가 될 수 있는 좋은 예는 Token Metadata가 2차 판매 로열티를 적용할 수 없다는 것입니다. Metadata 계정에 **Seller Fee Basis Points** 속성이 있지만, 이는 순전히 [지시적](/ko/solana/understanding-programs#indicative-fields)이며 누구나 로열티를 존중하지 않는 마켓플레이스를 만들 수 있습니다 — 그리고 실제로 그런 일이 일어났습니다.

**프로그래머블 NFT**는 이 문제를 해결하기 위해 도입되었습니다. 이들은 **기본 토큰 계정을 항상 동결 상태로 유지하는** 새로운 _옵트인_ 토큰 표준입니다. 이런 방식으로 Token Metadata 프로그램을 거치지 않고는 누구도 프로그래머블 NFT를 전송, 잠금 또는 소각할 수 없습니다.

그런 다음 크리에이터가 Token Metadata 프로그램에 의해 적용될 맞춤형 작업별 승인 규칙을 정의하는 것은 크리에이터의 몫입니다. 이들은 Metadata 계정에 첨부된 특별한 **RuleSet** 계정에 정의됩니다. 이러한 RuleSet의 예로는 로열티를 존중하는 프로그램 주소의 허용 목록이 있을 수 있습니다. RuleSet은 [Token Auth Rules](/ko/smart-contracts/token-auth-rules)라는 새로운 Metaplex 프로그램의 일부입니다.

[프로그래머블 NFT](/ko/smart-contracts/token-metadata/pnfts)에 대해 더 자세히 읽을 수 있습니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="State = Frozen" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-120" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-230" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" /%}
{% /node %}

{% node parent="metadata" x="-260" y="0" %}
{% node #ruleset label="RuleSet Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" arrow="none" dashed=true /%}
{% /diagram %}

## 그리고 더 많은 것들

이것이 Token Metadata 프로그램과 그것이 제공하는 것에 대한 좋은 개요를 제공하지만, 여전히 할 수 있는 일이 훨씬 더 많습니다.

이 문서의 다른 페이지들은 이를 더 자세히 문서화하고 중요한 기능들을 각각의 개별 페이지에서 설명하는 것을 목표로 합니다.

- [토큰 표준 (자산)](/ko/smart-contracts/token-metadata/token-standard)
- [자산 민팅](/ko/smart-contracts/token-metadata/mint)
- [자산 업데이트](/ko/smart-contracts/token-metadata/update)
- [자산 전송](/ko/smart-contracts/token-metadata/transfer)
- [자산 소각](/ko/smart-contracts/token-metadata/burn)
- [인쇄된 에디션](/ko/smart-contracts/token-metadata/print)
- [검증된 컬렉션](/ko/smart-contracts/token-metadata/collections)
- [검증된 크리에이터](/ko/smart-contracts/token-metadata/creators)
- [위임된 권한](/ko/smart-contracts/token-metadata/delegates)
- [자산 잠금](/ko/smart-contracts/token-metadata/lock)
- [프로그래머블 NFT](/ko/smart-contracts/token-metadata/pnfts)
- [NFT 에스크로](/ko/smart-contracts/token-metadata/escrow)
