---
title: Metaplex Solana NextJs Tailwind テンプレート
metaTitle: Metaplex Solana NextJs Tailwind テンプレート | Web UIテンプレート
description: Nextjs、Tailwind、Metaplex Umi、Solana WalletAdapter、およびZustandを使用するWeb UIテンプレート。
---

Nextjsとは、使いやすくするために Metaplex Umi、Solana WalletAdapter、およびZustandグローバルストアがプリインストールされながら、フロントエンドフレームワークにNextjsとTailwindを利用したダウンロード可能で再利用可能なテンプレート。

{% image src="/images/metaplex-next-js-template.png" alt="Metaplex Next.js Tailwind Template Screenshot" classes="m-auto" /%}

## 機能

- Nextjs Reactフレームワーク
- Tailwind
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- ダーク/ライトモード
- Umiヘルパー

## インストール

現在、少し異なる設定とUIフレームワーク/コンポーネントライブラリを持つNext JS用のテンプレートがいくつか利用可能です。

### Tailwind

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template.git
```

[GitHub Repository](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

### Tailwind + Shadcn

```shell
git clone https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template.git
```

[GitHub Repository](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-shadcn-template)

_以下のセクションは、このページにリストされているすべてのテンプレートで共有される共通機能をカバーしています。テンプレート固有の機能はここに含まれていません。個々のテンプレートの詳細なドキュメントについては、それぞれのGitHubリポジトリを参照してください。_

## セットアップ

### RPCの変更

プロジェクトにRPC URLを設定することは、以下のいずれかの方法で自由に行うことができます：

- .env
- constants.tsファイル
- umiに直接ハードコード

この例では、RPC URLが`src/store/useUmiStore.ts`の21行目にある`umiStore` umiステートにハードコードされています。

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // ここに独自のRPCを追加してください
  umi: createUmi("https://api.devnet.solana.com").use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```

## なぜZustand？

Zustandは、フックと通常のステート取得の両方からストアステートにアクセスできるグローバルストアです。

umiInstanceを**zustand**に保存することで、`.ts`と`.tsx`ファイルの両方でアクセスでき、`walletAdapter`などの他のプロバイダーやフックを通じてステートが更新される仕組みも持てます。

通常、umiにアクセスするには以下のヘルパーメソッドを使用する方が簡単ですが、`umiStore`ステートを自分で呼び出してステートメソッドに手動でアクセスすることもできます。

