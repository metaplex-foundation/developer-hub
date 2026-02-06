---
title: 머클 트리를 활용한 토큰 클레이머 스마트 컨트랙트 만들기
metaTitle: 토큰 클레이머 스마트 컨트랙트 만들기 | Token Metadata 가이드
description: 머클 트리를 활용하고 Anchor를 사용하여 Solana에서 토큰 클레이머 스마트 컨트랙트를 만드는 방법을 배우세요!
# /components/guides/index.js의 날짜도 업데이트하는 것을 잊지 마세요
created: '01-13-2025'
updated: '01-13-2025'
---

이 가이드는 머클 트리와 압축을 활용하여 Anchor를 사용한 Token Metadata 토큰을 위한 저비용 토큰 클레이머를 만드는 방법을 다룹니다.

## 전제조건

토큰 클레이머의 작동 방식에 대해 배우기 시작하기 전에, 스마트 컨트랙트 내부에서 실제로 무슨 일이 일어나는지 이해하기 위해 압축과 머클 트리가 어떻게 작동하는지 살펴봐야 합니다.

### 머클 트리

머클 트리는 데이터 세트를 효율적으로 표현하는 데 사용되는 이진 트리입니다. 트리의 각 리프 노드는 개별 데이터(예: 주소와 토큰 양)의 해시입니다. 부모 노드는 자식 노드 쌍을 해싱하여 생성되며, 전체 데이터셋의 컴팩트하고 변조 방지된 표현 역할을 하는 루트에 도달할 때까지 트리 위로 계속됩니다.

**예제**: A, B, C, D 네 개의 데이터 항목이 있다고 가정합니다. 머클 트리 구조는 다음과 같이 구축됩니다:

- **리프 노드**: 각 항목이 해시됩니다:

```
Hash(A), Hash(B), Hash(C), Hash(D)
```

- **부모 노드**: 리프 노드 쌍이 결합되고 해시됩니다:

```
Parent1 = Hash(Hash(A) + Hash(B))
Parent2 = Hash(Hash(C) + Hash(D))
```

- **루트 노드**: 최종 해시가 부모 노드들로부터 계산됩니다:

```
Root = Hash(Parent1 + Parent2)
```

{% diagram %}

