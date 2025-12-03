---
title: Kinobiを介したUmiクライアントの生成
metaTitle: Kinobiを介したUmiクライアントの生成 | Umi
description: Kinobiを介したUmiクライアントの生成
---
Umiフレームワークは、JavaScriptでSolanaクライアントを構築するための基盤を提供します。プログラムがUmi互換ライブラリを提供すると、エンドユーザーが提供するヘルパー関数にUmiインスタンスを単純に接続できるようになり、はるかに強力になります。Umi互換ライブラリの作成プロセスを簡素化し自動化するため、UmiはKinobiと呼ばれる強力なコードジェネレーターを提供します。

[Kinobi](https://github.com/metaplex-foundation/kinobi)は、1つまたは複数のプログラムで構成されるSolanaクライアントの言語非依存表現を導入します。これは、`Visitor`クラスによって訪問できるノードのツリーを使用することで実現されます。Visitorは、開発者がニーズに合わせてクライアントを調整できるように、ツリーの任意の側面を更新するために使用できます。ツリーが開発者の好みに合ったら、言語固有のVisitorを使用してターゲット言語またはフレームワーク用のコードを生成できます。

良いニュースは、KinobiがUmi互換ライブラリを生成する`RenderJavaScriptVisitor`を提供することです。

以下は、KinobiとUmiを使用してSolanaプログラム用のJavaScriptクライアントを作成する方法の簡単な概要です。この図を段階的に解説する[このスレッドに興味があるかもしれません](https://twitter.com/lorismatic/status/1637890024992833536)。

![](https://pbs.twimg.com/media/Frr0StQaIAAc16a?format=jpg&name=4096x4096)

## Kinobiの開始

詳細については[Kinobiドキュメント](https://github.com/metaplex-foundation/kinobi)をチェックすることをお勧めしますが、以下はKinobiの開始方法の簡単な概要です。

まず、Kinobiをインストールする必要があります：

```sh
npm install @metaplex-foundation/kinobi
```

次に、Kinobiツリーを作成してレンダリングするJavaScriptファイル（例：`kinobi.js`）を作成する必要があります。これは`Kinobi`インスタンスを作成し、IDLファイルへのパスの配列を渡すことで行われます。IDLファイルを生成するために[Shank JSライブラリ](https://github.com/metaplex-foundation/shank-js)をチェックすることをお勧めします。その後、Visitorを使用してツリーを更新し、`RenderJavaScriptVisitor`を介してUmi互換ライブラリとしてレンダリングできます。以下に例を示します。

```ts
import { createFromIdls, RenderJavaScriptVisitor } from "@metaplex-foundation/kinobi";

// Kinobiをインスタンス化。
const kinobi = createFromIdls([
  path.join(__dirname, "idls", "my_idl.json"),
  path.join(__dirname, "idls", "my_other_idl.json"),
]);

// Visitorを使用してKinobiツリーを更新...

// JavaScriptをレンダリング。
const jsDir = path.join(__dirname, "clients", "js", "src", "generated");
kinobi.accept(new RenderJavaScriptVisitor(jsDir));
```

今、あなたがする必要があるのは、次のようにNode.jsでこのファイルを実行することだけです。

```sh
node ./kinobi.js
```

JSクライアントを初めて生成する際は、必要に応じてライブラリを準備してください。少なくとも`package.json`ファイルを作成し、依存関係をインストールし、生成されたフォルダーをインポートするトップレベルの`index.ts`ファイルを提供する必要があります。

## Kinobi生成クライアントの機能

KinobiでUmi互換ライブラリを生成する方法がわかったので、それらが何をできるかを見てみましょう。

### タイプとシリアライザー

Kinobi生成ライブラリは、プログラムで定義された各タイプ、アカウント、命令のシリアライザーを提供します。また、シリアライザーを作成するために必要な2つのTypeScriptタイプ（つまり、`From`と`To`タイプパラメーター）もエクスポートします。2つを区別するために`From`タイプに`Args`を接尾辞として付けます。たとえば、IDLで定義された`MyType`タイプがある場合、以下のコードを使用してそれをシリアライズおよびデシリアライズできます。

```ts
const serializer: Serializer<MyTypeArgs, MyType> = getMyTypeSerializer();
serializer.serialize(myType);
serializer.deserialize(myBuffer);
```

命令の場合、タイプの名前は`InstructionData`が接尾辞として付けられ、アカウントの場合は`AccountData`が接尾辞として付けられます。これにより、接尾辞のないアカウント名を`Account<T>`タイプとして使用できます。たとえば、プログラムに`Token`アカウントと`Transfer`命令がある場合、以下のタイプとシリアライザーが得られます。

```ts
// アカウント用。
type Token = Account<TokenAccountData>;
type TokenAccountData = {...};
type TokenAccountDataArgs = {...};
const tokenDataSerializer = getTokenAccountDataSerializer();

// 命令用。
type TransferInstructionData = {...};
type TransferInstructionDataArgs = {...};
const transferDataSerializer = getTransferInstructionDataSerializer();
```

### データ列挙ヘルパー

生成されたタイプが[データ列挙](serializers#data-enums)として識別される場合、開発者エクスペリエンスを向上させるために追加のヘルパーメソッドが作成されます。たとえば、以下のデータ列挙タイプが生成されたとします。

```ts
type Message = 
  | { __kind: 'Quit' } // 空のバリアント。
  | { __kind: 'Write'; fields: [string] } // タプルバリアント。
  | { __kind: 'Move'; x: number; y: number }; // 構造体バリアント。
```

その場合、タイプと`getMessageSerializer`関数の生成に加えて、新しいデータ列挙を作成し、それぞれのバリアントのタイプをチェックするために使用できる`message`と`isMessage`関数も生成されます。

```ts
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### アカウントヘルパー

Kinobiはアカウント用の追加ヘルパーメソッドも提供し、それらを簡単に取得およびデシリアライズする方法を提供します。アカウント名が`Metadata`だと仮定すると、利用可能な追加ヘルパーメソッドは以下の通りです。

```ts
// 生アカウントを解析されたアカウントにデシリアライズ。
deserializeMetadata(rawAccount); // -> Metadata

// 公開キーからデシリアライズされたアカウントを取得。
await fetchMetadata(umi, publicKey); // -> Metadataまたは失敗
await safeFetchMetadata(umi, publicKey); // -> Metadataまたはnull

// 公開キーですべてのデシリアライズされたアカウントを取得。
await fetchAllMetadata(umi, publicKeys); // -> Metadata[]、アカウントが欠けている場合は失敗
await safeFetchAllMetadata(umi, publicKeys) // -> Metadata[]、欠けているアカウントを除外

// アカウントのgetProgramAccountビルダーを作成。
await getMetadataGpaBuilder()
  .whereField('updateAuthority', updateAuthority)
  .selectField('mint')
  .getDataAsPublicKeys() // -> PublicKey[]

// 固定サイズの場合、アカウントデータのサイズをバイト単位で取得。
getMetadataSize() // -> number

// シードからアカウントのPDAアドレスを見つける。
findMetadataPda(umi, seeds) // -> Pda
```

それらができることについて詳しく学ぶために、[`GpaBuilder`sのドキュメント](helpers#gpabuilders)をチェックすることをお勧めします。

### トランザクションビルダー

各生成された命令には、命令を含むトランザクションビルダーを作成するために使用できる独自の関数もあります。たとえば、`Transfer`命令がある場合、`TransactionBuilder`を返す`transfer`関数が生成されます。

```ts
await transfer(umi, { from, to, amount }).sendAndConfirm();
```

トランザクションビルダーは一緒に組み合わせることができるため、次のように複数の命令を含むトランザクションを簡単に作成できます。

```ts
await transfer(umi, { from, to: destinationA, amount })
  .add(transfer(umi, { from, to: destinationB, amount }))
  .add(transfer(umi, { from, to: destinationC, amount }))
  .sendAndConfirm();
```

### エラーとプログラム

Kinobiは、クライアントで定義された各プログラムの`Program`タイプを返す関数と、それらにアクセスするためのヘルパーも生成します。たとえば、クライアントが`MplTokenMetadata`プログラムを定義している場合、以下のヘルパーが生成されます。

```ts
// 定数変数としてのプログラムの公開キー。
MPL_TOKEN_METADATA_PROGRAM_ID; // -> PublicKey

// プログラムリポジトリに登録できるプログラムオブジェクトを作成。
createMplTokenMetadataProgram(); // -> Program

// プログラムリポジトリからプログラムオブジェクトを取得。
getMplTokenMetadataProgram(umi); // -> Program

// プログラムリポジトリからプログラムの公開キーを取得。
getMplTokenMetadataProgramId(umi); // -> PublicKey
```

Kinobiはクライアント用のUmiプラグインを自動生成しないため、好きなようにカスタマイズできることに注意してください。つまり、プラグインを自分で作成し、少なくともクライアントで定義されたプログラムを登録する必要があります。以下は`MplTokenMetadata`プログラムを使用した例です。

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

さらに、各プログラムは、投げられる可能性のある各エラーに対してカスタム`ProgramError`を生成します。たとえば、プログラムが`UpdateAuthorityIncorrect`エラーを定義している場合、以下のクラスが生成されます。

```ts
export class UpdateAuthorityIncorrectError extends ProgramError {
  readonly name: string = 'UpdateAuthorityIncorrect';

  readonly code: number = 0x7; // 7

  constructor(program: Program, cause?: Error) {
    super('Update Authority given does not match', program, cause);
  }
}
```

各生成されたエラーは`codeToErrorMap`と`nameToErrorMap`にも登録され、ライブラリが名前またはコードから任意のエラークラスを見つけることができる2つのヘルパーメソッドを提供できるようにします。

```ts
getMplTokenMetadataErrorFromCode(0x7, program); // -> UpdateAuthorityIncorrectError
getMplTokenMetadataErrorFromName('UpdateAuthorityIncorrect', program); // -> UpdateAuthorityIncorrectError
```

これらのメソッドは`createMplTokenMetadataProgram`関数によって使用され、`Program`オブジェクトの`getErrorFromCode`と`getErrorFromName`関数を埋めることに注意してください。