ヘルパーなしで`umi`ステートを直接取得する場合、umiインスタンスのみが取得され、最新の署名者は取得されません。設計上、walletAdapterがステートを変更すると、`umiStore`内の`signer`のステートは更新されますが、`umi`ステートには**自動的には**適用されません。署名者とumiインスタンスを明示的に結合されるまで分離しておくこの動作は、`umiProvider.tsx`ファイルで見ることができます。対照的に、`umi`[ヘルパー](#helpers)は常に`signer`ステートの新しいインスタンスを引き出します。

```ts
// umiProvider.txtスニペット
useEffect(() => {
  if (!wallet.publicKey) return
  // wallet.publicKeyが変更されると、新しいウォレットアダプターでumiStoreの署名者を更新します
  umiStore.updateSigner(wallet as unknown as WalletAdapter)
}, [wallet, umiStore])
```

### .tsxでUmiにアクセス

```ts
// フックを使用してumiStoreからumiステートを引き出します
const umi = useUmiStore().umi
const signer = useUmiStore().signer

umi.use(signerIdentity(signer))
```

### .tsでUmiにアクセス

```ts
// umiStoreからumiステートを引き出します
const umi = useUmiStore.getState().umi
const signer = useUmiStore.getState().signer

umi.use(signerIdentity(signer))
```

## ヘルパー

`/lib/umi`フォルダに、開発を簡単にするために使用できるいくつかの事前に作成されたヘルパーがあります。

Umiヘルパーは、異なるシナリオで呼び出すことができるいくつかの領域に分割されています。

### トランザクションヘルパー

#### sendAndConfirmWalletAdapter()

トランザクションを`sendAndConfirmWalletAdapter()`に渡すと、zustand `umiStore`から最新のwalletAdapterステートを引き出しながらトランザクションを送信し、署名を`string`として返します。これは`.ts`と`.tsx`ファイルの両方でアクセスできます。

この関数はまた、提供された場合に`blockhash`、`send`、`confirm`全体でコミットメントレベルを提供し、ロックします。値が渡されない場合、デフォルトで`confirmed`のコミットメントレベルが使用されます。

チェーン上で失敗したトランザクションをデバッグする必要がある場合に有効にできる`skipPreflight`フラグもあります。トランザクションエラーの詳細については、このガイド[SolanaでのトランザクションエラーDiagnosisの方法](/ja/guides/general/how-to-diagnose-solana-transaction-errors)を参照してください。

`sendAndConfirmWalletAdapter()`は、`setComputeUnitPrice`命令を通じて優先手数料に対応しています。これらは状況に応じて検討し、調整または削除される必要があります。

```ts
import useUmiStore from '@/store/useUmiStore'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'
import { TransactionBuilder, signerIdentity } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'


const sendAndConfirmWalletAdapter = async (
  tx: TransactionBuilder,
  settings?: {
    commitment?: 'processed' | 'confirmed' | 'finalized'
    skipPreflight?: boolean
      }
) => {
  const umi = useUmiStore.getState().umi
  const currentSigner = useUmiStore.getState().signer
  console.log('currentSigner', currentSigner)
  umi.use(signerIdentity(currentSigner!))

  const blockhash = await umi.rpc.getLatestBlockhash({
    commitment: settings?.commitment || 'confirmed',
  })

  const transactions = tx
    // トランザクションの優先手数料を設定します。不要な場合は削除できます。
    .add(setComputeUnitPrice(umi, { microLamports: BigInt(100000) }))
    .setBlockhash(blockhash)

  const signedTx = await transactions.buildAndSign(umi)

  const signature = await umi.rpc
    .sendTransaction(signedTx, {
      preflightCommitment: settings?.commitment || 'confirmed',
      commitment: settings?.commitment || 'confirmed',
      skipPreflight: settings?.skipPreflight || false,
    })
    .catch((err) => {
      throw new Error(`Transaction failed: ${err}`)
    })

  const confirmation = await umi.rpc.confirmTransaction(signature, {
    strategy: { type: 'blockhash', ...blockhash },
    commitment: settings?.commitment || 'confirmed',
  })
  return {
    signature: base58.deserialize(signature),
    confirmation,
  }
}

export default sendAndConfirmWalletAdapter
```

### Umiステート

#### umiWithCurrentWalletAdapter()

`umiWithCurrentWalletAdapter`は、`umiStore`から現在のwalletAdapterステートを持つ現在のumiステートを取得します。これは、現在のwalletAdapterユーザーを必要とするumiでトランザクションを作成したり操作を実行したりするために使用できます。

`.ts`と`.tsx`ファイルの両方で使用できます。

```ts
import useUmiStore from '@/store/useUmiStore'
import { signerIdentity } from '@metaplex-foundation/umi'

const umiWithCurrentWalletAdapter = () => {
  // ZustandがUmiインスタンスを保存するために使用されるため、Umiインスタンスは
  // フックと非フック形式の両方でストアからアクセスできます。これは、React
  // コンポーネントファイルではなくtsファイルで使用できる非フック形式の例です。

  const umi = useUmiStore.getState().umi
  const currentWallet = useUmiStore.getState().signer
  if (!currentWallet) throw new Error('ウォレットが選択されていません')
  return umi.use(signerIdentity(currentWallet))
}
export default umiWithCurrentWalletAdapter
```

#### umiWithSigner()

`umiWithSigner`は、署名者要素（`generateSigner()`、`createNoopSigner()`）を引数として渡すことを可能にし、ステートに現在保存されている`umi`インスタンスに割り当てられます。これは、秘密鍵や`generatedSigner`/`createNoopSigner`を使用する`umi`インスタンスが必要な場合に役立ちます。

`.ts`と`.tsx`ファイルの両方で使用できます。

```ts
import useUmiStore from '@/store/useUmiStore'
import { Signer, signerIdentity } from '@metaplex-foundation/umi'

const umiWithSigner = (signer: Signer) => {
  const umi = useUmiStore.getState().umi
  if (!signer) throw new Error('署名者が選択されていません')
  return umi.use(signerIdentity(signer))
}

export default umiWithSigner
```

### ヘルパーを使用したトランザクションの例

`/lib`フォルダ内には、`umiWithCurrentWalletAdapter()`を使用したumiステートの取得と、`sendAndConfirmWalletAdapter()`を使用した生成されたトランザクションの送信の両方を利用する`transferSol`例トランザクションがあります。

`umiWithCurrentWalletAdapter()`でumiストアからステートを引き出すことで、トランザクション引数のいずれかが`signer`型を必要とする場合、これは`walletAdapter`の現在のユーザーで生成されたumiインスタンスから自動的に引き出されます。この場合、`from`アカウントはumi（walletAdapter）に接続された現在の署名者によって決定され、私たちのトランザクションで自動推論されます。

次に、`sendAndConfirmWalletAdapter`でトランザクションを送信することで、署名プロセスは`walletAdapter`を使用し、現在のユーザーにトランザクションへの署名を求めます。その後、トランザクションはチェーンに送信されます。

```ts
// ReactコンポーネントではないtsファイルでuseUmiStoreから
// umiを引き出して、あるアカウントから別のアカウントにSOLを転送する関数の例

import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import umiWithCurrentWalletAdapter from './umi/umiWithCurrentWalletAdapter'
import { publicKey, sol } from '@metaplex-foundation/umi'
import sendAndConfirmWalletAdapter from './umi/sendAndConfirmWithWalletAdapter'

// この関数は現在のウォレットから宛先アカウントにSOLを転送し、
// zustandグローバルストア設定のため、プロジェクト内の任意のtsx/tsまたは
// コンポーネントファイルから呼び出し可能です

const transferSolToDestination = async ({
  destination,
  amount,
}: {
  destination: string
  amount: number
}) => {
  // `umiWithCurrentWalletAdapter`からUmiをインポート
  const umi = umiWithCurrentWalletAdapter()

  // mpl-toolboxの`transferSol`関数を使用してtransactionBuilderを作成
  // Umiはデフォルトで現在の署名者（walletAdapter）を使用して`from`アカウントも設定します
  const tx = transferSol(umi, {
    destination: publicKey(destination),
    amount: sol(amount),
  })

  // sendAndConfirmWalletAdapterメソッドを使用してトランザクションを送信
  // `sendAndConfirmWalletAdapter`関数内でumiStoreから新しいインスタンスが取得されるため、
  // umiスタンスまたはウォレットアダプターを引数として渡す必要はありません
  const res = await sendAndConfirmWalletAdapter(tx)
}

export default transferSolToDestination
```