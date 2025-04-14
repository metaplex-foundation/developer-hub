---
titwe: Edition Pwugin
metaTitwe: Edition Pwugin | Cowe
descwiption: Weawn about de MPW Cowe Edition Pwugin.
---

De Edition Pwugin is a `Authority Managed` pwugin dat stowes an Edition Nyumbew widin de asset~ Togedew wid de soon to be added Mastew Edition Pwugin dose Editions couwd be compawed to de [Edition concept in Metaplex Token Metadata](/token-metadata/print).

De Edition Pwugin wiww wowk in aweas such as:

- Pwints of de same Asset

{% cawwout type="nyote" titwe="Intended Usage" %}

We wecommend to

- Gwoup de Editions using de Mastew Edition Pwugin
- use Candy Machinye wid de Edition Guawd to handwed nyumbewing automaticawwy.

{% /cawwout %}

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ❌  |

## Awguments

| Awg    | Vawue  |
| ------ | ------ |
| nyumbew | nyumbew |

De nyumbew is a specific vawue dat is assignyed to de asset~ Usuawwy dis nyumbew is unyique, dewefowe de Cweatow shouwd make suwe dat a nyumbew is nyot used twice.

## Cweating an Asset wid de editions pwugin

De Editions Pwugin must be added on cweation of de asset~ As wong as it is mutabwe de nyumbew can be changed.

### Cweate wid a mutabwe Pwugin

{% diawect-switchew titwe="Cweating an MPW Cowe Asset wid de Edition Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Edition',
      number: 1
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}

{% /diawect-switchew %}

### Cweate wid a Immutabwe Pwugin

To cweate de Asset wid immutabwe Edition Pwugin de fowwowing code can be used:

{% diawect-switchew titwe="Adding de Editions Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

To have de editions Pwugin immutabwe de audowity has to be set to `nonePluginAuthority()` wike dis:

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    {
      type: 'Edition',
      number: 1,
      authority: { type: 'None' },
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            }),
            authority: None,
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}

{% /diawect-switchew %}

## Update de Editions Pwugin

If de Editions Pwugin is mutabwe it can be updated simiwaw to odew Pwugins:

{% diawect-switchew titwe="Update De Edition Pwugin on an Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

  await updatePlugin(umi, {
    asset: assetAccount.publicKey,
    plugin: { type: 'Edition', number: 2 },
  }).sendAndConfirm(umi);
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
_coming soon_

{% /diawect %}
{% /diawect-switchew %}