{% node #root label="Root Node" theme="slate" /%}
{% node #root-hash label="Hash" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="Node 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="Hash" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="Node 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="Node 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="Node 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="Hash" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="Node 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="Node 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="Leaf 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="Leaf 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="Leaf 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="Leaf 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="Leaf 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="Leaf 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="Leaf 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="Leaf 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT Data" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="Leaf 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="Node 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="Node 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="Proof" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="Hash" /%}

{% /diagram %}

머클 트리는 온체인 압축의 초석으로, 효율적이고 안전한 데이터 검증을 가능하게 합니다. 설계상 데이터셋의 어떤 부분을 변경하더라도 루트가 무효화되므로, 특정 항목의 무결성은 온체인에 머클 루트만 저장하고 루트를 재구성하는 데 필요한 최소한의 형제 해시 세트인 머클 증명을 제공함으로써 검증할 수 있습니다.

- **주요 장점**: 비용 효율적인 저장소: 머클 루트(32바이트)만 온체인에 저장되어 저장 비용을 크게 줄입니다. 검증은 머클 증명을 입력으로 전달하여 달성됩니다.
- **확장성**: 증명 크기는 항목 수에 대해 로그 증가하므로 이 방법은 대용량 데이터셋 관리에 이상적입니다.
- **프라이버시와 효율성**: 전체 머클 트리는 오프체인에서 생성하고 관리할 수 있어 전체 데이터셋을 비공개로 유지합니다. 압축 NFT와 같은 프로그램은 Solana의 noop 프로그램과 함께 이 접근법을 사용하여 프라이버시를 유지하면서 성능을 최적화합니다.

### 동시 머클 트리

Solana의 상태 압축은 트리의 무결성과 유효성을 유지하면서 트리에 대한 여러 변경을 가능하게 하는 독특한 유형의 머클 트리를 사용합니다.

동시 머클 트리라고 하는 이 특수한 트리는 온체인 변경 로그를 유지하여 증명을 무효화하지 않고 동일한 트리에 대한 여러 빠른 업데이트(예: 모두 동일한 블록 내에서)를 허용합니다.

이 기능은 블록당 계정당 하나의 작성자만 허용되는 Solana에서 필수적입니다. 이는 업데이트를 블록당 단일 변경으로 제한하므로 런타임이 계정의 보안을 보장하고 손상을 방지할 수 있습니다. 모든 작업에는 쓰기가 필요하므로 동시 머클 트리는 동일한 블록 내에서 여러 업데이트를 원활하게 관리하는 효율적인 솔루션을 제공합니다.

## 설정

- 선택한 코드 에디터 (**Rust Analyzer 플러그인**이 있는 **Visual Studio Code** 권장)
- Anchor **0.30.1** 이상.

또한 이 가이드에서는 필요한 모든 매크로를 `lib.rs` 파일에서 찾을 수 있는 **Anchor**에 대한 모노 파일 접근법을 활용할 것입니다:

- `declare_id`: 프로그램의 온체인 주소를 지정합니다.
- `#[program]`: 프로그램의 명령어 로직을 포함하는 모듈을 지정합니다.
- `#[derive(Accounts)]`: 명령어에 필요한 계정 목록을 나타내는 구조체에 적용됩니다.
- `#[account]`: 프로그램에 특정한 사용자 정의 계정 유형을 만들기 위해 구조체에 적용됩니다.

**참고**: 필요에 맞게 함수를 수정하고 이동해야 할 수 있습니다.

### 프로그램 초기화

`avm`(Anchor Version Manager)을 사용하여 새 프로젝트를 초기화하는 것으로 시작합니다(선택사항). 초기화하려면 터미널에서 다음 명령어를 실행하세요:

```
anchor init token-claimer-example
```

### 필요한 크레이트

이 가이드에서는 SVM용 머클 트리를 만들고 관리하기 위한 최적화된 버전인 `svm_merkle_tree` 크레이트를 사용합니다. 설치하려면 먼저 `token-claimer-example` 디렉토리로 이동하세요:

```
cd token-claimer-example
```

그런 다음 다음 명령어를 실행하여 머클 트리 크레이트를 설치하세요:

```
cargo add svm-merkle-tree --git https://github.com/deanmlittle/svm-merkle-tree
```

그리고 Token 프로그램과 상호작용하기 위해 anchor-spl을 설치하는 다음 명령어를 실행합니다:

```
cargo add anchor-spl
```

## 프로그램

{% callout %}

이 예제는 프로덕션에 적합한 본격적인 구현이 아닙니다. 프로덕션 준비를 위해서는 몇 가지 추가 구성 요소와 고려 사항이 필요합니다:

- **이벤트 방출**: `event!()` 매크로를 사용하여 성공적인 청구나 머클 루트 업데이트와 같은 중요한 작업에 대한 이벤트를 방출합니다. 또는 Solana의 noop 프로그램과 통합하여 업데이트를 기록하고 오프체인 애플리케이션의 데이터 인덱싱을 촉진할 수 있습니다.

- **데이터베이스 호스팅**: 완전한 머클 트리 데이터셋을 오프체인에 저장하고 호스팅하며 리프 및 내부 노드에 대한 해시를 파생시켜 머클 증명을 동적으로 생성하고 제공하며 청구에 대한 입력 일관성을 검증해야 합니다.

{% /callout %}

### 임포트와 템플릿

여기서는 이 특정 가이드의 모든 임포트를 정의하고 `lib.rs` 파일에서 계정 구조체와 명령어의 템플릿을 만들 것입니다.

```rust
use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}

use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

/// 프로그램 뒤의 명령어와 로직
#[program]
pub mod merkle_tree_token_claimer {
    use super::*;

    pub fn initialize_airdrop_data(
        ctx: Context<Initialize>,
        merkle_root: [u8; 32],
        amount: u64,
    ) -> Result<()> {

        Ok(())
    }

    pub fn update_tree(
        ctx: Context<Update>,
        new_root: [u8; 32]
    ) -> Result<()> {

        Ok(())
    }

    pub fn claim_airdrop(
        ctx: Context<Claim>,
        amount: u64,
        hashes: Vec<u8>,
        index: u64,
    ) -> Result<()> {

        Ok(())
    }

}

/// 다양한 명령어를 위한 계정 구조체
#[derive(Accounts)]
pub struct Initialize<'info> {

}

#[derive(Accounts)]
pub struct Update<'info> {

}

#[derive(Accounts)]
pub struct Claim<'info> {

}

/// 머클 트리와 에어드랍 정보를 보유하는 상태 계정
#[account]
pub struct AirdropState {

}

/// 프로그램용 오류
#[error_code]
pub enum AirdropError {

}
```

이것은 온체인 프로그램의 템플릿 역할을 하지만, 이 문서에서 자세히 다룰 상당한 프론트엔드 오버헤드도 고려해야 합니다.

### 머클 트리 초기화

청구 가능한 양을 포함한 사용자 데이터로 머클 트리를 초기화하는 것부터 시작합니다. 이 프로세스는 오프체인에서 수행되며, 여기서 트리의 루트를 계산하고 나중에 온체인에 업로드하여 무결성을 유지하면서 계산 비용을 줄입니다.

이 예제에서는 100개의 무작위 주소와 100개의 무작위 양을 생성하고 각 항목에 대해 `isClaimed` 플래그를 초기화하여 false로 설정합니다. 이러한 세부 정보는 머클 트리를 효율적으로 채우기 위해 이진 형식으로 직렬화되고, 방금 생성한 데이터를 머클화하여 루트를 생성합니다.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";

// 100개의 무작위 주소와 양 생성
let merkleTreeData = Array.from({ length: 100 }, () => ({
  address: Keypair.generate().publicKey,              // 예제 무작위 주소
  amount: Math.floor(Math.random() * 1000),           // 예제 무작위 양
  isClaimed: false,                                   // isClaimed의 기본값
}));

// 머클 트리 생성
let merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);

merkleTreeData.forEach((entry) => {
  // 주소, 양, isClaimed를 이진 형식으로 직렬화
  const entryBytes = Buffer.concat([
    entry.address.toBuffer(),
    Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
    Buffer.from([entry.isClaimed ? 1 : 0]),
  ]);
  merkleTree.add_leaf(entryBytes);
});

merkleTree.merklize();

const merkleRoot = Array.from(merkleTree.get_merkle_root());
```

온체인에서는 에어드랍 상태를 관리하고 추적하기 위한 `AirdropState` 계정을 정의합니다. 이 계정은 머클 트리 메커니즘을 기반으로 토큰을 안전하게 배포하는 데 필요한 핵심 정보를 보유합니다. 각 필드의 세부 분석은 다음과 같습니다:

```rust
#[account]
pub struct AirdropState {
    /// 현재 머클 루트
    pub merkle_root: [u8; 32],
    /// 머클 루트를 업데이트할 수 있는 권한
    pub authority: Pubkey,
    /// 에어드랍되는 토큰의 민트 주소
    pub mint: Pubkey,
    /// 에어드랍을 위해 할당된 총액
    pub airdrop_amount: u64,
    /// 지금까지 청구된 총액
    pub amount_claimed: u64,
    /// PDA 범프 시드
    pub bump: u8,
}
```

`initialize_airdrop_data` 명령어는 `AirdropState`를 채우고 `mint_authority`를 철회하기 전에 `vault`에 충분한 토큰을 민팅합니다.

```rust
pub fn initialize_airdrop_data(
  ctx: Context<Initialize>,
  merkle_root: [u8; 32],
  amount: u64,
) -> Result<()> {

  ctx.accounts.airdrop_state.set_inner(
    AirdropState {
      merkle_root,
      authority: ctx.accounts.authority.key(),
      mint: ctx.accounts.mint.key(),
      airdrop_amount: amount,
      amount_claimed: 0,
      bump: ctx.bumps.airdrop_state,
    }
  );

  mint_to(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
      }
    ),
    amount
  )?;

  set_authority(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
      }
    ),
    AuthorityType::MintTokens,
    None
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority,
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}
```

### 필요한 경우 온체인에서 머클 루트 업데이트

`AirdropState`의 `authority`가 온체인에서 루트를 변경할 수 있게 하는 `update_tree` 명령어를 만들 것입니다. 이는 새 사용자를 추가하거나 할당을 철회하는 데 사용할 수 있습니다.

이 예제에서는 무작위 주소에 대한 새로운 무작위 할당을 만들고 이 항목을 마지막 명령어에서 만든 머클 트리에 푸시합니다:

```typescript
const newData = {
  address: Keypair.generate().publicKey,
  amount: Math.floor(Math.random() * 1000),           // 예제 무작위 양
  isClaimed: false,                                   // isClaimed의 기본값
};

