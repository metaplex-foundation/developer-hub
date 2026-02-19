---
title: Core Candy Machine用カスタムガードクライアントの生成
metaTitle: カスタムガードクライアント | Core Candy Machine
description: 最新のCore Candy Machineプログラム用にカスタムビルドされたガードのUmi互換クライアントを生成する方法を学びます。
---

Candy Machine Guardプログラム用のカスタムガードを作成したら、例えばフロントエンドでガードを使用できるようにするために、Umi SDKで動作するKinobiクライアントを生成する必要があります。

## IDLと初期クライアントの生成

### Shankjsの設定

ShankjsはAnchorと非AnchorプログラムstorebothBothに対応するIDLジェネレータです。動作するクライアントを適切に生成するために、新しいカスタムCandy Guardデプロイキーでこれを設定したいと思います。mpl-candy-machineリポジトリの`/configs/shank.cjs`にあるファイルを編集します。

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // カスタムCandy Guardデプロイされたプログラムキー。
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
anchor 28を使用して生成している場合、欠落したcrates.ioクレートのため、ShankjsのIDLジェネレータにanchor 27へのフォールバックを追加する必要があります。
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // カスタムCandy Guardデプロイされたプログラムキー。
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

これで、IDLと初期クライアントを生成できるはずです。プロジェクトのルートから以下を実行します

```shell
pnpm run generate
```

これにより、`pnpm generate:idls`と`pnpm generate:clients`の両方のスクリプトが実行され、初期クライアントが構築されます。
何らかの理由でこれらを個別に実行する必要がある場合は、そうすることができます。

## ガードをクライアントに追加

### ガードファイルの作成

初期クライアントの生成が成功したら、`/clients/js/src`に移動します。

最初のステップは、新しいガードを`/clients/js/src/defaultGuards`フォルダに追加することです。

以下は、作成したガードのタイプに基づいて調整できるテンプレートです。
ガードには好きな名前を付けることができますが、例では`customGuard.ts`と名付けます

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
      // ミント引数からカスタムガードに必要なアカウントを渡します。
      // ガードには残存アカウントが必要な場合とそうでない場合があります。
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// ここで、ガードが動作するために必要なカスタムミント引数を記入します。
// ガードにはMintArgsが必要な場合とそうでない場合があります。

export type CustomGuardMintArgs = {
  /**
   * カスタムガードミント引数1
   */
  publicKeyArg1: PublicKey

  /**
   * カスタムガードミント引数2
   */
  publicKeyArg2: PublicKey

  /**
   * カスタムガードミント引数3。
   */
  arg3: Number
}
```

### 既存のファイルにガードを追加

ここから、新しいガードをいくつかの既存ファイルに追加する必要があります。

`/clients/js/src/defaultGuards.index.ts`から新しいガードをエクスポートします

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// ガードをリストに追加
export * from './customGuard';
```

`/clients/js/src/defaultGuards.defaults.ts`内で、これらの場所にガードを追加します：

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // ガードをリストに追加
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

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

最後に、エクスポートしたcustomGuardManifestを`/clients/js/src/plugin.ts`にあるプラグインファイルに追加する必要があります

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// ガードマニフェストをリストに追加
  customGuardManifest
)
```

この時点から、クライアントパッケージをビルドしてnpmにアップロードするか、新しいガードクライアントにアクセスしたいプロジェクトフォルダにリンク/移動できます。

複数のシナリオでガードを完全にテストするためのAVAの組み込みテストスイートを使用する価値があります。テストの例は`/clients/js/tests`で見つけることができます。
