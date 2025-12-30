---
title: 에디션 출력
metaTitle: 에디션 출력 | Token Metadata
description: Token Metadata에서 NFT 에디션을 출력하는 방법을 알아보세요
---

모든 NFT는 **Master Edition** 계정이 그에 따라 구성될 때 여러 에디션으로 출력될 가능성을 가지고 있습니다. 이 페이지에서는 출력 가능한 NFT를 만들고 그것으로부터 에디션을 출력하는 방법을 배우겠습니다.

## 출력 가능한 NFT

출력 가능한 NFT의 소유자는 최대 공급량에 도달하지 않는 한 원하는 만큼 많은 에디션을 출력할 수 있습니다.

모든 대체 불가능한 자산 — 즉, `NonFungible`과 `ProgrammableNonFungible` 토큰 표준 — 은 생성될 때 출력 가능한 NFT가 될 수 있습니다. 이는 자산의 Master Edition 계정의 **Max Supply** 속성을 구성함으로써 수행됩니다. 이 속성은 선택 사항이며 다음 값 중 하나를 가질 수 있습니다:

- `None`: NFT는 고정된 공급량을 갖지 않습니다. 즉, **NFT는 출력 가능하며 무제한 공급량을 갖습니다**.
- `Some(x)`: NFT는 `x` 에디션의 고정된 공급량을 갖습니다.
  - `x = 0`일 때, 이는 **NFT가 출력 가능하지 않음**을 의미합니다.
  - `x > 0`일 때, 이는 **NFT가 출력 가능하며 `x` 에디션의 고정된 공급량을 갖음**을 의미합니다.

출력 가능한 NFT로부터 새로운 출력된 에디션이 생성될 때마다, 몇 가지 일이 발생합니다:

- 완전히 새로운 에디션 NFT가 생성되고 그 데이터는 원본 NFT와 일치합니다. 유일한 차이점은 출력된 에디션이 원본 NFT와 다른 토큰 표준을 사용한다는 것입니다.
  - `NonFungible` 자산의 경우, 출력된 에디션은 `NonFungibleEdition` 토큰 표준을 사용합니다.
  - `ProgrammableNonFungible` 자산의 경우, 출력된 에디션은 `ProgrammableNonFungibleEdition` 토큰 표준을 사용합니다.
- **Master Edition** 계정을 사용하는 대신, 새로운 에디션 NFT는 부모 NFT의 **Master Edition** 계정의 주소를 저장함으로써 에디션 번호와 부모 NFT를 추적하는 **Edition** 계정을 사용합니다.
- Master Edition 계정의 **Supply** 속성이 1씩 증가합니다. **Supply** 속성이 **Max Supply** 속성에 도달하면, NFT는 더 이상 출력할 수 없습니다.

{% diagram height="h-64 md:h-[500px]" %}
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

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" theme="orange" z=1 /%}
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

## Master Edition NFT 설정하기

출력 가능한 NFT를 만들려면, Token Metadata 프로그램의 [**Create** 명령어](/ko/smart-contracts/token-metadata/mint#creating-accounts)의 **Print Supply** 속성을 구성해야 합니다. 이는 이전 섹션에서 본 것처럼 **Master Edition** 계정의 **Max Supply** 속성을 구성할 것입니다. 이 속성은 다음과 같을 수 있습니다:

- `Zero`: NFT는 출력할 수 없습니다.
- `Limited(x)`: NFT는 출력 가능하며 `x` 에디션의 고정된 공급량을 갖습니다.
- `Unlimited`: NFT는 출력 가능하며 무제한 공급량을 갖습니다.

다음은 SDK를 사용하여 출력 가능한 NFT를 만드는 방법입니다.

{% dialect-switcher title="Master Edition NFT 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft, printSupply } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My Master Edition NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  printSupply: printSupply('Limited', [100]), // 또는 printSupply('Unlimited')
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Master Edition NFT에서 에디션 출력하기

**Max Supply**에 도달하지 않은 출력 가능한 NFT가 있으면, 그것으로부터 새로운 에디션을 출력할 수 있습니다. 이는 Token Metadata 프로그램의 **Print** 명령어를 호출함으로써 수행됩니다. 이 명령어는 다음 속성을 허용합니다:

- **Master Edition Mint**: 출력 가능한 NFT의 Mint 계정 주소.
- **Edition Mint**: 새로운 에디션 NFT의 Mint 계정 주소. 이는 계정이 존재하지 않으면 명령어에 의해 생성될 것이므로 일반적으로 새로 생성된 Signer입니다.
- **Master Token Account Owner**: 출력 가능한 NFT의 소유자를 Signer로. 출력 가능한 NFT의 소유자만이 그것으로부터 새로운 에디션을 출력할 수 있습니다.
- **Edition Token Account Owner**: 새로운 에디션 NFT의 소유자 주소
- **Edition Number**: 출력할 새로운 에디션 NFT의 에디션 번호. 이는 일반적으로 **Master Edition** 계정의 현재 **Supply**에 1을 더한 값입니다.
- **Token Standard**: 출력 가능한 NFT의 토큰 표준. 이는 `NonFungible` 또는 `ProgrammableNonFungible`일 수 있습니다.

다음은 SDK를 사용하여 출력 가능한 NFT에서 새로운 에디션을 출력하는 방법입니다.

{% dialect-switcher title="Master Edition NFT 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  printV1,
  fetchMasterEditionFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

// (선택사항) 다음 에디션 번호를 민팅하기 위해 마스터 에디션 계정을 가져옵니다.
const masterEdition = await fetchMasterEditionFromSeeds(umi, {
  mint: masterEditionMint,
})

const editionMint = generateSigner(umi)
await printV1(umi, {
  masterTokenAccountOwner: originalOwner,
  masterEditionMint,
  editionMint,
  editionTokenAccountOwner: ownerOfThePrintedEdition,
  editionNumber: masterEdition.supply + 1n,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}