merkleTreeData.push(newData);

const entryBytes = Buffer.concat([
  newData.address.toBuffer(), // PublicKey를 바이트로
  Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 양을 리틀 엔디안으로
  Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed를 1바이트로
]);

merkleTree.add_leaf(entryBytes);

merkleTree.merklize();

const newMerkleRoot = Array.from(merkleTree.get_merkle_root());
```

그러면 이런 식으로 루트를 쉽게 업데이트할 수 있습니다:

```rust
pub fn update_tree(
  ctx: Context<Update>,
  new_root: [u8; 32]
) -> Result<()> {

  ctx.accounts.airdrop_state.merkle_root = new_root;

  Ok(())
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut,
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}
```

`has_one` 제약을 사용하여 제공된 권한을 `AirdropState`에 저장된 권한과 비교하므로 이 변경이 "안전"함을 검증합니다.

### 사용자를 위한 청구 명령어

사용자가 토큰을 청구할 때, 온체인에 저장된 머클 트리 루트를 사용하여 자격이 검증됩니다.

**1단계: 머클 증명 생성**:

시스템은 이전 예제에서 생성된 외부 머클 트리 데이터베이스에서 사용자의 데이터를 찾고 머클 증명을 생성합니다. 이 증명에는 사용자의 리프까지의 경로를 따라 형제 노드의 해시와 인덱스가 포함되어 검증 프로세스를 가능하게 합니다:

```typescript
const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));

