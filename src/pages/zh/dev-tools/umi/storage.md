---
title: 上传和下载资产
metaTitle: 上传和下载资产 | Umi
description: 使用 Metaplex Umi 上传和下载资产
---
Umi 使我们能够分别通过 [`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html) 和 [`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html) 接口上传和下载任何文件。

## 通用文件

由于文件的定义因库和我们是在浏览器还是 Node 服务器中而异，Umi 定义了一个名为 `GenericFile` 的类型，以便我们可以就文件的通用类型达成一致。

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

如您所见，其内容存储为 `Uint8Array` 缓冲区，并包含一些元数据，如文件名、显示名、内容类型等。它还包括一个简单的键值存储，用于将任何附加数据存储为标签。这些也可用于向上传器传递有关文件的附加信息。

您可以使用 `createGenericFile` 辅助函数从其内容和文件名创建新的 `GenericFile` 实例。此函数还接受一个 `contentType`，您应该将其设置为文件的 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，以帮助浏览器正确渲染您的文件。

为了帮助我们将文件从特定环境转换为 `GenericFile` 或从 `GenericFile` 转换，Umi 还提供了一些额外的辅助方法。

```ts
// 直接创建通用文件。
createGenericFile('some content', 'my-file.txt', { contentType: "text/plain" });

// 将通用文件与浏览器文件相互转换。
await createGenericFileFromBrowserFile(myBrowserFile);
createBrowserFileFromGenericFile(myGenericFile);

// 将通用文件与 JSON 对象相互转换。
createGenericFileFromJson(myJson);
parseJsonFromGenericFile(myGenericFile);
```

## 上传器接口

首先，`UploaderInterface` 提供了一个 `upload` 方法，可用于一次上传一个或多个文件。它返回一个 URI 数组，表示上传的文件，顺序与传入的顺序相同。

```ts
const [myUri, myOtherUri] = await umi.uploader.upload([myFile, myOtherFile]);
```

`upload` 方法还接受一些选项来配置上传过程，如用于取消上传的中止 `signal` 或用于跟踪上传进度的 `onProgress` 回调。请注意，这些可能不被所有上传器支持。

```ts
const myUris = await umi.uploader.upload(myFiles, {
  signal: myAbortSignal,
  onProgress: (percent) => {
    console.log(`${percent * 100}% 已上传...`);
  },
})
```

`UploaderInterface` 还提供了一个 `uploadJson` 方法，它将 JSON 对象转换为文件并上传它。

```ts
const myUri = await umi.uploader.uploadJson({ name: 'John', age: 42 });
```

最后，如果上传器收取存储一组文件的费用，您可以使用 `getUploadPrice` 方法了解费用。它将返回一个自定义 `Amount` 对象，可以是任何货币和单位。

```ts
const price = await umi.uploader.getUploadPrice(myFiles);
```

## 下载器接口

相应地，`DownloaderInterface` 提供了一个 `download` 方法，可用于一次下载一个或多个文件，以及一个 `downloadJson` 方法，可用于下载已解析的 JSON 文件。这两个方法都可以通过中止 `signal` 取消。

```ts
// 下载一个或多个文件。
const [myFile, myOtherFile] = await umi.downloader.download([myUri, myOtherUri]);

// 使用中止信号下载。
const myFiles = await umi.downloader.download(myUris, { signal: myAbortSignal });

// 下载 JSON 文件。
type Person = { name: string; age: number; };
const myJsonObject = await umi.downloader.downloadJson<Person>(myUri);
```

## 模拟存储

Umi 提供了一个模拟存储辅助类，同时充当上传器和下载器。它可用于测试您的应用程序，而无需设置真实的存储服务。上传到模拟存储的任何内容都将缓存在内存中，以便稍后可以下载。

模拟存储辅助函数作为[独立包](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock)提供，必须单独安装。

```sh
npm install @metaplex-foundation/umi-storage-mock
```

然后，我们可以将它提供的插件注册到我们的 Umi 实例并开始使用它。

```ts
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';

umi.use(mockStorage());
const [myUri] = await umi.uploader.upload([myFile]);
const [myDownloadedFile] = await umi.downloader.download([myUri]);
// myFile 和 myDownloadedFile 是相同的。
```
