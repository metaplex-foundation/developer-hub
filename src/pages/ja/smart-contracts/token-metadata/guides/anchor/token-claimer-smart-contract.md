---
title: Merkle Treeを活用したToken Claimerスマートコントラクトの作り方
metaTitle: Token Claimerスマートコントラクトの作り方 | Token Metadata ガイド
description: Merkle TreeとAnchorを使用してSolana上でToken Claimerスマートコントラクトを作成する方法を学びましょう！
# remember to update dates also in /components/guides/index.js
created: '01-13-2025'
updated: '01-13-2025'
---

このガイドでは、Merkle Treeと圧縮を活用してAnchorを使用したToken MetadataトークンのためのコストパフォーマンスのいいToken Claimerを作成します。

## 前提条件

Token Claimerの仕組みについて学び始める前に、スマートコントラクトの内部で何が起こっているのかを本当に理解するために、圧縮とMerkle Treeがどのように機能するかを調べる必要があります。

### Merkle Tree

Merkle treeは、データのセットを効率的に表現するために使用されるバイナリツリーです。ツリー内の各リーフノードは、個別のデータのハッシュです（例：アドレスとトークン量）。親ノードは、子ノードのペアをハッシュ化することによって作成され、ルートに到達するまでツリーを上っていきます。ルートは、データセット全体のコンパクトで改ざん防止の表現として機能します。

**例**: A、B、C、Dの4つのデータエントリがあるとします。Merkle treeの構造は以下のように構築されます：

- **リーフノード**: 各エントリはハッシュ化されます：

```
Hash(A), Hash(B), Hash(C), Hash(D)
```

- **親ノード**: リーフノードのペアが組み合わされてハッシュ化されます：

```
Parent1 = Hash(Hash(A) + Hash(B))
Parent2 = Hash(Hash(C) + Hash(D))
```

- **ルートノード**: 最終的なハッシュが親ノードから計算されます：

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

Merkle treeは、オンチェーン圧縮の基盤であり、効率的で安全なデータ検証を可能にします。設計上、データセットの任意の部分を変更するとルートが無効になります。これは、Merkle rootのみをオンチェーンに保存し、Merkle Proof（ルートを再構築するのに必要な最小限の兄弟ハッシュのセット）を提供することで、特定のエントリの整合性を検証できることを意味します。

- **主な利点**: コスト効率的なストレージ：Merkle root（32バイト）のみがオンチェーンに保存され、ストレージコストが大幅に削減されます。検証は、Merkle proofを入力として渡すことで実現されます。
- **スケーラビリティ**: Proofのサイズはエントリ数に対して対数的に増加するため、この方法は大きなデータセットの管理に理想的です。
- **プライバシーと効率性**: Merkle tree全体をオフチェーンで生成・管理でき、完全なデータセットを非公開に保つことができます。Compressed NFTのようなプログラムは、パフォーマンスを最適化しつつプライバシーを維持するために、Solanaのnoopプログラムとこのアプローチを使用しています。

### 並行Merkle Tree

Solanaの状態圧縮では、ツリーの整合性と有効性を保持しながら、ツリーに複数の変更を可能にする独自のタイプのMerkle treeを採用しています。

この特別なツリーは並行Merkle treeと呼ばれ、オンチェーン変更ログを維持することで、proofを無効化することなく同じツリーへの複数の迅速な更新（例：全て同じブロック内）を可能にします。

この機能はSolanaで必要不可欠です。Solanaでは、アカウントごとにブロックあたり1つのライターのみが許可されているためです。これにより、更新は1ブロックあたり1つの変更に制限されるため、ランタイムはアカウントのセキュリティを確保し、破損を防ぐことができます。すべてのアクションには書き込みが必要なため、並行Merkle treeは、同じブロック内で複数の更新をシームレスに管理するための効率的なソリューションを提供します。

## セットアップ

- お好みのコードエディタ（**Visual Studio Code**と**Rust Analyzerプラグイン**を推奨）
- Anchor **0.30.1**以上。

さらに、このガイドでは、必要なマクロすべてが`lib.rs`ファイルにある**Anchor**へのmono-fileアプローチを活用します：

- `declare_id`: プログラムのオンチェーンアドレスを指定します。
- `#[program]`: プログラムの命令ロジックを含むモジュールを指定します。
- `#[derive(Accounts)]`: 命令に必要なアカウントのリストを示すために構造体に適用されます。
- `#[account]`: プログラム固有のカスタムアカウントタイプを作成するために構造体に適用されます。