if (index === -1) {
  throw new Error("Address not found in Merkle tree data");
}

const proof = merkleTree.merkle_proof_index(index);
const proofArray = Buffer.from(proof.get_pairing_hashes());
```

**2단계: 온체인 검증**

사용자가 제출한 데이터, 생성된 머클 증명, 데이터의 인덱스를 사용하여 시스템은 온체인에서 머클 루트를 재구성합니다. 재구성된 루트는 저장된 루트와 비교되어 청구가 유효하고 머클 트리의 무결성이 유지됨을 확인합니다.

```rust
pub fn claim_airdrop(
  ctx: Context<Claim>,
  amount: u64,
  hashes: Vec<u8>,
  index: u64,
) -> Result<()> {
  let airdrop_state = &mut ctx.accounts.airdrop_state;

  // 1단계: 원본 리프를 계산하여 서명자와 양이 올바른지 검증
  let mut original_leaf = Vec::new();
  original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
  original_leaf.extend_from_slice(&amount.to_le_bytes());
  original_leaf.push(0u8); // isClaimed = false

  // 2단계: 온체인 루트에 대해 머클 증명 검증
  let merkle_proof = MerkleProof::new(
    HashingAlgorithm::Keccak,
    32,
    index as u32,
    hashes.clone(),
  );

  let computed_root = merkle_proof
    .merklize(&original_leaf)
    .map_err(|_| AirdropError::InvalidProof)?;

  require!(
    computed_root.eq(&airdrop_state.merkle_root),
    AirdropError::InvalidProof
  );

  // 3단계: 전송 실행
  let mint_key = ctx.accounts.mint.key().to_bytes();

  let signer_seeds = &[
    b"merkle_tree".as_ref(),
    mint_key.as_ref(),
    &[airdrop_state.bump],
  ];

  transfer(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.signer_ata.to_account_info(),
        authority: airdrop_state.to_account_info(),
      },
      &[signer_seeds],
    ),
    amount,
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(
        mut,
        has_one = mint,
        seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
        bump = airdrop_state.bump
    )]
    pub airdrop_state: Account<'info, AirdropState>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = airdrop_state,
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub signer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
```

정확성을 보장하기 위해 루트는 계정 구조체에 제공된 입력으로부터 재구성되고 일치하는지 검증하기 위해 온체인에 저장된 루트와 비교됩니다.

**3단계: 청구**

이 예제에서 단순화를 위해 동시성을 구현하지 않겠습니다. 대신 청구를 처리하는 두 가지 가능한 접근법을 제시합니다:

- isClaimed 플래그를 true로 설정하고 온체인에서 머클 루트를 재계산합니다. 이 접근법의 주요 단점은 [동시 머클 트리 섹션](#concurrent-merkle-tree)에서 설명한 대로 업데이트 중에 계정이 잠긴다는 것입니다. 이는 블록당 한 사용자로 청구를 제한하며 전송 후 동일한 명령어에서 다음과 같이 구현할 수 있습니다:

{% totem %}

{% totem-accordion title="코드 예제" %}

```rust
// 4단계: 리프에서 `is_claimed` 플래그 업데이트
let mut updated_leaf = Vec::new();
updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
updated_leaf.extend_from_slice(&amount.to_le_bytes());
updated_leaf.push(1u8); // isClaimed = true

