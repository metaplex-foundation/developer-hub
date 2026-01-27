---
title: 자산 업데이트
metaTitle: 자산 업데이트 | Token Metadata
description: Token Metadata에서 자산을 업데이트하는 방법을 알아보세요
---

자산의 업데이트 권한은 **Is Mutable** 속성이 `true`로 설정되어 있는 한 **Update** 명령어를 사용하여 **Metadata** 계정을 업데이트할 수 있습니다. **Update** 명령어는 **업데이트 권한**이 트랜잭션에 서명하는 것을 요구하며 **Metadata** 계정의 다음 속성을 업데이트할 수 있습니다:

## 업데이트 가능한 필드

특정 위임된 권한도 "[위임된 권한](/ko/smart-contracts/token-metadata/delegates)" 페이지에서 논의된 바와 같이 자산의 **Metadata** 계정을 업데이트할 수 있다는 점에 주목하세요.

아래는 `UpdateV1` 명령어에서 업데이트할 수 있는 모든 개별 필드에 대한 설명입니다.

### 데이터 객체

자산의 이름, 심볼, URI, 판매자 수수료 기준점 및 크리에이터 배열을 정의하는 객체입니다. 업데이트 권한은 크리에이터 배열에서 확인되지 않은 크리에이터만 추가 및/또는 제거할 수 있다는 점에 주목하세요. 유일한 예외는 크리에이터가 업데이트 권한인 경우이며, 이 경우 추가되거나 제거된 크리에이터가 확인될 수 있습니다.

{% dialect-switcher title="데이터 객체" %}
{% dialect title="JavaScript" id="js" %}

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
pub struct DataV2 {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
}
```

{% /dialect %}

{% /dialect-switcher %}

### 1차 판매 발생

1차 판매 발생: 자산이 이전에 판매되었는지를 나타내는 불리언 값입니다.

{% dialect-switcher title="1차 판매 발생" %}
{% dialect title="JavaScript" id="js" %}

```ts
primarySaleHappened: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
primary_sale_happened: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### 변경 가능

자산을 다시 업데이트할 수 있는지를 나타내는 불리언 값입니다. 이를 false로 변경하면 향후 모든 업데이트가 실패합니다.

{% dialect-switcher title="변경 가능" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### 컬렉션

이 속성을 통해 자산의 컬렉션을 설정하거나 지울 수 있습니다. 새 컬렉션을 설정할 때 verified 불리언은 false로 설정되어야 하며 [다른 명령어를 사용하여 확인](/ko/smart-contracts/token-metadata/collections)되어야 한다는 점에 주목하세요.

#### 컬렉션 설정

{% dialect-switcher title="컬렉션 설정" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: Some( Collection {
  key: PubKey,
  verified: Boolean,
}),
```

{% /dialect %}
{% /dialect-switcher %}

#### 컬렉션 지우기

{% dialect-switcher title="컬렉션 지우기" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle("Clear"),
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: None,
```

{% /dialect %}
{% /dialect-switcher %}

### 새 업데이트 권한

`newUpdateAuthority` 필드를 전달하여 자산에 새로운 업데이트 권한을 할당할 수 있습니다.

{% dialect-switcher title="새 업데이트 권한" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
new_update_authority: Option<PubKey>,
```

{% /dialect %}
{% /dialect-switcher %}

### 프로그래머블 RuleSet

이 속성을 통해 자산의 규칙 세트를 설정하거나 지울 수 있습니다. 이는 [프로그래머블 대체 불가능](/ko/smart-contracts/token-metadata/pnfts)에만 관련이 있습니다.

{% dialect-switcher title="프로그래머블 RuleSet" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// Rust anchor-spl SDK에서 사용할 수 없음
```

{% /dialect %}
{% /dialect-switcher %}

다음은 SDK를 사용하여 Token Metadata에서 자산을 업데이트하는 방법입니다.

## 업데이트 권한으로 업데이트

### NFT 자산

이 예제는 자산의 업데이트 권한으로서 NFT 자산을 업데이트하는 방법을 보여줍니다.

{% code-tabs-imported from="token-metadata/update-nft" frameworks="umi,kit,anchor" /%}

### pNFT 자산

이 예제는 자산의 업데이트 권한으로서 프로그래머블 NFT (pNFT) 자산을 업데이트하는 방법을 보여줍니다.

`pNFT`는 명령어가 작동하기 위해 추가 계정을 전달해야 할 수 있습니다. 여기에는 tokenAccount, tokenRecord, authorizationRules, authorizationRulesProgram이 포함됩니다.

{% code-tabs-imported from="token-metadata/update-pnft" frameworks="umi,kit,anchor" /%}