---
title: アセットのアップロードとダウンロード
metaTitle: アセットのアップロードとダウンロード | Umi
description: Metaplex Umiを使用したアセットのアップロードとダウンロード
---
Umiは、[`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html)と[`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html)インターフェースをそれぞれ介して、任意のファイルをアップロードおよびダウンロードできるようにします。

## 汎用ファイル

ファイルの定義は、ライブラリや、ブラウザーにいるかNodeサーバーにいるかによって異なるため、Umiは`GenericFile`と呼ばれるタイプを定義して、ファイルの共通タイプに合意できるようにします。

```ts
type GenericFile = {
  readonly buffer: Uint8Array;
  readonly fileName: string;
  readonly displayName: string;
  readonly uniqueName: string;
  readonly contentType: string | null;
  readonly extension: string | null;
  readonly tags: GenericFileTag[];
};
```

ご覧のとおり、そのコンテンツは`Uint8Array`バッファーとして格納され、ファイル名、表示名、コンテンツタイプなどのいくつかのメタデータが含まれています。また、追加データをタグとして格納するシンプルなキー値ストレージも含まれています。これらは、アップローダーにファイルに関する追加情報を渡すためにも使用できます。

`createGenericFile`ヘルパー関数を使用して、そのコンテンツとファイル名から新しい`GenericFile`インスタンスを作成できます。この関数は、ブラウザーがファイルを正しくレンダリングするのに役立つように、ファイルの[MIMEタイプ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)として設定すべき`contentType`も受け入れます。

特定の環境からファイルを`GenericFile`に、またその逆に変換するのに役立つように、Umiはいくつかの追加ヘルパーメソッドも提供します。

```ts
// 汎用ファイルを直接作成。
createGenericFile('some content', 'my-file.txt', { contentType: "text/plain" });

// ブラウザーファイルとの間で汎用ファイルを解析。
await createGenericFileFromBrowserFile(myBrowserFile);
createBrowserFileFromGenericFile(myGenericFile);

// JSONオブジェクトとの間で汎用ファイルを解析。
createGenericFileFromJson(myJson);
parseJsonFromGenericFile(myGenericFile);
```

## アップローダーインターフェース

まず第一に、`UploaderInterface`は、一度に1つまたは複数のファイルをアップロードするために使用できる`upload`メソッドを提供します。渡された順序でアップロードされたファイルを表すURIの配列を返します。

```ts
const [myUri, myOtherUri] = await umi.uploader.upload([myFile, myOtherFile]);
```

`upload`メソッドは、アップロードをキャンセルするための中止`signal`やアップロードの進行状況を追跡する`onProgress`コールバックなど、アップロードプロセスを設定するためのいくつかのオプションも受け入れます。これらはすべてのアップローダーでサポートされているわけではないことに注意してください。

```ts
const myUris = await umi.uploader.upload(myFiles, {
  signal: myAbortSignal,
  onProgress: (percent) => {
    console.log(`${percent * 100}% uploaded...`);
  },
})
```

`UploaderInterface`は、JSONオブジェクトをファイルに変換してアップロードする`uploadJson`メソッドも提供します。

```ts
const myUri = await umi.uploader.uploadJson({ name: 'John', age: 42 });
```

最後に、アップローダーがファイルのセットを保存するために料金を請求する場合、`getUploadPrice`メソッドを使用してそのコストを知ることができます。これは、任意の通貨と単位になることができるカスタム`Amount`オブジェクトを返します。

```ts
const price = await umi.uploader.getUploadPrice(myFiles);
```

## ダウンローダーインターフェース

相互に、`DownloaderInterface`は、一度に1つまたは複数のファイルをダウンロードするために使用できる`download`メソッドと、解析されたJSONファイルをダウンロードするために使用できる`downloadJson`メソッドを提供します。これらのメソッドは両方とも、中止`signal`を介してキャンセルできます。

```ts
// 1つまたは複数のファイルをダウンロード。
const [myFile, myOtherFile] = await umi.downloader.download([myUri, myOtherUri]);

// 中止シグナルを使用してダウンロード。
const myFiles = await umi.downloader.download(myUris, { signal: myAbortSignal });

// JSONファイルをダウンロード。
type Person = { name: string; age: number; };
const myJsonObject = await umi.downloader.downloadJson<Person>(myUri);
```

## モックストレージ

Umiは、アップローダーとダウンローダーの両方として機能するモックストレージヘルパークラスを提供します。実際のストレージサービスを設定することなく、アプリケーションをテストするために使用できます。モックストレージにアップロードされたものは、後でダウンロードできるようにメモリにキャッシュされます。

モックストレージヘルパーは[スタンドアロンパッケージ](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock)として利用可能で、個別にインストールする必要があります。

```sh
npm install @metaplex-foundation/umi-storage-mock
```

その後、提供されるプラグインをUmiインスタンスに登録して、使用を開始できます。

```ts
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';

umi.use(mockStorage());
const [myUri] = await umi.uploader.upload([myFile]);
const [myDownloadedFile] = await umi.downloader.download([myUri]);
// myFileとmyDownloadedFileは同一です。
```
