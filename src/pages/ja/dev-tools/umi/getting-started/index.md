---
title: はじめに
metaTitle: はじめに | Umi
description: Solana向けのJavaScriptフレームワーク。
---

## Umiのインストール

Umiを使用するには、Umiと使用したいすべての外部プラグインをインストールする必要があります。また、特定のプラグインが不要な場合は、ほとんどのユースケースに適したプラグインセットを含むデフォルトバンドルをインストールできます。

**注意**: デフォルトバンドルは一部のインターフェースでweb3.jsに依存しているため、そのパッケージもインストールする必要があります。

### 必要なパッケージ

{% packagesUsed packages=["umi", "umiDefaults", "@solana/web3.js@1"] type="npm" /%}

インストールするには、以下のコマンドを使用してください：

```
npm i @metaplex-foundation/umi 
```

```
npm i @metaplex-foundation/umi-bundle-defaults 
```

```
npm i @solana/web3.js@1
```

### ライブラリ作成者向け

依存関係を大幅に削減するためにUmiのインターフェースを使用したいライブラリ作成者は、メインのUmiライブラリのみをインストールする必要があります。エンドユーザーがUmiライブラリの複数バージョンを持つことがないよう、以下のコマンドを使用してピア依存関係としてインストールすることを強く推奨します：

```
npm i @metaplex-foundation/umi --save-peer
```

その後、Umiの`Context`オブジェクトまたはそのサブセットを使用して、関数で必要なインターフェースを注入できます。

{% totem %}

{% totem-accordion title="例" %}

```ts
import type { Context, PublicKey } from '@metaplex-foundation/umi';
import { u32 } from '@metaplex-foundation/umi/serializers';

export async function myFunction(
  context: Pick<Context, 'rpc'>, // <-- 必要なインターフェースを注入。
  publicKey: PublicKey
): number {
  const rawAccount = await context.rpc.getAccount(publicKey);
  if (!rawAccount.exists) return 0;
  return u32().deserialize(rawAccount.data)[0];
}
```

{% /totem-accordion %}

{% /totem %}

### テスト用

また、Umiには、エンドユーザーとライブラリ作成者の両方がコードをテストするのに役立つテストバンドルが付属していることにも注意してください。たとえば、`UploaderInterface`と`DownloaderInterface`の両方で使用される`MockStorage`実装が含まれているため、実際のストレージプロバイダーに依存することなく、確実にコードをテストできます。

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-tests
```

## Umiの基本

このセクションでは、Umiを使い始めるための基本的な手順を説明します：
- [Umiの作成とRPCへの接続](/ja/dev-tools/umi/getting-started#connecting-to-an-rpc)
- [ウォレットの接続](/ja/dev-tools/umi/getting-started#connecting-a-wallet)
- [プログラムとクライアントの登録](/ja/dev-tools/umi/getting-started#registering-programs-and-clients)

### RPCへの接続

Solanaには、さまざまな目的を果たす異なるクラスター（例：Mainnet-beta、Devnet、Testnetなど）があり、それぞれがRPCリクエストを処理するための専用APIノードを持っています。

UmiをクラスターのRPCエンドポイントが最初の引数として渡されるため、Umiを選択されたクラスターに接続することは、umiインスタンスを作成するのと同じくらい簡単です。

**注意**: **Mainnet**に接続する場合は、制限があるパブリックエンドポイント（`https://api.mainnet-beta.solana.com`）の代わりに、Solana RPCプロバイダーからの専用RPCエンドポイントを使用することを推奨します。

Umiインスタンスを作成するには、`createUmi`関数をインポートしてRPCエンドポイントを提供します。オプションで、2番目の引数としてコミットメントレベルも指定できます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('<RPC-Endpoint>', '<Commitment-Level>')
```

### ウォレットの接続

Umiをセットアップする際、トランザクションを送信するためにウォレットを使用または生成する必要があります。これを行うには、**テスト用に新しいウォレットを作成**、**ファイルシステムから既存のウォレットをインポート**、またはWebベースのdApps用に**walletAdapterを使用**できます。

**注意**: `walletAdapter`セクションは、`walletAdapter`が既にインストールおよび設定されていることを前提として、UmiにそれをPGする必要があるコードのみを提供します。包括的なガイドについては、[こちら](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)を参照してください。

{% totem %}

{% totem-accordion title="新しいウォレットから" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// 新しいキーペア署名者を生成。
const signer = generateSigner(umi)

// Umiに新しい署名者を使用するよう指示。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="ファイルシステムに保存された既存のウォレットから" %}

```ts
import * as fs from "fs";
import * as path from "path";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// fsを使用してファイルシステムをナビゲートし、
// 相対パスを通じて使用したいウォレットに到達。
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 通常、キーペアはUint8Arrayとして保存されるため、
// 使用可能なキーペアに変換する必要があります。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Umiがこのキーペアを使用する前に、
// それでSigner型を生成する必要があります。
const signer = createSignerFromKeypair(umi, keypair);

// Umiに新しい署名者を使用するよう指示。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="ウォレットアダプターを使用して保存された既存のウォレットから" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')

// ウォレットアダプターをUmiに登録
umi.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**注意**: **Umi**インターフェースは**Signer**の2つのインスタンスを格納します：アプリケーションを使用する**identity**と、トランザクションとストレージ料金を支払う**payer**です。デフォルトでは、`signerIdentity`メソッドは**payer**属性も更新します。なぜなら、ほとんどの場合、identityもpayerであるからです。

詳細については、[Umiコンテキストインターフェースの段落](/ja/dev-tools/umi/interfaces#the-context-interface)をご覧ください。

### プログラムとクライアントの登録

場合によっては、Umiで使用したいプログラムやクライアントを指定する必要があります（例：Coreアセットをミントする場合、Umiに`Core`プログラムを使用するよう指示する必要があります）。これは、Umiインスタンスで`.use()`メソッドを呼び出し、クライアントを渡すことで行えます。

以下は、`mpl-token-metadata`クライアントをUmiに登録する方法です：

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
```

**注意**: 複数のクライアントを登録するために、このように`.use()`呼び出しをチェーンすることもできます：

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine())
```
