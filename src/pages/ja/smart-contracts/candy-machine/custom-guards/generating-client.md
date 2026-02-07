---
title: Candy Machineのカスタムガードクライアント生成
metaTitle: カスタムガードクライアント生成 | Candy Machine
description: カスタムガード用のUmi互換クライアントを生成する方法。
---

Candy Machine Guardプログラム用のカスタムガードを作成したら、フロントエンドなどでガードを使用できるようにするために、Umi SDKと連携するKinobiクライアントを生成する必要があります。

## IDLと初期クライアントの生成

### Shankjsの設定

ShankjsはAnchorと非Anchorプログラムの両方で動作するIDLジェネレーターです。新しいカスタムCandy Guardデプロイメントキーでこれを設定して、適切に動作するクライアントを生成する必要があります。mpl-candy-machineリポジトリの`/configs/shank.cjs`にあるファイルを編集してください。

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // あなたのカスタムCandy Guardデプロイ済みプログラムキー
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
anchor 28を使用して生成する場合、crates.ioクレートが不足しているため、ShankjsのIDLジェネレーターにanchor 27へのフォールバックを追加する必要があります。
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // あなたのカスタムCandy Guardデプロイ済みプログラムキー
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### IDLとクライアントの生成

これでIDLと初期クライアントを生成できるはずです。プロジェクトのルートから以下を実行してください：

```shell
pnpm run generate
```

これにより`pnpm generate:idls`と`pnpm generate:clients`の両方のスクリプトが実行され、初期クライアントが構築されます。
何らかの理由でこれらを別々に実行する必要がある場合は、それも可能です。

## クライアントへのガードの追加

### ガードファイルの作成

初期クライアントの生成が成功したら、`/clients/js/src`に移動してください。

最初のステップは、`/clients/js/src/defaultGuards`フォルダに新しいガードを追加することです。

以下は、作成したガードのタイプに基づいて調整し、あなたのニーズに合わせて使用できるテンプレートです。
ガードには任意の名前を付けることができますが、例では`customGuard.ts`と名付けます：

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import {
  getCustomGuardSerializer,
  CustomGuard,
  CustomGuardArgs,
} from '../generated'
import { GuardManifest, noopParser } from '../guards'

export const customGuardManifest: GuardManifest<
  CustomGuardArgs,
  CustomGuard,
  CustomGuardMintArgs
> = {
  name: 'customGuard',
  serializer: getCustomGuardSerializer,
  mintParser: (context, mintContext, args) => {
    const { publicKeyArg1, arg1 } = args
    return {
      data: new Uint8Array(),
      // カスタムガードに必要なアカウントをmint argsから渡します。
      // あなたのガードは残りのアカウントが必要な場合とそうでない場合があります。
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// ここで、ガードが動作するために必要なカスタムMint引数を記入します。
// あなたのガードはMintArgsが必要な場合とそうでない場合があります。

export type CustomGuardMintArgs = {
  /**
   * カスタムガードMint引数1
   */
  publicKeyArg1: PublicKey

  /**
   * カスタムガードMint引数2
   */
  publicKeyArg2: PublicKey

  /**
   * カスタムガードMint引数3
   */
  arg3: Number
}
```

### 既存ファイルへのガードの追加

ここから、いくつかの既存ファイルに新しいガードを追加する必要があります。

`/clients/js/src/defaultGuards/index.ts`から新しいガードをエクスポートしてください：

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// ガードをリストに追加
export * from './customGuard';
```

`/clients/js/src/defaultGuards/defaults.ts`内で、以下の場所にガードを追加してください：

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // ガードをリストに追加
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { CustomGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // ガードをリストに追加
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // ガードをリストに追加
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// ガードをリストに追加
  'customGuard',
]
```

最後に、`/clients/js/src/plugin.ts`にあるプラグインファイルにエクスポートしたcustomGuardManifestを追加する必要があります：

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// ガードマニフェストをリストに追加
  customGuardManifest
)
```

この時点で、クライアントパッケージをビルドしてnpmにアップロードするか、新しいガードクライアントにアクセスしたいプロジェクトフォルダーにリンク/移動することができます。

AVAの内蔵テストスイートを使用して、複数のシナリオでガードを完全にテストするテストを書くことは価値があります。テストの例は`/clients/js/tests`で見つけることができます。
