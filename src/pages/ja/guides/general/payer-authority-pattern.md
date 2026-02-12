---
# remember to update dates also in /components/guides/index.js
title: ペイヤー・オーソリティ パターン
metaTitle: ペイヤー・オーソリティ パターン | Metaplex Guides
description: 別々のオーソリティとペイヤーを使用するSolana命令の一般的なプログラミングパターン。
created: '12-30-2024'
updated: null
keywords:
  - payer-authority pattern
  - Solana program design
  - PDA signers
  - account ownership
  - Solana instruction pattern
about:
  - payer-authority pattern
  - Solana program architecture
  - account ownership
  - PDA signers
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - TypeScript
faqs:
  - q: What is the payer-authority pattern in Solana?
    a: The payer-authority pattern separates the account paying for storage fees (payer) from the account that owns or controls the created account (authority), enabling more flexible funding and ownership semantics.
  - q: Why would I need separate payer and authority signers?
    a: Separate signers allow a sponsor to pay for on-chain storage while the end user retains ownership, and they simplify PDA-based interactions where PDAs cannot directly pay rent.
  - q: How does the payer-authority pattern handle PDA signers?
    a: Since PDAs cannot sign transactions or pay fees directly, the pattern uses a separate payer account to cover rent and storage costs on behalf of the PDA, avoiding the complexity of funneling funds into PDAs.
---

## P-Aパターンの概要

ペイヤー・オーソリティ（P-A）パターンは、ストレージまたはレントの支払いを行う当事者（*ペイヤー*）と、アカウントを所有または制御する当事者（*オーソリティ*）が異なる場合があるシナリオにおいて、Solanaプログラム命令を構造化する一般的なアプローチです。これは最大限の構成可能性を持つプロトコルを設計する際の強力なデフォルト動作として機能し、Metaplexプログラムライブラリの基盤となっています。

これらの役割を分離することで、プログラムはより柔軟な資金調達メカニズム（1つまたは複数のペイヤー）とより明確な所有権または制御セマンティクスに対応できます。例えば、ゲームにおいて、ユーザーにアカウント初期化の支払いをさせたいが、その後のアクションではプログラムまたはPDAがオーソリティとして機能させたい場合があります。

## 異なる2つの署名者が必要な理由

1. **異なる責任**:  
   責任を分割することで、一方の署名者がアカウント作成やレントの支払いを行い、もう一方の署名者がそのアカウントを実際に管理または所有することができます。これは特に大規模または複雑なプログラムにおいて重要な懸念の分離です。

2. **柔軟性**:  
   トランザクションに資金を提供する当事者が、最終的にアカウントを制御する当事者と同じでない場合があります。2つの役割を設定することで、スポンサーがオンチェーンストレージの代金を支払いながら、エンドユーザーがアセットの自律性と所有権を保持するパターンに簡単に対応できます。

3. **PDA署名者**:
   プログラム派生アドレス（PDA）は、通常のキーペアと同じ方法でトランザクションに署名することを可能にする秘密鍵を持たないため、それらのすべての相互作用はプログラムを呼び出すことによって管理される必要があります。PDAはアカウントのオーソリティになることができますが、複雑な資金移動を伴わずにレントや手数料を直接支払うために使用することはできません。PDAの代わりにレントや小さなストレージ調整をカバーする別のペイヤーアカウントを持つことで、軽微な変更のために資金をPDAに誘導する複雑さを回避できます。

## Rustの例

以下は、ShankとAnchorの両方でP-Aパターンを実装する方法の例です。また、これらの署名者条件を検証する方法と、このパターンで動作するクライアントを構築する方法についても説明します。

{% dialect-switcher title="Rustにおけるペイヤーオーソリティパターン" %}
{% dialect title="Shank" id="shank" %}
{% totem %}

```rust
    /// 新しいアカウントを作成します。
    #[account(0, writable, signer, name="account", desc = "新しいアカウントのアドレス")]
    #[account(1, writable, signer, name="payer", desc = "ストレージ料金を支払うアカウント")]
    #[account(2, optional, signer, name="authority", desc = "アカウント作成に署名するオーソリティ")]
    #[account(3, name="system_program", desc = "システムプログラム")]
    CreateAccountV1(CreateAccountV1Args),
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
{% totem %}

```rust
    /// 新しいアカウントを作成します。
    #[derive(Accounts)]
    pub struct CreateAccount<'info> {
        /// 新しいアカウントのアドレス
        #[account(init, payer = payer, space = 8 + NewAccount::MAXIMUM_SIZE)]
        pub account: Account<'info, NewAccount>,
        
        /// ストレージ料金を支払うアカウント
        #[account(mut)]
        pub payer: Signer<'info>,
        
        /// アカウント作成に署名するオーソリティ
        pub authority: Option<Signer<'info>>,
        
        // システムプログラム
        pub system_program: Program<'info, System>
    }
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 制約チェック

ネイティブなSolanaコードでは、各命令に対して正しい署名者が存在することを確認する必要があります。これは通常、以下を意味します：

```rust
    // ペイヤーがトランザクションに署名し、ストレージ料金の支払いに同意していることを確認します。
    assert_signer(ctx.accounts.payer)?;

    // オーソリティが存在する場合、それらが署名者であることを確認します。そうでなければ、
    // ペイヤーをトランザクションを承認する者として扱います。
    let authority = match ctx.accounts.authority {
        Some(authority) => {
            assert_signer(authority)?;
            authority
        }
        None => ctx.accounts.payer,
    };
```

### 重要なポイント

* `assert_signer`は、提供されたアカウントキーがトランザクションに署名していることを確認します。

* フォールバックロジックを設定します：オーソリティが提供されていない場合、ペイヤーをオーソリティとして扱います。
これは事実上P-Aパターンの本質を捉えています：別々のオプションのオーソリティがアカウント作成や変更を管理できますが、オーソリティが提供されていない場合、ペイヤーがデフォルトでその役割を担います。

## クライアントの見た目

クライアント側から、トランザクションにペイヤーとオーソリティ（オプション）の両方を渡す必要があります。以下は、CreateAccountV1命令でこれらのアカウントがどのように構造化されるかを示すUmiを使用した例です。

{% dialect-switcher title="ペイヤーオーソリティパターン クライアント" %}
{% dialect title="Umi" id="umi" %}
{% totem %}

```ts
    // アカウント。
    export type CreateAccountV1InstructionAccounts = {
        /** 新しいアカウントのアドレス */
        account: Signer;
        /** ストレージ料金を支払うアカウント */
        payer: Signer;
        /** 新しいアセットのオーソリティ */
        authority?: Signer | Pda;
        /** システムプログラム */
        systemProgram?: PublicKey | Pda;
    };
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## まとめ

ペイヤー・オーソリティパターンは、アカウントの資金提供者（ペイヤー）がアカウントの所有者または管理者（オーソリティ）と異なる状況を処理するエレガントな方法です。別々の署名者を要求し、オンチェーンロジックでそれらを検証することで、プログラムで明確で堅牢で柔軟な所有権セマンティクスを維持できます。Rust（ShankとAnchor）のサンプルコードとUmiクライアントの例は、このパターンをエンドツーエンドで実装する方法を示しています。

アカウント作成やトランザクション料金を支払うエンティティとは異なる可能性がある専用のアカウントオーソリティが必要になることが予想される場合、またはユーザーがプログラムにCPIすることが期待される状況では、このパターンを使用してください。これにより、コアプログラムロジックを複雑にすることなく、より洗練されたシナリオを簡単に処理できるようになります。