let updated_root: [u8; 32] = merkle_proof
  .merklize(&updated_leaf)
  .map_err(|_| AirdropError::InvalidProof)?
  .try_into()
  .map_err(|_| AirdropError::InvalidProof)?;

// 5단계: 에어드랍 상태에서 머클 루트 업데이트
airdrop_state.merkle_root = updated_root;

// 6단계: 에어드랍 상태 업데이트
airdrop_state.amount_claimed = airdrop_state
  .amount_claimed
  .checked_add(amount)
  .ok_or(AirdropError::OverFlow)?;
```

{% /totem-accordion %}

{% /totem %}

- 토큰을 청구한 후 각 사용자에 대해 프로그램 파생 주소(PDA)를 생성합니다. 이 방법은 `AirdropState` 계정을 잠그는 것을 방지하지만 사용자가 새 PDA에 대해 임대료를 지불해야 합니다. 이는 동일한 명령어에서 구현할 수 있으며, 다음과 같이 계정 구조체를 변경하기만 하면 됩니다:

{% totem %}

{% totem-accordion title="코드 예제" %}

```rust
#[derive(Accounts)]
pub struct Claim<'info> {
  //...
  #[account(
    init,
    payer = signer,
    seeds = [b"user_receipt".as_ref(), signer.key().to_bytes().as_ref()],
    bump,
    space = 8 + 32
  )]
  pub user_receipt: Account<'info, UserReceipt>,
  //...
}

