---
title: Httpリクエストの送信
metaTitle: HTTPリクエストの送信 | Umi
description: Metaplex Umiを使用したHttpリクエストの送信
---
Umiは、HTTPリクエストを送信するために使用できるシンプルな`HttpInterface`を提供します。これにより、任意のUmiプラグインやサードパーティライブラリは、同じプロジェクトで複数のHttpクライアントを持つことなく、エンドユーザーが使用することを選択したHttpクライアントに依存できます。

`HttpInterface`は、ジェネリック`HttpRequest<T>`を受け取り、ジェネリック`HttpResponse<U>`を返す単一のメソッド`send`のみを定義します。ここで`T`と`U`はそれぞれリクエストとレスポンスのボディタイプです。

Umiは、`HttpRequest`と`HttpResponse`タイプによって使用される`HttpHeaders`や`HttpMethod`などのさまざまなHttp関連タイプを定義します。リクエスト送信の開発者エクスペリエンスを向上させるため、Umiは`HttpRequest`インスタンスを作成するために使用できる小さなリクエストビルダーを提供しています。詳細については[`HttpRequestBuilder`タイプのAPIリファレンス](https://umi.typedoc.metaplex.com/classes/umi.HttpRequestBuilder.html)をチェックすることをお勧めしますが、以下にいくつかの例を示します：

```ts
// GET JSONリクエスト。
await umi.http.send(request().get('https://example.com/users/1').asJson());

// POSTフォームリクエスト。
const data = { name: 'John Doe', email: 'john.doe@example.com' };
await umi.http.send(request().post('https://example.com/users').asForm().withData(data));

// ベアラートークン付きPUTリクエスト。
await umi.http.send(request().put('https://example.com/users/1').withToken('my-token'));

// 中止シグナル付きGETリクエスト
await umi.http.send(request().get('https://example.com/users').withAbortSignal(mySignal));
```
