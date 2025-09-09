---
title: Umiプラグイン
metaTitle: プラグイン | Umi
description: Metaplex Umiのプラグイン
---
Umiは小さなゼロ依存フレームワークですが、プラグインで拡張できるように設計されています。プラグインにより、インターフェースとの相互作用やインターフェース実装の交換だけでなく、Umi自体に新しい機能を追加することも可能です。

## プラグインの使用

Umiプラグインをインストールするには、Umiインスタンスで`use`メソッドを呼び出すだけです。この`use`メソッドはUmiインスタンスを返すため、それらをチェーンすることができます。

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin).use(myLocalPlugin);
```

ライブラリは、プラグイン自体ではなく、プラグインを返す関数を提供することが多いことは注目に値します。これは、プラグインの動作を設定するための引数を渡すことができるようにするために行われます。

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin(somePluginOptions))
  .use(myLocalPlugin(myLocalPluginOptions));
```

一貫性を保つため、Umiが提供するプラグインは、引数が不要な場合でも常にこのパターンに従います。以下にいくつかの例を示します：

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import { httpDownloader } from '@metaplex-foundation/umi-downloader-http';

umi.use(web3JsRpc('https://api.mainnet-beta.solana.com'))
  .use(mockStorage())
  .use(httpDownloader());
```

## プラグインの作成

内部的に、Umiは、Umiインスタンスを好きなように拡張するために使用できる`install`関数を持つオブジェクトとしてプラグインを定義します。

```ts
export const myPlugin: UmiPlugin = {
  install(umi: Umi) {
    // Umiインスタンスで何かを行う。
  },
}
```

上述のように、エンドユーザーから必要な引数を要求できるように、プラグイン関数をエクスポートすることが推奨されます。

```ts
export const myPlugin = (myPluginOptions?: MyPluginOptions): UmiPlugin => ({
  install(umi: Umi) {
    // Umiインスタンスで何かを行う。
  },
})
```

## プラグインで行うこと

プラグインの作成方法がわかったところで、それらで何ができるかのいくつかの例を見てみましょう。

### インターフェース実装の設定

プラグインの最も一般的な使用例の1つは、1つまたは複数のUmiインターフェースに実装を割り当てることです。以下は、架空の`MyRpc`実装を`rpc`インターフェースに設定する例です。必要に応じて他のインターフェースに依存できるよう、`MyRpc`実装にUmiインスタンスを渡すことができることに注意してください。

```ts
export const myRpc = (endpoint: string): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyRpc(umi, endpoint);
  },
})
```

### インターフェース実装のデコレーション

インターフェース実装を設定する別の方法は、既存のものをデコレートすることです。これにより、エンドユーザーは、基礎となる実装の詳細を心配することなく、既存の実装に追加の機能を加えることによって、プラグインを一緒に組み合わせることができます。

以下は、すべての送信されたトランザクションをサードパーティサービスにログ出力するように`rpc`インターフェースをデコレートするプラグインの例です。

```ts
export const myLoggingRpc = (provider: LoggingProvider): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyLoggingRpc(umi.rpc, provider);
  },
})
```

### バンドルの作成

プラグインもUmiインスタンスで`use`メソッドを呼び出すことができるため、プラグイン内でプラグインをインストールすることが可能です。これにより、一緒にインストールできるプラグインのバンドルを作成できます。

例えば、以下はUmiの「デフォルト」プラグインバンドルの定義方法です：

```ts
export const defaultPlugins = (
  endpoint: string,
  rpcOptions?: Web3JsRpcOptions
): UmiPlugin => ({
  install(umi) {
    umi.use(dataViewSerializer());
    umi.use(defaultProgramRepository());
    umi.use(fetchHttp());
    umi.use(httpDownloader());
    umi.use(web3JsEddsa());
    umi.use(web3JsRpc(endpoint, rpcOptions));
    umi.use(web3JsTransactionFactory());
  },
});
```

### インターフェースの使用

Umiのインターフェースを設定および更新することに加えて、プラグインはそれらを使用することもできます。これの一般的な使用例は、ライブラリがプログラムリポジトリインターフェースに新しいプログラムを登録できるようにすることです。以下は、Token Metadataライブラリがプログラムを登録する方法を示す例です。プログラムがまだ存在しない場合にのみ登録されるよう、`override`引数を`false`に設定することに注意してください。

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

### Umiインスタンスの拡張

最後に、プラグインはUmiインスタンスの機能セットを拡張することもできます。これにより、ライブラリは独自のインターフェースを提供したり、既存のものを拡張したりできます。

この良い例は、Candy Machineライブラリで、すべてのcandy guardsをリポジトリ（プログラムリポジトリのように）に格納します。これにより、エンドユーザーは独自のguardsを登録でき、関連するcandy guardsを持つcandy machinesを作成、取得、ミントする際に認識されるようになります。これを機能させるために、ライブラリはUmiインスタンスに新しい`guards`プロパティを追加し、新しいguardリポジトリを割り当てます。

```ts
export const mplCandyMachine = (): UmiPlugin => ({
  install(umi) {
    umi.guards = new DefaultGuardRepository(umi);
    umi.guards.add(botTaxGuardManifest);
    umi.guards.add(solPaymentGuardManifest);
    umi.guards.add(tokenPaymentGuardManifest);
    // ...
  },
});
```

上記のコードの軽微な問題は、`Umi`タイプがもはや実際のインスタンスを反映していないことです。つまり、TypeScriptは`guards`プロパティが`Umi`タイプに存在しないと文句を言います。これを修正するために、TypeScriptの[モジュール拡張](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)を使用して、新しいプロパティを含むように`Umi`タイプを拡張できます：

```ts
declare module '@metaplex-foundation/umi' {
  interface Umi {
    guards: GuardRepository;
  }
}
```

このモジュール拡張は、既存のインターフェースを拡張するためにも使用できます。例えば、追加のメソッドを含む新しいRPCインターフェースを割り当てると同時に、追加されたメソッドについてTypeScriptに知らせることができます：

```ts
export const myRpcWithAddedMethods = (): UmiPlugin => ({
  install(umi) {
    umi.rpc = new MyRpcWithAddedMethods(umi.rpc);
  },
});

declare module '@metaplex-foundation/umi' {
  interface Umi {
    rpc: MyRpcWithAddedMethods;
  }
}
```