**注意**: あなたのニーズに合わせて関数を変更し、移動する必要がある場合があります。

### プログラムの初期化

`avm` (Anchor Version Manager)を使用して新しいプロジェクトを初期化することから始めます（オプション）。初期化するには、ターミナルで次のコマンドを実行します：

```
anchor init token-claimer-example
```

### 必要なCrate

このガイドでは、SVM用のmerkle treeを作成および管理するための最適化されたバージョンである`svm_merkle_tree` crateを使用します。インストールするには、まず`token-claimer-example`ディレクトリに移動します：

```
cd token-claimer-example
```

次に、以下のコマンドを実行してmerkle tree crateをインストールします：

```
cargo add svm-merkle-tree --git https://github.com/deanmlittle/svm-merkle-tree
```

そして、Token Programと相互作用するためにanchor-splをインストールする以下のコマンドを実行します：

```
cargo add anchor-spl
```

## プログラム

{% callout %}

この例は、プロダクション向けの完全な実装ではありません。プロダクション対応にするためには、いくつかの追加コンポーネントと考慮事項が必要です：

- **イベントエミッション**: `event!()`マクロを使用して、成功したクレームやMerkle rootの更新などの重要なアクションに対してイベントを発行します。または、Solanaのnoopプログラムと統合して更新をログに記録し、オフチェーンアプリケーションのデータインデックス作成を促進できます。

- **データベースホスティング**: 完全なMerkle treeデータセットをオフチェーンで保存およびホストし、リーフと内部ノード以外のハッシュを導出し、Merkle proofを動的に生成・提供し、クレームの入力整合性を検証する必要があります。

{% /callout %}

### インポートとテンプレート

ここでは、この特定のガイドのすべてのインポートを定義し、`lib.rs`ファイルでAccountストラクトと命令のテンプレートを作成します。

```rust
use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}

use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

/// Instructions and Logic behind the program
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

/// Account Struct for the different Instructions
#[derive(Accounts)]
pub struct Initialize<'info> {

}

#[derive(Accounts)]
pub struct Update<'info> {

}

#[derive(Accounts)]
pub struct Claim<'info> {

}

/// State account holding the merkle tree and airdrop information
#[account]
pub struct AirdropState {

}

/// Error for the Program
#[error_code]
pub enum AirdropError {

}
```

これはオンチェーンプログラムのテンプレートとして機能しますが、この記事で詳しく取り上げる重要なフロントエンドオーバーヘッドも考慮する必要があります。

### Merkle Treeの初期化

クレーム可能な金額を含むユーザーデータでMerkle treeを初期化することから始めます。このプロセスはオフチェーンで実行され、ツリーのルートを計算し、後でオンチェーンにアップロードすることで、整合性を維持しながら計算コストを削減します。

この例では、100個のランダムなアドレスと100個のランダムな金額を生成し、各エントリに対して`isClaimed`フラグを初期化し、それをfalseに設定します。これらの詳細はバイナリ形式でシリアル化され、Merkle treeを効率的に生成し、作成したデータをmerklizeしてルートを作成します。

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";

// Generate 100 random addresses and amount
let merkleTreeData = Array.from({ length: 100 }, () => ({
  address: Keypair.generate().publicKey,              // Example random address
  amount: Math.floor(Math.random() * 1000),           // Example random amount
  isClaimed: false,                                   // Default value for isClaimed
}));

// Create Merkle Tree
let merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);

