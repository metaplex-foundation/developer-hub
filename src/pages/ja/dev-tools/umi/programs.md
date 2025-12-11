---
title: プログラムの登録
metaTitle: プログラムの登録 | Umi
description: Metaplex Umiへのプログラムの登録
---
Solanaプログラムとやり取りするクライアントを作成するためには、クラスター内でどのプログラムが利用可能で、どのアドレスにあるかを知ることが重要です。Umiは、クライアントのための大きなプログラムレジストリとして機能する`ProgramRepositoryInterface`を提供します。

これにより、以下のことも可能になります：
- 他のライブラリからプログラムを登録する。
- 独自のプログラムを登録し、既存のものを上書きする。
- 現在のクラスターまたは特定のクラスターで、名前または公開キーによってプログラムを取得する。
- 名前またはコードによってプログラムエラーを解決する。

## プログラムの定義

Umiは、Solanaプログラムを表す`Program`タイプを提供します。これには、プログラムの名前、公開キー、およびそのエラーを解決し、どのクラスターにデプロイされているかを判断するために使用できるいくつかの関数が含まれています。

```ts
export type Program = {
  name: string;
  publicKey: PublicKey;
  getErrorFromCode: (code: number, cause?: Error) => ProgramError | null;
  getErrorFromName: (name: string, cause?: Error) => ProgramError | null;
  isOnCluster: (cluster: Cluster) => boolean;
};
```

[APIリファレンスを介して`Program`タイプの属性について詳しく学ぶ](https://umi.typedoc.metaplex.com/types/umi.Program.html)ことができますが、`name`属性は一意である必要があり、慣例により、camelCase形式を使用する必要があることに注意してください。他の組織との競合を避けるため、プログラム名に組織固有の名前空間を接頭辞として付けることが推奨されます。たとえば、Metaplexプログラムは`mplTokenMetadata`や`mplCandyMachine`のように`mpl`という接頭辞が付けられます。

## プログラムの追加

プログラムリポジトリに新しいプログラムを登録するには、次のように`ProgramRepositoryInterface`の`add`メソッドを使用できます。

```ts
umi.programs.add(myProgram);
```

このプログラムがリポジトリに既に存在する場合（つまり、少なくとも1つの競合するクラスターで同じ名前または公開キーを持っている場合）、新しく追加されたプログラムによって上書きされます。この動作を変更するには、2番目の引数`override`を`false`に設定できます。以下の例では、このプログラムは、他の登録されたプログラムがユーザーのクエリと一致しない場合にのみ取得されます。

```ts
umi.programs.add(myProgram, false);
```

## プログラムの取得

プログラムが登録されると、`get`メソッドを介してその名前または公開キーで取得できます。これは、プログラムがリポジトリに存在する場合はプログラムを返します。そうでない場合は、エラーを投げます。

```ts
// 名前でプログラムを取得。
const myProgram = umi.programs.get('myProgram');

// 公開キーでプログラムを取得。
const myProgram = umi.programs.get(publicKey('...'));
```

デフォルトでは、`get`メソッドは現在のクラスターにデプロイされているプログラムのみを返します（つまり、`isOnCluster`メソッドが現在のクラスターに対して`true`を返すプログラム）。[`ClusterFilter`](https://umi.typedoc.metaplex.com/types/umi.ClusterFilter.html)を受け入れる2番目の引数を介してのみ、異なるクラスターを指定することが可能です。

`ClusterFilter`は、明示的な[`Cluster`](https://umi.typedoc.metaplex.com/types/umi.Cluster.html)、現在のクラスターを選択する`"current"`、または任意のクラスターにデプロイされているプログラムを選択する`"all"`のいずれかにすることができます。

```ts
// 現在のクラスターでプログラムを取得。
umi.programs.get('myProgram');
umi.programs.get('myProgram', 'current');

// 特定のクラスターでプログラムを取得。
umi.programs.get('myProgram', 'mainnet-beta');
umi.programs.get('myProgram', 'devnet');

// 任意のクラスターでプログラムを取得。
umi.programs.get('myProgram', 'all');
```

また、`get`メソッドはジェネリックであり、`Program`タイプのスーパーセットを返すことができることも注目に値します。たとえば、そのプログラムで`availableGuards`を格納するために`Program`タイプを拡張する`CandyGuardProgram`タイプがあるとします。その場合、取得しているプログラムがそのタイプであるべきであることがわかっている場合は、タイプパラメーターを`CandyGuardProgram`に設定して`get`メソッドに伝えることができます。

```ts
umi.programs.get<CandyGuardProgram>('mplCandyGuard');
```

さらに、`ProgramRepositoryInterface`は、プログラムがリポジトリに存在するかどうかをチェックするために使用できる`has`メソッドと、リポジトリ内のすべてのプログラムを取得する`all`メソッドを提供します。これらのメソッドは両方とも、`get`メソッドと同じ`ClusterFilter`引数を受け入れます。

```ts
// プログラムがリポジトリに存在するかどうかをチェック。
umi.programs.has('myProgram');
umi.programs.has(publicKey('...'));
umi.programs.has('myProgram', 'mainnet-beta');
umi.programs.has('myProgram', 'all');

// リポジトリ内のすべてのプログラムを取得。
umi.programs.all();
umi.programs.all('mainnet-beta');
umi.programs.all('all');
```

最後に、プログラムの公開キーを取得することは一般的な操作なので、`ProgramRepositoryInterface`は、プログラムの公開キーを直接取得するために使用できる`getPublicKey`メソッドを提供します。プログラムがリポジトリに存在しない場合にエラーを投げることを避け、代わりに指定された公開キーを返すために、`fallback`公開キーを提供できます。

```ts
// プログラムの公開キーを取得。
umi.programs.getPublicKey('myProgram');

// フォールバック付きでプログラムの公開キーを取得。
const fallback = publicKey('...');
umi.programs.getPublicKey('myProgram', fallback);

// 特定のクラスターでプログラムの公開キーを取得。
umi.programs.getPublicKey('myProgram', fallback, 'mainnet-beta');
```

## プログラムエラーの解決

`ProgramRepositoryInterface`は、トランザクションエラーからカスタムプログラムエラーを解決するために使用できる`resolveError`メソッドを提供します。このメソッドは、`logs`属性を持つ任意の`Error`と、このエラーを発生させた`Transaction`インスタンスを受け入れます。その後、エラーログからカスタムプログラムエラーが特定された場合は`ProgramError`のインスタンスを返します。そうでない場合は、`null`を返します。

```ts
umi.programs.resolveError(error, transaction);
```