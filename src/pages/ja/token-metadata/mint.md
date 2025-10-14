---
title: アセットのミント
metaTitle: アセットのミント | Token Metadata
description: Token MetadataでNFT、SFT、プログラマブルNFT（別名アセット）をミントする方法を学びます
---

[Token Metadata概要](/jp/token-metadata)で説明したように、Solanaのデジタルアセットはいくつかのオンチェーンアカウントとトークンを説明するオフチェーンデータで構成されています。このページでは、これらのアセットをミントするプロセスについて説明します。 {% .lead %}

## ミントプロセス

Fungible、半Fungible、または非Fungibleアセットをミントしたい場合でも、全体的なプロセスは同じです：

1. **オフチェーンデータのアップロード。** まず、オフチェーンデータの準備ができていることを確認する必要があります。つまり、アセットを説明するJSONファイルがどこかに保存されている必要があります。**URI**経由でアクセス可能である限り、そのJSONファイルがどのように、どこに保存されているかは関係ありません。
2. **オンチェーンアカウントの作成。** 次に、アセットのデータを保持するオンチェーンアカウントを作成する必要があります。作成される正確なアカウントは、アセットの**トークン標準**によって異なりますが、すべての場合で**メタデータ**アカウントが作成され、オフチェーンデータの**URI**が保存されます。
3. **トークンのミント。** 最後に、これらすべてのアカウントに関連付けられたトークンをミントする必要があります。非Fungibleアセットの場合、非Fungibility性により供給量を1より大きくすることは禁止されているため、これは単に0から1へのミントを意味します。FungibleまたはSemi-Fungibleアセットの場合、必要な数だけトークンをミントできます。

具体的なコード例を提供しながら、これらのステップをより詳細に掘り下げましょう。

## オフチェーンデータのアップロード

オフチェーンデータをアップロードするために任意のサービスを使用したり、単に独自のサーバーに保存したりできますが、一部のSDKがそれを支援できることは注目に値します。それらはプラグインシステムを使用して、選択したアップローダーを選択し、データをアップロードするための統一されたインターフェースを提供します。

{% dialect-switcher title="アセットとJSONデータをアップロード" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="アップローダーを選択" %}

Umiを使用してお好みのアップローダーを選択するには、アップローダーが提供するプラグインをインストールするだけです。

例えば、Arweaveネットワークとやり取りするためのirysUploaderプラグインをインストールする方法は次のとおりです：

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

これで**URI**ができたので、次のステップに進むことができます。

{% callout %}
次のステップでは、アカウントの作成とトークンのミントを2つのステップで行う方法を示します。[ページの下部](#create-helpers)には、これらのステップを組み合わせて異なるトークンタイプの作成をより簡単にするヘルパーの**コード例**があります。
{% /callout %}

## ミントアカウントとメタデータアカウントの作成

選択したトークン標準で必要なすべてのオンチェーンアカウントを作成するには、**Create V1**命令を使用するだけです。リクエストされたトークン標準に適応し、それに応じて適切なアカウントを作成します。

例えば、`NonFungible`アセットは`Metadata`アカウントと`MasterEdition`アカウントが作成され、`Fungible`アセットは`Metadata`アカウントのみが作成されます。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible (エディションとpNFTを含む)" theme="transparent" /%}

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

さらに、提供された**Mint**アカウントが存在しない場合、私たちのために作成されます。そうすることで、メタデータを追加する前にトークンを準備するために基盤となるTokenプログラムを呼び出す必要さえありません。

この命令は様々なパラメータを受け入れ、私たちのSDKは毎回すべてを入力する必要がないようにデフォルト値を提供するよう最善を尽くします。とは言え、興味を持つ可能性のあるパラメータのリストは次のとおりです：

- **Mint**: アセットのMintアカウント。存在しない場合は、初期化されるため署名者として提供する必要があります。通常、この目的で新しいキーペアを生成します。
- **Authority**: Mintアカウントの権限。これは、Mintアカウントからトークンをミントすることが許可されている、または許可されるアカウントです。SDKでサポートされている場合、「Identity」ウォレット—つまり接続されたウォレット—がデフォルトになります。
- **Name**、**URI**、**Seller Fee Basis Points**、**Creators**など：**Metadata**アカウントに保存するアセットのデータ。
- **Token Standard**: アセットのトークン標準。

{% callout %}
`createV1`は、Mintアカウントを初期化し、Metadataアカウントを作成できるヘルパー関数です。mintが既に存在する場合は、metadataアカウントのみを作成します。[`createMetadataAccountV3`](https://mpl-token-metadata-js-docs.vercel.app/functions/createMetadataAccountV3.html)の使用方法をお探しの場合は、代わりにこの関数を使用してください。
{% /callout %}

{% dialect-switcher title="オンチェーンアカウントの作成" %}
{% dialect title="JavaScript - Umi" id="js-umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust Script" id="rust-script" %}
{% totem %}

```rust
use mpl_token_metadata::{
    instructions::CreateV1Builder,
    types::{PrintSupply, TokenStandard},
};
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. clientは初期化されたRpcClientへの参照
// 2. すべてのアカウントはpubkeyで指定される

let client = ...;

let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint.pubkey(), true)
    .authority(payer.pubkey())
    .payer(payer.pubkey())
    .update_authority(payer.pubkey(), false)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();

let message = Message::new(
    &[create_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[mint, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

`mint`アカウントを設定する際、アカウントが署名者かどうかを示す`bool`フラグを指定する必要があることに注意してください – `mint`アカウントが存在しない場合、署名者である必要があります。

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-cpi" %}

```rust
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::CreateV1CpiBuilder,
    types::{PrintSupply, TokenStandard},
};

// 1. すべてのアカウントはAccountInfoへの参照で指定される

let create_cpi = CreateV1CpiBuilder::new(token_metadata_program_info)
    .metadata(metadata_info)
    .mint(mint_info, true)
    .authority(payer_info)
    .payer(payer_info)
    .update_authority(update_authority_info, false)
    .master_edition(Some(master_edition_info))
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .token_standard(TokenStandard::NonFungible)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero);