merkleTreeData.forEach((entry) => {
  // Serialize address, amount, and isClaimed in binary format
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

オンチェーンでは、エアドロップの状態を管理および追跡するために`AirdropState`アカウントを定義します。このアカウントは、Merkle treeメカニズムに基づいてトークンを安全に配布するために必要な重要な情報を保持します。以下は各フィールドの内訳です：

```rust
#[account]
pub struct AirdropState {
    /// The current merkle root
    pub merkle_root: [u8; 32],
    /// The authority who can update the merkle root
    pub authority: Pubkey,
    /// The mint address of the token being airdropped
    pub mint: Pubkey,
    /// Total amount allocated for the airdrop
    pub airdrop_amount: u64,
    /// Total amount claimed so far
    pub amount_claimed: u64,
    /// PDA bump seed
    pub bump: u8,
}
```

`initialize_airdrop_data`命令は単に`AirdropState`を生成し、`mint_authority`を無効化する前に`vault`で十分なトークンをmintします

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

### 必要に応じてオンチェーンでMerkle Rootを更新

`AirdropState`の`authority`がオンチェーンでルートを変更できる`update_tree`命令を作成します。これは新しいユーザーを追加したり、割り当てを無効化するために使用できます。

この例では、ランダムなアドレスに対して新しいランダム割り当てを作成し、前回の命令で作成したMerkle Treeにこのエントリをプッシュします：

```typescript
const newData = {
  address: Keypair.generate().publicKey,
  amount: Math.floor(Math.random() * 1000),           // Example random amount
  isClaimed: false,                                   // Default value for isClaimed
};

merkleTreeData.push(newData); 
    
const entryBytes = Buffer.concat([
  newData.address.toBuffer(), // PublicKey as bytes
  Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
  Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
]);

merkleTree.add_leaf(entryBytes);
    
merkleTree.merklize();

const newMerkleRoot = Array.from(merkleTree.get_merkle_root());
```

この方法でルートを簡単に更新できます：

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

この変更が「安全」であることを検証するのは、`has_one`制約を使用して、`AirdropState`に保存されたauthorityに対して提供されたauthorityをチェックするためです。

### ユーザーのクレーム命令

ユーザーがトークンをクレームする際、その資格はオンチェーンに保存されたMerkle Tree Rootを使用して検証されます。

**ステップ1: Merkle Proofの生成**:

システムは前回の例で生成された外部Merkle Treeデータベースでユーザーのデータを見つけ、Merkle Proofを生成します。この証明には、ユーザーのリーフまでのパス上の兄弟ノードのハッシュとインデックスが含まれ、検証プロセスを可能にします：

```typescript
const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));

if (index === -1) {
  throw new Error("Address not found in Merkle tree data");
}

const proof = merkleTree.merkle_proof_index(index);
const proofArray = Buffer.from(proof.get_pairing_hashes());
```

**ステップ2: オンチェーン検証**

ユーザーが提出したデータ、生成されたMerkle Proof、およびデータのインデックスを使用して、システムはオンチェーンでMerkle Rootを再構築します。再構築されたルートは、保存されたルートと比較され、クレームが有効でMerkle Treeの整合性が保持されていることを確認します。

```rust
pub fn claim_airdrop(
  ctx: Context<Claim>,
  amount: u64,
  hashes: Vec<u8>,
  index: u64,
) -> Result<()> {    
  let airdrop_state = &mut ctx.accounts.airdrop_state;

  // Step 1: Verify that the Signer and Amount are right by computing the original leaf
  let mut original_leaf = Vec::new();
  original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
  original_leaf.extend_from_slice(&amount.to_le_bytes());
  original_leaf.push(0u8); // isClaimed = false

  // Step 2: Verify the Merkle proof against the on-chain root
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

  // Step 3: Execute the transfer
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

正確性を保証するために、accountsストラクトで提供された入力からルートが再構築され、オンチェーンに保存されたルートと比較してマッチすることを確認します。

**ステップ3: クレーム**

この例では簡単にするため、並行性は実装しません。代わりに、クレームを処理する2つの可能なアプローチを紹介します：

- isClaimedフラグをtrueに設定し、オンチェーンでMerkle Rootを再計算します。このアプローチの主な欠点は、[並行Merkle Treeセクション](#concurrent-merkle-tree)で説明されているように、更新中にアカウントがロックされることです。これにより、クレームはブロックあたり1ユーザーに制限され、転送後に同じ命令で次のように実装できます：

{% totem %}

{% totem-accordion title="コード例" %}

```rust
// Step 4: Update the `is_claimed` flag in the leaf
let mut updated_leaf = Vec::new();
updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
updated_leaf.extend_from_slice(&amount.to_le_bytes());
updated_leaf.push(1u8); // isClaimed = true

let updated_root: [u8; 32] = merkle_proof
  .merklize(&updated_leaf)
  .map_err(|_| AirdropError::InvalidProof)?
  .try_into()
  .map_err(|_| AirdropError::InvalidProof)?;

// Step 5: Update the Merkle root in the airdrop state
airdrop_state.merkle_root = updated_root;

// Step 6: Update the airdrop state
airdrop_state.amount_claimed = airdrop_state
  .amount_claimed
  .checked_add(amount)
  .ok_or(AirdropError::OverFlow)?;
```

{% /totem-accordion %}

{% /totem %}

- トークンをクレームした後、各ユーザー用のProgram Derived Address (PDA)を作成します。この方法は`AirdropState`アカウントをロックすることを避けますが、ユーザーが新しいPDAのレントを支払う必要があります。これは同じ命令で実装でき、Accountストラクトを次のように変更するだけです：

{% totem %}

{% totem-accordion title="コード例" %}

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

**注意**: レントコストを削減するために`user_receipt`アカウントを空にしておくことができます。さらに最適化するために、アカウントをプログラムに割り当てて`UncheckedAccount`として渡すことで判別子でバイトを節約できます。その後、`require()`を使用してアカウントの所有権を確認し、システムプログラムから`assign`命令を追加して正しいプログラムに割り当てる必要があります。

## 完全なサンプルコード

以下は、クレーム後にオンチェーンでルートを更新するスマートコントラクトの完全なサンプルです：

{% totem %}

{% totem-accordion title="スマートコントラクトコード例" %}

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

    // Step 1: Verify that the Signer and Amount are right by computing the original leaf
    let mut original_leaf = Vec::new();
    original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    original_leaf.extend_from_slice(&amount.to_le_bytes());
    original_leaf.push(0u8); // isClaimed = false

    // Step 2: Verify the Merkle proof against the on-chain root
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

    // Step 3: Execute the transfer
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
  
    // Step 4: Update the `is_claimed` flag in the leaf
    let mut updated_leaf = Vec::new();
    updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    updated_leaf.extend_from_slice(&amount.to_le_bytes());
    updated_leaf.push(1u8); // isClaimed = true

    let updated_root: [u8; 32] = merkle_proof
      .merklize(&updated_leaf)
      .map_err(|_| AirdropError::InvalidProof)?
      .try_into()
      .map_err(|_| AirdropError::InvalidProof)?;

    // Step 5: Update the Merkle root in the airdrop state
    airdrop_state.merkle_root = updated_root;

    // Step 6: Update the airdrop state
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

/// State account holding the merkle tree and airdrop information
#[account]
pub struct AirdropState {
  /// The current merkle root
  pub merkle_root: [u8; 32],
  /// The authority who can update the merkle root
  pub authority: Pubkey,
  /// The mint address of the token being airdropped
  pub mint: Pubkey,
  /// Total amount allocated for the airdrop
  pub airdrop_amount: u64,
  /// Total amount claimed so far
  pub amount_claimed: u64,
  /// PDA bump seed
  pub bump: u8,
}

#[error_code]
pub enum AirdropError {
  #[msg("Invalid Merkle proof")]
  InvalidProof,
  #[msg("Already claimed")]
  AlreadyClaimed,
  #[msg("Amount overflow")]
  OverFlow,
}
```

{% /totem-accordion %}

{% /totem %}

そして以下は、Merkle treeを実装およびテストするコードを含む対応するtest.tsファイルです：

{% totem %}

{% totem-accordion title="Typescriptテストコード例" %}

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

    // Airdrop SOL to authority
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

    // Generate 100 random addresses and amount
    merkleTreeData = Array.from({ length: 100 }, () => ({
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    }));
    
    // Create Merkle Tree
    merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);
    merkleTreeData.forEach((entry) => {
      // Serialize address, amount, and isClaimed in binary format
      const entryBytes = Buffer.concat([
        entry.address.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
        Buffer.from([entry.isClaimed ? 1 : 0]),
      ]);
      merkleTree.add_leaf(entryBytes);
    });
    merkleTree.merklize();
    
  });

  it("Initialize airdrop data", async () => {
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

  it("Update root", async () => {
    const newData = {
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    };
    merkleTreeData.push(newData); 
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey as bytes
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
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

  it("Perform claim with whitelisted address", async () => {
    newAddress = Keypair.generate();
    newData = {
      address: newAddress.publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    }
    merkleTreeData.push(newData); 
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey as bytes
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
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
      console.log("Action performed successfully for whitelisted address");
    } catch (error) {
      console.error("Error performing action:", error);
      throw error;
    }
  });
};
```

{% /totem-accordion %}

{% /totem %}
