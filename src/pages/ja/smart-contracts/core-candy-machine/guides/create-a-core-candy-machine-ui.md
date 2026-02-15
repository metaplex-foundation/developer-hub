---
title: Core Candy MachineからアセットをミントするためのWebサイトを作成する
metaTitle: Core Candy MachineからアセットをミントするためのWebサイトを作成する | Core Candy Machine
description: SolanaでCandy Machineミントプログラムと対話するUIの作成方法。
---

SolanaでCore NFTコレクションをローンチする場合、通常はユーザーがアセットを購入できるCandy Machineを使用します。ユーザーフレンドリーなエクスペリエンスを提供するために、Webサイトを用意することをお勧めします。このガイドでは、独自のミント機能を構築する方法に焦点を当てます。また、Candy Machineからデータを取得して、例えばミント可能な残り数量を表示する方法も示します。

このガイドは、完全なWebサイトの実装ではなく、コアとなるCandy Machineの機能と対話に焦点を当てています。Webサイトにボタンを追加したり、ウォレットアダプターと統合したりする方法は含まれていません。代わりに、Core Candy Machineを操作するための重要な情報を提供します。

UIエレメントやウォレット統合を含む完全なWebサイト実装については、[`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)のようなテンプレートから始めることをお勧めします。このテンプレートには、Wallet Adapterのようなコンポーネントの多くのセットアップ手順が含まれています。

一般的なWeb開発の実践方法や特定のフレームワークの使用方法に関するガイダンスをお探しの場合は、Visual Studio Codeなどのツールが豊富なドキュメントとコミュニティリソースを提供しています。

## 前提条件

- すでに作成されたCandy Machine。作成方法の詳細は[Core Candy Machine作成ガイド](https://developers.metaplex.com/core-candy-machine/create)をご覧ください。
- Web開発と選択したフレームワークの基本的な知識。umiとの互換性を最も簡単にするために、Next JSをお勧めします。

## 必要なパッケージ

選択したテンプレートや実装に関係なく、Core Candy Machineと対話するために以下のパッケージをインストールする必要があります:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## オンチェーンデータの取得

環境のセットアップ後、Candy Machineに焦点を当てることができます。ミントUIは通常、以下のようなデータを表示したいと考えます:

- すでにミントされたアセットの数
- Candy Machine内のアセットの数
- ミント開始までの時間
- アセットの価格
- その他

ユーザーには表示されないが、バックグラウンドの計算で使用される追加データを取得することも理にかなっています。たとえば、[Redeemed Amount](/ja/smart-contracts/core-candy-machine/guards/redeemed-amount) Guardを使用する場合、すでに償還された数量を取得して、ユーザーがさらにミントできるかどうかを確認する必要があります。

### Candy Machineデータの取得
Candy Machineアカウントには、利用可能および償還されたアセットの数などのデータが保存されています。また、`mintAuthority`も保存されており、これは通常、Candy Guardのアドレスです。

Candy Machineを取得するには、以下のように`fetchCandyMachine`関数を使用できます:

Solana Devnetエンドポイントを使用します。

```ts
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// 次の2行は、以前にumiをセットアップしていない場合のみ必要です
// エンドポイントとしてSolana Devnetを使用します
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```

これは以下のようなCandy Machineデータを返します:

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cm" %}

{% totem-accordion title="Candy Machine Data" %}
```json
{
    "publicKey": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "header": {
        "executable": false,
        "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
        "lamports": {
            "basisPoints": "91814160",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        51,
        173,
        177,
        113,
        25,
        241,
        109,
        189
    ],
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "mintAuthority": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "collectionMint": "GPHD33NBaM8TgvbfgcxrusD6nyfhNLbeyKjxMRLAr9LM",
    "itemsRedeemed": "13",
    "data": {
        "itemsAvailable": "16",
        "maxEditionSupply": "0",
        "isMutable": true,
        "configLineSettings": {
            "__option": "Some",
            "value": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false
            }
        },
        "hiddenSettings": {
            "__option": "None"
        }
    },
    "items": [
        {
            "index": 0,
            "minted": true,
            "name": "0.json",
            "uri": ""
        },
        [...]
    ],
    "itemsLoaded": 16
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

UI観点から最も重要なフィールドは、`itemsRedeemed`、`itemsAvailable`、および`mintAuthority`です。場合によっては、Webサイトにティーザー画像として`items`のいくつかを表示することも興味深いかもしれません。

#### 残りのアセット数を表示する
`13 / 16 Assets minted`のようなセクションを表示するには、以下のようなものを使用します:

```ts
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} Assets minted`
```

`3 available`のように残りのミント可能なアセットを取得したい場合は、代わりに以下のような計算を実行します:

```ts
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} available`;
```

### Candy Guardデータの取得
Candy Guardには、ミントを許可するために満たさなければならない条件が含まれています。これには、例えばSolまたはTokenの支払い、1つのウォレットがミントできるアセットの数の制限などが含まれます。Candy Guardの詳細については、[Candy Guardページ](/ja/smart-contracts/core-candy-machine/guards)をご覧ください。

Candy Machineデータと同様に、guardアカウントを取得することは必須ではありません。そうすることで、Candy GuardのSOL価格を更新するだけで、Webサイトの数値も自動的に更新されるような柔軟性が得られます。

複数のCandy Machineに使用できるより柔軟なUIを構築したい場合、Candy Guardを取得することで、ミント機能の構築と適格性の動的なチェックの両方が可能になります。

次のスニペットは、`candyMachine`アカウントが以前に取得されていることを前提としています。または、`candyMachine.mintAuthority`の代わりにCandy GuardのpublicKeyをハードコーディングすることもできます。

```ts
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cg" %}

{% totem-accordion title="Candy Guard Data" %}
{% totem-prose %}
このオブジェクトでUI にとって最も重要なフィールドは`guards`オブジェクトです。これには、常に適用される`default` guardsが含まれています。`guards.groups`には、異なる[Guard Groups](/ja/smart-contracts/core-candy-machine/guard-groups)が含まれています。
{% /totem-prose %}

```json
{
    "publicKey": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "header": {
        "executable": false,
        "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
        "lamports": {
            "basisPoints": "2561280",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        44,
        207,
        199,
        184,
        112,
        103,
        34,
        181
    ],
    "base": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "bump": 255,
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "guards": {
        "botTax": {
            "__option": "None"
        },
        "solPayment": {
            "__option": "None"
        },
        "tokenPayment": {
            "__option": "None"
        },
        "startDate": {
            "__option": "None"
        },
        "thirdPartySigner": {
            "__option": "None"
        },
        "tokenGate": {
            "__option": "None"
        },
        "gatekeeper": {
            "__option": "None"
        },
        "endDate": {
            "__option": "None"
        },
        "allowList": {
            "__option": "None"
        },
        "mintLimit": {
            "__option": "None"
        },
        "nftPayment": {
            "__option": "None"
        },
        "redeemedAmount": {
            "__option": "None"
        },
        "addressGate": {
            "__option": "None"
        },
        "nftGate": {
            "__option": "None"
        },
        "nftBurn": {
            "__option": "None"
        },
        "tokenBurn": {
            "__option": "None"
        },
        "freezeSolPayment": {
            "__option": "None"
        },
        "freezeTokenPayment": {
            "__option": "None"
        },
        "programGate": {
            "__option": "None"
        },
        "allocation": {
            "__option": "None"
        },
        "token2022Payment": {
            "__option": "None"
        },
        "solFixedFee": {
            "__option": "None"
        },
        "nftMintLimit": {
            "__option": "None"
        },
        "edition": {
            "__option": "None"
        },
        "assetPayment": {
            "__option": "None"
        },
        "assetBurn": {
            "__option": "None"
        },
        "assetMintLimit": {
            "__option": "None"
        },
        "assetBurnMulti": {
            "__option": "None"
        },
        "assetPaymentMulti": {
            "__option": "None"
        },
        "assetGate": {
            "__option": "None"
        },
        "vanityMint": {
            "__option": "None"
        }
    },
    "groups": [
        {
            "label": "group1",
            "guards": {
                "botTax": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "10000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "lastInstruction": false
                    }
                },
                "solPayment": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "100000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "destination": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV"
                    }
                },
                "tokenPayment": {
                    "__option": "None"
                },
                "startDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1723996800"
                    }
                },
                "thirdPartySigner": {
                    "__option": "None"
                },
                "tokenGate": {
                    "__option": "None"
                },
                "gatekeeper": {
                    "__option": "None"
                },
                "endDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1729270800"
                    }
                },
                "allowList": {
                    "__option": "None"
                },
                "mintLimit": {
                    "__option": "Some",
                    "value": {
                        "id": 1,
                        "limit": 5
                    }
                },
                "nftPayment": {
                    "__option": "None"
                },
                "redeemedAmount": {
                    "__option": "None"
                },
                "addressGate": {
                    "__option": "None"
                },
                "nftGate": {
                    "__option": "None"
                },
                "nftBurn": {
                    "__option": "None"
                },
                "tokenBurn": {
                    "__option": "None"
                },
                "freezeSolPayment": {
                    "__option": "None"
                },
                "freezeTokenPayment": {
                    "__option": "None"
                },
                "programGate": {
                    "__option": "None"
                },
                "allocation": {
                    "__option": "None"
                },
                "token2022Payment": {
                    "__option": "None"
                },
                "solFixedFee": {
                    "__option": "None"
                },
                "nftMintLimit": {
                    "__option": "None"
                },
                "edition": {
                    "__option": "None"
                },
                "assetPayment": {
                    "__option": "None"
                },
                "assetBurn": {
                    "__option": "None"
                },
                "assetMintLimit": {
                    "__option": "None"
                },
                "assetBurnMulti": {
                    "__option": "None"
                },
                "assetPaymentMulti": {
                    "__option": "None"
                },
                "assetGate": {
                    "__option": "None"
                },
                "vanityMint": {
                    "__option": "None"
                }
            }
        },
    ]
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