#[account]
pub struct UserReceipt {
  pub user: Pubkey,
}
```

{% /totem-accordion %}

{% /totem %}

**참고**: `user_receipt` 계정은 임대료 비용을 줄이기 위해 비워둘 수 있습니다. 더 최적화하려면 계정을 프로그램에 할당하고 `UncheckedAccount`로 전달하여 판별자에서 바이트를 절약할 수 있습니다. 그러면 `require()`를 사용하여 계정의 소유권을 확인하고, 시스템 프로그램에서 `assign` 명령어를 추가하여 올바른 프로그램에 할당해야 합니다.

## 전체 예제 코드

다음은 청구 후 온체인에서 루트를 업데이트하는 스마트 컨트랙트의 완전한 예제입니다:

{% totem %}

{% totem-accordion title="스마트 컨트랙트 코드 예제" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}};
use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("GTCPuHiGookQVSAgGc7CzBiFYPytjVAq6vdCV3NnZoHa");

#[program]
pub mod merkle_tree_token_claimer {
  use super::*;

  pub fn initialize_airdrop_data(
    ctx: Context<Initialize>,
    merkle_root: [u8; 32],
    amount: u64,
  ) -> Result<()> {

    ctx.accounts.airdrop_state.set_inner(
      AirdropState {
        merkle_root,
        authority: ctx.accounts.authority.key(),
        mint: ctx.accounts.mint.key(),
        airdrop_amount: amount,
        amount_claimed: 0,
        bump: ctx.bumps.airdrop_state,
      }
    );

    mint_to(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
        }
      ),
      amount
    )?;

    set_authority(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
        }
      ),
      AuthorityType::MintTokens,
      None
    )?;

    Ok(())
  }

  pub fn update_tree(
    ctx: Context<Update>,
    new_root: [u8; 32]
  ) -> Result<()> {

    ctx.accounts.airdrop_state.merkle_root = new_root;

    Ok(())
  }

  pub fn claim_airdrop(
    ctx: Context<Claim>,
    amount: u64,
    hashes: Vec<u8>,
    index: u64,
  ) -> Result<()> {
    let airdrop_state = &mut ctx.accounts.airdrop_state;

    // 1단계: 원본 리프를 계산하여 서명자와 양이 올바른지 검증
    let mut original_leaf = Vec::new();
    original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    original_leaf.extend_from_slice(&amount.to_le_bytes());
    original_leaf.push(0u8); // isClaimed = false

    // 2단계: 온체인 루트에 대해 머클 증명 검증
    let merkle_proof = MerkleProof::new(
      HashingAlgorithm::Keccak,
      32,
      index as u32,
      hashes.clone(),
    );

    let computed_root = merkle_proof
      .merklize(&original_leaf)
      .map_err(|_| AirdropError::InvalidProof)?;

    require!(
      computed_root.eq(&airdrop_state.merkle_root),
      AirdropError::InvalidProof
    );

    // 3단계: 전송 실행
    let mint_key = ctx.accounts.mint.key().to_bytes();
    let signer_seeds = &[
      b"merkle_tree".as_ref(),
      mint_key.as_ref(),
      &[airdrop_state.bump],
    ];

    transfer(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
          from: ctx.accounts.vault.to_account_info(),
          to: ctx.accounts.signer_ata.to_account_info(),
          authority: airdrop_state.to_account_info(),
        },
        &[signer_seeds],
      ),
      amount,
    )?;

    // 4단계: 리프에서 `is_claimed` 플래그 업데이트
    let mut updated_leaf = Vec::new();
    updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    updated_leaf.extend_from_slice(&amount.to_le_bytes());
    updated_leaf.push(1u8); // isClaimed = true

    let updated_root: [u8; 32] = merkle_proof
      .merklize(&updated_leaf)
      .map_err(|_| AirdropError::InvalidProof)?
      .try_into()
      .map_err(|_| AirdropError::InvalidProof)?;

    // 5단계: 에어드랍 상태에서 머클 루트 업데이트
    airdrop_state.merkle_root = updated_root;

    // 6단계: 에어드랍 상태 업데이트
    airdrop_state.amount_claimed = airdrop_state
      .amount_claimed
      .checked_add(amount)
      .ok_or(AirdropError::OverFlow)?;

      Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority,
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut,
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
  #[account(
    mut,
    has_one = mint,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub mint: Account<'info, Mint>,
  #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = signer,
  )]
  pub signer_ata: Account<'info, TokenAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

/// 머클 트리와 에어드랍 정보를 보유하는 상태 계정
#[account]
pub struct AirdropState {
  /// 현재 머클 루트
  pub merkle_root: [u8; 32],
  /// 머클 루트를 업데이트할 수 있는 권한
  pub authority: Pubkey,
  /// 에어드랍되는 토큰의 민트 주소
  pub mint: Pubkey,
  /// 에어드랍을 위해 할당된 총액
  pub airdrop_amount: u64,
  /// 지금까지 청구된 총액
  pub amount_claimed: u64,
  /// PDA 범프 시드
  pub bump: u8,
}

#[error_code]
pub enum AirdropError {
  #[msg("무효한 머클 증명")]
  InvalidProof,
  #[msg("이미 청구됨")]
  AlreadyClaimed,
  #[msg("양 오버플로")]
  OverFlow,
}
```

{% /totem-accordion %}

{% /totem %}

그리고 다음은 머클 트리를 구현하고 테스트하는 코드가 있는 해당 test.ts 파일입니다:

{% totem %}

{% totem-accordion title="TypeScript 테스트 코드 예제" %}

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MerkleTreeTokenClaimer } from "../target/types/merkle_tree_token_claimer";
import { expect } from "chai";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";


describe("merkle-tree-token-claimer", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();

  Keypair.fromSecretKey
  const program = anchor.workspace.MerkleTreeTokenClaimer as Program<MerkleTreeTokenClaimer>;

  let authority = wallet.payer;
  let mint = Keypair.generate();
  let newAddress: Keypair;
  let airdropState: PublicKey;
  let merkleTree: MerkleTree;
  let vault: PublicKey;
  let newData: AirdropTokenData;

  interface AirdropTokenData {
    address: PublicKey;
    amount: number;
    isClaimed: boolean;
  }
  let merkleTreeData: AirdropTokenData[];

  before(async () => {
    airdropState = PublicKey.findProgramAddressSync([Buffer.from("merkle_tree"), mint.publicKey.toBuffer()], program.programId)[0];
    vault = await getAssociatedTokenAddress(mint.publicKey, airdropState, true);

    // 권한에 SOL 에어드랍
    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: authority.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ),
      []
    );

    // 100개의 무작위 주소와 양 생성
    merkleTreeData = Array.from({ length: 100 }, () => ({
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // 예제 무작위 양
      isClaimed: false,                                   // isClaimed의 기본값
    }));

    // 머클 트리 생성
    merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);
    merkleTreeData.forEach((entry) => {
      // 주소, 양, isClaimed를 이진 형식으로 직렬화
      const entryBytes = Buffer.concat([
        entry.address.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
        Buffer.from([entry.isClaimed ? 1 : 0]),
      ]);
      merkleTree.add_leaf(entryBytes);
    });
    merkleTree.merklize();

  });

  it("에어드랍 데이터 초기화", async () => {
    const merkleRoot = Array.from(merkleTree.get_merkle_root());
    const totalAirdropAmount = merkleTreeData.reduce((sum, entry) => sum + entry.amount, 0);

    await program.methods.initializeAirdropData(merkleRoot, new anchor.BN(totalAirdropAmount))
      .accountsPartial({
        airdropState,
        mint: mint.publicKey,
        vault,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .signers([authority, mint])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(merkleRoot);
    expect(account.authority.toString()).to.equal(authority.publicKey.toString());
  });

  it("루트 업데이트", async () => {
    const newData = {
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // 예제 무작위 양
      isClaimed: false,                                   // isClaimed의 기본값
    };
    merkleTreeData.push(newData);
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey를 바이트로
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 양을 리틀 엔디안으로
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed를 1바이트로
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();

    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());

    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(newMerkleRoot);
  });

  it("화이트리스트된 주소로 청구 수행", async () => {
    newAddress = Keypair.generate();
    newData = {
      address: newAddress.publicKey,
      amount: Math.floor(Math.random() * 1000),           // 예제 무작위 양
      isClaimed: false,                                   // isClaimed의 기본값
    }
    merkleTreeData.push(newData);
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey를 바이트로
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 양을 리틀 엔디안으로
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed를 1바이트로
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();

    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());

    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));
    if (index === -1) {
      throw new Error("Address not found in Merkle tree data");
    }

    const proof = merkleTree.merkle_proof_index(index);
    const proofArray = Buffer.from(proof.get_pairing_hashes());

    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: newAddress.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ),
      []
    );

    try {
      await program.methods.claimAirdrop(new anchor.BN(newData.amount), proofArray, new anchor.BN(index))
        .accountsPartial({
          airdropState,
          mint: mint.publicKey,
          vault,
          signerAta: await getAssociatedTokenAddress(mint.publicKey, newAddress.publicKey),
          signer: newAddress.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        })
        .signers([newAddress])
        .rpc();
      console.log("화이트리스트된 주소에 대해 작업이 성공적으로 수행되었습니다");
    } catch (error) {
      console.error("작업 수행 오류:", error);
      throw error;
    }
  });
};
```

{% /totem-accordion %}

{% /totem %}