create_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## トークンのミント

アセット用のすべてのオンチェーンアカウントが作成されたら、そのためにトークンをミントできます。アセットが非Fungibleの場合は、その唯一のトークンをミントするだけで、そうでなければ必要な数だけトークンをミントできます。非Fungibleアセットは、そのユニークなトークンがミントされて初めて有効になることに注意してください。したがって、そのトークン標準では必須のステップです。

これを実現するには、Token Metadataプログラムの**Mint V1**命令を使用できます。以下のパラメータが必要です：

- **Mint**: アセットのMintアカウントのアドレス。
- **Authority**: この命令を承認できる権限。非Fungibleアセットの場合、これは**Metadata**アカウントの更新権限で、そうでなければMintアカウントの**Mint Authority**を指します。
- **Token Owner**: トークンを受け取るウォレットのアドレス。
- **Amount**: ミントするトークン数。非Fungibleアセットの場合、これは1のみです。
- **Token Standard**: アセットのトークン標準（**JavaScriptSDKで必要**）。プログラムはこの引数を必要としませんが、私たちのSDKは他のほとんどのパラメータに適切なデフォルト値を提供できるようにするためにそれを行います。

{% dialect-switcher title="トークンのミント" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

await mintV1(umi, {
  mint: mint.publicKey,
  authority,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. clientは初期化されたRpcClientへの参照
// 2. すべてのアカウントはpubkeyで指定される

let client = ...;

let mint_ix = MintV1Builder::new()
    .token(token)
    .token_owner(Some(token_owner))
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint)
    .authority(update_authority)
    .payer(payer)
    .amount(1)
    .instruction();

let message = Message::new(
    &[mint_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[update_authority, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

`NonFungible`をミントするために必要なため、`master_edition`を設定しています；`token`アカウントが存在せず、初期化される場合は`token_owner`が必要です。

{% /totem-prose %}

{% /totem %}
{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
use mpl_token_metadata::instructions::MintV1CpiBuilder;

// 1. すべてのアカウントはAccountInfoへの参照で指定される

let mint_cpi = MintV1CpiBuilder::new(token_metadata_program_info)
    .token(token_info)
    .token_owner(Some(token_owner_info))
    .metadata(metadata_info)
    .master_edition(Some(master_edition_info))
    .mint(mint_info)
    .payer(payer_info)
    .authority(update_authority_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(1);

mint_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 作成ヘルパー

デジタルアセットの作成はToken Metadataの非常に重要な部分であるため、私たちのSDKはプロセスをより簡単にするヘルパーメソッドを提供します。具体的には、これらのヘルパーメソッドは、作成したいトークン標準に応じて、**Create V1**命令と**Mint V1**命令を異なる方法で組み合わせます。

{% dialect-switcher title="作成ヘルパー" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="NonFungibleの作成" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // コレクションに直接追加したい場合のオプション。後で検証が必要。
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Fungibleの作成" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungible } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7), // 小数点以下0桁の場合はsome(0)を使用
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="FungibleAssetの作成" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7) // 小数点以下0桁の場合はsome(0)を使用
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="ProgrammableNonFungibleの作成" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createProgrammableNft(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // コレクションに直接追加したい場合のオプション。後で検証が必要。
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}

{% dialect title="Rust" id="rust" %}
<!-- このバージョンのドキュメンテーションではRustヘルパーの例は提供されていません -->
{% /dialect %}
{% /dialect-switcher %}