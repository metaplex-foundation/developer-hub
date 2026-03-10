---
title: Core Candy Machine用カスタムガードクライアントの生成
metaTitle: カスタムガードクライアント | Core Candy Machine
description: KinobiとShankjsを使用して、Core Candy MachineプログラムのカスタムガードのUmi互換JavaScriptクライアントを生成する方法を学びます。
keywords:
  - custom guard
  - core candy machine
  - kinobi
  - IDL
  - shankjs
  - client generation
  - umi sdk
  - candy guard
  - solana nft
  - custom minting logic
  - guard manifest
  - code generation
  - metaplex
about:
  - Custom guards
  - Client generation
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

カスタムガードクライアントの生成は、カスタム[Core Candy Machine](/ja/smart-contracts/core-candy-machine)ガードプログラムから[Umi](/ja/dev-tools/umi)互換のJavaScript SDKを生成し、フロントエンドおよびスクリプトの統合を可能にします。 {% .lead %}

- [Shankjs](https://github.com/metaplex-foundation/shank)を使用してカスタムCandy GuardプログラムからIDLを生成
- Kinobiコードジェネレーターを実行してTypeScriptクライアントファイルを生成
- ガードマニフェスト、型、ミント引数を生成されたクライアントパッケージに登録
- クライアントパッケージをビルドしてnpmに公開するか、ローカルにリンク

## IDLと初期クライアントの生成

カスタムガードを作成した後の最初のステップは、[mpl-core-candy-machineリポジトリ](https://github.com/metaplex-foundation/mpl-core-candy-machine)からShankjsとKinobiを使用してIDLと初期TypeScriptクライアントを生成することです。

### ShankjsのIDL生成設定

ShankjsはAnchorと非Anchorプログラムの両方に対応するIDLジェネレーターです。mpl-candy-machineリポジトリの`/configs/shank.cjs`にあるファイルを編集して、カスタムCandy Guardデプロイキーで設定します。

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
anchor 28を使用して生成している場合、欠落したcrates.ioクレートのため、ShankjsのIDLジェネレーターにanchor 27へのフォールバックを追加する必要があります。
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### IDLとクライアント生成の実行

これでIDLと初期クライアントを生成できます。プロジェクトのルートから以下を実行します。

```shell
pnpm run generate
```

これにより、`pnpm generate:idls`と`pnpm generate:clients`の両方のスクリプトが実行され、初期クライアントが構築されます。
何らかの理由でこれらを個別に実行する必要がある場合は、そうすることができます。

## 生成されたクライアントへのカスタムガードの追加

初期クライアントの生成が成功したら、ガードファイルを作成し、クライアントの型システムに登録する必要があります。

### ガードファイルの作成

生成されたクライアントの`/clients/js/src/defaultGuards`に移動して、カスタムガード用の新しいファイルを作成します。以下のテンプレートは、作成したガードのタイプに基づいて調整できます。この例では`customGuard.ts`という名前を使用しています。

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
      // Pass in any accounts needed for your custom guard from your mint args.
      // Your guard may or may not need remaining accounts.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// Here you would fill out any custom Mint args needed for your guard to operate.
// Your guard may or may not need MintArgs.

export type CustomGuardMintArgs = {
  /**
   * Custom Guard Mint Arg 1
   */
  publicKeyArg1: PublicKey

  /**
   * Custom Guard Mint Arg 2
   */
  publicKeyArg2: PublicKey

  /**
   * Custom Guard Mint Arg 3.
   */
  arg3: Number
}
```

### 既存のファイルへのガードの登録

ガードファイルを作成した後、生成されたクライアント内のいくつかの既存ファイルにガードを登録する必要があります。

`/clients/js/src/defaultGuards/index.ts`から新しいガードをエクスポートします。

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// add your guard to the list
export * from './customGuard';
```

`/clients/js/src/defaultGuards/defaults.ts`内で、以下の場所にガードを追加します:

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // add your guard to the list
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// add your guard to the list
  'customGuard',
]
```

最後に、エクスポートしたcustomGuardManifestを`/clients/js/src/plugin.ts`にあるプラグインファイルに追加する必要があります。

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// add your guard manifest to the list
  customGuardManifest
)
```

この時点から、クライアントパッケージをビルドしてnpmにアップロードするか、新しいガードクライアントにアクセスしたいプロジェクトフォルダにリンク/移動できます。

## Notes

- このワークフローには、[mpl-core-candy-machineリポジトリ](https://github.com/metaplex-foundation/mpl-core-candy-machine)のフォークが必要です。クローンして、そのフォーク内で作業してください。
- 組み込みの[AVA](https://github.com/avajs/ava)テストスイートを使用して、複数のシナリオでカスタムガードを完全にテストするテストを作成してください。テストの例は`/clients/js/tests`で見つけることができます。
- Anchor 28を使用する場合は、欠落したcrates.io依存関係のため、上記のように`rustbin`フォールバック設定をShankjsに追加する必要があります。
- 生成されたクライアントファイルは、カスタムガードの登録を追加する以外は、生成後に手動で編集しないでください。

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)によりメンテナンス · 最終確認 2026年3月*