### 追加のCandy Machine関連アカウントの取得
実装するGuardの選択により、追加のアカウントを取得する必要がある場合があります。たとえば、ウォレットのミント適格性を確認する予定があり、`mintLimit` Guardを使用している場合は、`mintCounter`アカウントを取得する必要があります。このアカウントは、特定のウォレットがその特定のguard下でミントしたNFTの数を記録しています。

#### `MintLimit`アカウント
[`MintLimit`](/ja/smart-contracts/core-candy-machine/guards/mint-limit) guardがアクティブな場合、ユーザーのウォレットの`MintCounter`アカウントを取得することをお勧めします。これにより、ユーザーがミント制限に達しているか、まだ追加のアイテムをミントできるかどうかを確認できます。

以下のコードスニペットは、`MintCounter`を取得する方法を示しています。この例は、すでにCandy MachineとCandy Guardデータを取得していることを前提としています:

```ts
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // Guard設定で設定したmintLimit id
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `NftMintLimit`アカウント
`MintLimit` guardと同様に、[`NftMintLimit`](/ja/smart-contracts/core-candy-machine/guards/nft-mint-limit) guardの`NftMintCounter`アカウントを取得して適格性を確認することが理にかなっています。

以下のコードスニペットは、`NftMintCounter`アカウントを取得する方法を示しています。この例は、すでにCandy MachineとCandy Guardデータを取得していることを前提としています:

```ts
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // Guard設定で設定したnftMintLimit id
  mint: asset.publicKey, // ユーザーが所有するnftのアドレス
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```

#### `AssetMintLimit`アカウント
`NftMintCounter` guardと同様に、[`AssetMintLimit`](/ja/smart-contracts/core-candy-machine/guards/asset-mint-limit) guardの`AssetMintCounter`アカウントを取得して適格性を確認することが理にかなっています。

以下のコードスニペットは、`AssetMintCounter`アカウントを取得する方法を示しています。この例は、すでにCandy Machineデータを取得していることを前提としています:

```ts
import {
  findAssetMintCounterPda,
  fetchAssetMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findAssetMintCounterPda(umi, {
  id: 1, // Guard設定で設定したassetMintLimit id
  asset: asset.publicKey, // ユーザーが所有するcore nftのアドレス
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const assetMintCounter = fetchAssetMintCounter(umi, pda);
```

#### `Allocation`アカウント
`Allocation` guardの場合、`AllocationTracker`アカウントを取得して、特定のグループから追加のNFTをミントできることを確認することが理にかなっています。

以下のコードスニペットは、`AllocationTracker`アカウントを取得する方法を示しています。この例は、すでにCandy Machineデータを取得していることを前提としています:

```ts
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // Guard設定で設定したallocation id
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `Allowlist`アカウント
Allowlist guardを実装する場合、事前に`route`命令を実行することが重要です。この命令は、各ウォレットとCandy Machineの組み合わせに対して一意のアカウントを生成し、ウォレットがミントを承認されていることを効果的にマークします。

UI観点から、このアカウントを照会することは有益です。これにより、`route`命令を実行する必要があるか、ユーザーがミント命令に直接進めるかを判断できます。

以下のコードスニペットは、このアカウントを取得する方法を示しています。すでにCandy Machineデータを取得していることを前提としていますが、望む場合は、代わりに`candyGuard`と`candyMachine`のpublicKeyをハードコーディングすることもできます。

```ts
import {
  safeFetchAllowListProofFromSeeds,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowlist = [
  "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy"
];

const allowListProof = await safeFetchAllowListProofFromSeeds(umi, {
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
});
```

### ウォレットデータの取得
適格性を検証するために、接続されたウォレットに関する情報を取得することもできます。使用しているGuardに応じて、ウォレット内のSOLの量、ウォレットが所有しているTokenとNFTを知りたい場合があります。

SOL残高を取得するには、組み込みの`getAccount` umi関数を使用してウォレットアカウントを取得できます:
```ts
const account = await umi.rpc.getAccount(umi.identity.publicKey);
const solBalance = account.lamports;
```

TokenまたはNFTを必要とするguardのいずれかを使用している場合は、それらも取得することをお勧めします。このためには[DAS API](/ja/dev-tools/das-api/methods/get-assets-by-owner)を使用することをお勧めします。DASは、RPCプロバイダーによって維持されるTokenのインデックスです。これを使用すると、すべての必要な情報を1回の呼び出しで取得できます。UIでは、返されたオブジェクトを使用して、接続されたウォレットが必要なトークンまたはNFTを所有しているかどうかを確認できます。

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

// 以前のどこかでumiインスタンスを定義するときに、
// すでに`.use(dasApi());`を追加できるので、umiを再度定義する必要はありません。
const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByOwner({
    umi.identity.publicKey
});

```

## 適格性の検証
すべての必要なデータを取得した後、接続されたウォレットがミントを許可されているかどうかを確認できます。

Candy Machineにグループが添付されている場合、`default` guardsは作成されたすべてのグループに普遍的に適用されることに注意することが重要です。また、グループが有効になっている場合、`default`グループからミントする機能は無効になり、作成されたグループをミントに使用する必要があります。

したがって、グループが定義されていない場合は、`default`グループのすべてのミント条件が満たされているかどうかを確認する必要があります。グループが定義されている場合は、`default` guardsと現在のミントグループのguardsの両方を検証する必要があります。

グループを活用していない`startDate`、`SolPayment`、および`mintLimit` guardsが添付されたCandy Machineが与えられた場合、ユーザーがミント関数を呼び出すことを許可する前に、次の検証を行う必要があります。`candyGuard`が以前に取得されており、1つのCore NFTアセットをミントすることを前提としています。

1. `startDate`が過去であることを検証します。ここではユーザーのデバイス時間を使用せず、代わりに現在の内部Solanaブロックタイムをフェッチしています。これは、Candy Machineがミント時の検証に使用する時間だからです:
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

let allowed = true;

// 現在のスロットを取得してブロックタイムを読み取ります
const slot = await umi.rpc.getSlot();
let solanaTime = await umi.rpc.getBlockTime(slot);

// `default` startDate guardが添付されているかを確認します
const startDate = unwrapOption(candyGuard.guards.startDate);
if (startDate) {
  // startTimeが将来にあることを検証します
  if (solanaTime < startDate) {
        console.info(`StartDate not reached!`);
        allowed = false;
  }
}
```

2. ウォレットがミントの支払いに十分なSOLを持っているかを確認します。ここでは取引手数料を含めておらず、`SolBalance`が上記のように取得されていると仮定しています。
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`Not enough SOL!`);
    allowed = false;
  }
}
```

3. `mintLimit`にまだ達していないことを確認します:
```ts
import { unwrapOption } from '@metaplex-foundation/umi';
import {
  safeFetchMintCounterFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
if (mintLimit){
      const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    // mintCounter PDAが存在する(最初のミントではない)
    if (mintCounter && mintLimit.limit >= mintCounter.count
    ) {
      allowed = false;
    }
}
```

ウォレットがミント不適格な場合、ミントボタンを無効にして、ミント不適格の理由をユーザーに表示すると役立ちます。例えば、`Not enough SOL!`メッセージなど。

## Guard Routes
特定のGuardは、ミントが発生する前に実行する必要がある特定の命令を必要とします。これらの命令は、データを保存するアカウントを作成するか、ウォレットのミント適格性の証明を提供します。これらの命令の実行頻度は、Guardのタイプによって異なります。

{% callout type="note" title="このセクションの対象者" %}
`Allocation`、`FreezeSolPayment`、`FreezeTokenPayment`、または`Allowlist` guardを使用していない場合は、このセクションをスキップしても安全です。
{% /callout %}

一部のGuardは、Candy Machine全体に対して一度だけルートを実行する必要があります。これらについては、UIに関数を含める必要はありませんが、スクリプトを介して一度事前に実行できます:
- [Allocation](/ja/smart-contracts/core-candy-machine/guards/allocation)
- [FreezeSolPayment](/ja/smart-contracts/core-candy-machine/guards/freeze-sol-payment)
- [FreezeTokenPayment](/ja/smart-contracts/core-candy-machine/guards/freeze-token-payment)

他のGuardは、個々のウォレットごとにルートを実行する必要があります。これらの場合、ルート命令はミントトランザクションの前に実行する必要があります:
- [Allowlist](/ja/smart-contracts/core-candy-machine/guards/allow-list)

Guardルートの実装方法の例として、**Allowlist** guardのケースを考えてみましょう。これは、`allowListProof`が前述のように取得されており、`allowlist`が適格なウォレットアドレスの配列を表していることを前提としています。以下のコードは、実装でこのシナリオを処理する方法を示しています。

```ts
import {
  getMerkleRoot,
  getMerkleProof,
  route
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
  publicKey,
} from "@metaplex-foundation/umi";

// 上記で説明したようにAllowListProofを取得したと仮定します
if (allowListProof === null) {
  route(umi, {
    guard: "allowList",
    candyMachine: candyMachine.publicKey,
    candyGuard: candyMachine.mintAuthority,
    group: "default", // ここにguardラベルを追加します
    routeArgs: {
      path: "proof",
      merkleRoot: getMerkleRoot(allowlist),
      merkleProof: getMerkleProof(allowlist, publicKey(umi.identity)),
    },
  })
}
```

## ミント関数の作成
添付されているすべてのguardの適格性チェックを実装することをお勧めします。グループが添付されている場合、`default` guardsがすべての追加グループに適用される一方で、同時に`default`グループが無効になることに注意してください。

これらのチェックが完了し、必要に応じてルート命令が実行された後、ミントトランザクションを構築できます。Guardに応じて、`mintArgs`を渡す必要がある場合があります。これらは、正しいアカウントとデータを渡すことでミントトランザクションを構築するのに役立つ引数です。たとえば、`mintLimit` guardは`mintCounter`アカウントを必要とします。Umi SDKはこれらの詳細を抽象化しますが、トランザクションを正しく構築するためには、いくつかの情報が必要です。

再び`startDate`、`SolPayment`、および`mintLimit` Guardsが添付されたCandy Machineを仮定して、`mintArgs`を構築する方法を見てみましょう。

```ts
import { some, unwrapOption } from '@metaplex-foundation/umi';
import {
  DefaultGuardSetMintArgs
} from "@metaplex-foundation/mpl-core-candy-machine";

let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

// solPayment mintArgsを追加します
const solPayment = unwrapOption(candyGuard.guards.solPayment)
if (solPayment) {
  mintArgs.solPayment = some({
    destination: solPayment.destination,
  });
}

// mintLimit mintArgsを追加します
const mintLimit = unwrapOption(candyGuard.guards.mintLimit)
if (mintLimit) {
  mintArgs.mintLimit = some({ id: mintLimit.id });
}
```

すべてのGuardが追加の`mintArgs`を渡す必要があるわけではありません。これが、上記のコードスニペットに`startDate`がない理由です。使用しているguardsが`mintArgs`を渡す必要があるかどうかを理解するには、[Developer Hub](/ja/smart-contracts/core-candy-machine) Guardページを確認することをお勧めします。「Mint Settings」が記述されている場合、このguardに対して`mintArgs`を渡す必要があります。

`mintArgs`が構築されたので、ミント関数自体を呼び出す方法を見てみましょう。次のスニペットは、`candyMachine`と`candyGuard`が上記のように取得されていることを前提としています。技術的には、`candyMachine`、`collection`、`candyGuard`のpublicKeyとすべての`mintArgs`は、取得したくない場合は手動で渡すこともできます。

```ts
// NFTアドレスを生成します
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 高度なミントテクニック

これまでに説明した基本的なミント関数はほとんどのケースでうまく機能しますが、ミントプロセスを強化するために使用できる高度なテクニックがいくつかあります。これらのいくつかを探ってみましょう:

### 1つのトランザクションで複数のNFTをミントする

効率性のために、ユーザーが1つのトランザクションで複数のNFTをミントできるようにすることができます。これを実現する方法は次のとおりです:

特定の設定に応じて、[Transaction Builders](/ja/dev-tools/umi/transactions#transaction-builders)を組み合わせることで、1つのトランザクションで複数のNFTをミントできるようにすると役立つ場合があります。

```ts
let builder = transactionBuilder()
  .add(mintV1(...))
  .add(mintV1(...))
```

トランザクションに`mintV1`命令を追加しすぎると、`Transaction too large`エラーが発生します。関数[`builder.fitsInOneTransaction(umi)`](/ja/dev-tools/umi/transactions#transaction-builders)を使用すると、トランザクションを送信する前にこれを確認できるため、送信前にトランザクションを分割できます。分割が必要な場合は、[`signAllTransactions`](/ja/dev-tools/umi/transactions#building-and-signing-transactions)を使用することをお勧めします。これにより、Wallet Adapterで承認する必要があるポップアップが1つだけになります。

### Guard Groups

Guard groupsは、異なる設定で複数のguardセットを定義できるCore Candy Machineの強力な機能です。以下のようなシナリオで特に役立ちます:

1. 階層化されたミント:VIP、早期アクセス、一般販売用の異なるグループ。
2. 複数の支払いオプション:SOL支払い、SPLトークン支払いなどのグループ。
3. 時間ベースのミント:異なる開始日と終了日を持つグループ。
4. Allowlistベースのミント:Allowlistユーザーと一般販売用のグループ。

UIでguard groupsを実装するには、2つの主なアプローチがあります:

1. 複数のボタンアプローチ:
   各グループに個別のボタンを作成し、ユーザーが好みのミントオプションを選択できるようにします。

2. 自動グループ選択:
   ユーザーの適格性と現在の条件に基づいて、ユーザーに最適なグループを決定する関数を実装します。

選択するシナリオまたはアプローチに関係なく、特定のグループで機能するように`mintV1`命令を調整する方法は次のとおりです。主な変更は、目的のラベルを指定する`group`パラメーターを含めることです。

```ts
// NFTアドレスを生成します
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
  group: "group1",
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 次のステップ

フロントエンドでCandy Machineと対話する基本をマスターしたので、プロジェクトをさらに強化および配布するために、次のステップを検討することをお勧めします:

1. ホスティング:ホスティングプラットフォームにデプロイして、ユーザーがフロントエンドにアクセスできるようにします。開発者の間で人気のあるオプションには次のものがあります:
   - Vercel
   - Cloudflare Pages
   - Netlify
   - GitHub Pages

2. テスト:スムーズなユーザーエクスペリエンスを確保するために、さまざまなデバイスとブラウザでUIを徹底的にテストします。

3. 最適化:特にミントイベント中に高トラフィックが予想される場合は、パフォーマンスのためにフロントエンドを微調整します。

8. モニタリング:Candy Machine UIのステータスを追跡し、発生する可能性のある問題に迅速に対処するために、監視ツールを設定します。

これらの領域に焦点を当てることで、Core Candy Machineを使用して成功したNFTミントプロジェクトを立ち上げ、維持する準備が整います。
