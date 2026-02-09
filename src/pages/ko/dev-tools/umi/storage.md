---
title: 에셋 업로드 및 다운로드
metaTitle: 에셋 업로드 및 다운로드 | Umi
description: Metaplex Umi를 사용하여 에셋 업로드 및 다운로드하기
---
Umi는 [`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html)와 [`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html) 인터페이스를 각각 통해 모든 파일을 업로드하고 다운로드할 수 있게 해줍니다.

## 일반 파일

파일의 정의가 라이브러리마다 그리고 브라우저나 Node 서버에 있는지에 따라 다르기 때문에, Umi는 파일에 대한 공통 타입에 합의할 수 있도록 `GenericFile`이라는 타입을 정의합니다.

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

보시다시피, 콘텐츠는 `Uint8Array` 버퍼로 저장되며 파일명, 표시명, 콘텐츠 타입 등과 같은 일부 메타데이터를 포함합니다. 또한 태그로 추가 데이터를 저장하는 간단한 키-값 스토리지를 포함합니다. 이들은 파일에 대한 추가 정보를 업로더에게 전달하는 데도 사용할 수 있습니다.

`createGenericFile` 헬퍼 함수를 사용하여 콘텐츠와 파일명으로부터 새로운 `GenericFile` 인스턴스를 생성할 수 있습니다. 이 함수는 브라우저가 파일을 올바르게 렌더링하는 데 도움이 되도록 파일의 [MIME Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)으로 설정해야 하는 `contentType`도 허용합니다.

특정 환경의 파일을 `GenericFile`로 또는 `GenericFile`에서 변환하는 데 도움이 되도록 Umi는 몇 가지 추가 헬퍼 메서드도 제공합니다.

```ts
// 일반 파일을 직접 생성
createGenericFile('some content', 'my-file.txt', { contentType: "text/plain" });

// 브라우저 파일로부터/으로 일반 파일 파싱
await createGenericFileFromBrowserFile(myBrowserFile);
createBrowserFileFromGenericFile(myGenericFile);

// JSON 객체로부터/으로 일반 파일 파싱
createGenericFileFromJson(myJson);
parseJsonFromGenericFile(myGenericFile);
```

## 업로더 인터페이스

무엇보다도 `UploaderInterface`는 한 개 또는 여러 개의 파일을 한 번에 업로드하는 데 사용할 수 있는 `upload` 메서드를 제공합니다. 전달된 순서대로 업로드된 파일을 나타내는 URI 배열을 반환합니다.

```ts
const [myUri, myOtherUri] = await umi.uploader.upload([myFile, myOtherFile]);
```

`upload` 메서드는 업로드를 취소하는 중단 `signal`이나 업로드 진행률을 추적하는 `onProgress` 콜백과 같은 업로드 프로세스를 구성하는 몇 가지 옵션도 허용합니다. 이들은 모든 업로더에서 지원되지 않을 수 있다는 점에 주목하세요.

```ts
const myUris = await umi.uploader.upload(myFiles, {
  signal: myAbortSignal,
  onProgress: (percent) => {
    console.log(`${percent * 100}% uploaded...`);
  },
})
```

`UploaderInterface`는 JSON 객체를 파일로 변환하여 업로드하는 `uploadJson` 메서드도 제공합니다.

```ts
const myUri = await umi.uploader.uploadJson({ name: 'John', age: 42 });
```

마지막으로, 업로더가 파일 세트를 저장하는 데 비용을 청구하는 경우 `getUploadPrice` 메서드를 사용하여 비용을 알아볼 수 있습니다. 모든 통화와 단위가 될 수 있는 사용자 정의 `Amount` 객체를 반환합니다.

```ts
const price = await umi.uploader.getUploadPrice(myFiles);
```

## 다운로더 인터페이스

상호적으로 `DownloaderInterface`는 한 개 또는 여러 개의 파일을 한 번에 다운로드하는 데 사용할 수 있는 `download` 메서드와 파싱된 JSON 파일을 다운로드하는 데 사용할 수 있는 `downloadJson` 메서드를 제공합니다. 이 두 메서드 모두 중단 `signal`을 통해 취소할 수 있습니다.

```ts
// 한 개 또는 여러 개의 파일 다운로드
const [myFile, myOtherFile] = await umi.downloader.download([myUri, myOtherUri]);

// 중단 신호를 사용하여 다운로드
const myFiles = await umi.downloader.download(myUris, { signal: myAbortSignal });

// JSON 파일 다운로드
type Person = { name: string; age: number; };
const myJsonObject = await umi.downloader.downloadJson<Person>(myUri);
```

## 모의 스토리지

Umi는 업로더와 다운로더 역할을 모두 하는 모의 스토리지 헬퍼 클래스를 제공합니다. 실제 스토리지 서비스를 설정하지 않고도 애플리케이션을 테스트하는 데 사용할 수 있습니다. 모의 스토리지에 업로드된 모든 것은 나중에 다운로드할 수 있도록 메모리에 캐시됩니다.

모의 스토리지 헬퍼는 [독립 실행형 패키지](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock)로 사용할 수 있으며 별도로 설치해야 합니다.

```sh
npm install @metaplex-foundation/umi-storage-mock
```

그런 다음 제공되는 플러그인을 Umi 인스턴스에 등록하고 사용을 시작할 수 있습니다.

```ts
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';

umi.use(mockStorage());
const [myUri] = await umi.uploader.upload([myFile]);
const [myDownloadedFile] = await umi.downloader.download([myUri]);
// myFile과 myDownloadedFile은 동일합니다.
```
