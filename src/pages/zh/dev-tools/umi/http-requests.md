---
title: 发送 HTTP 请求
metaTitle: 发送 HTTP 请求 | Umi
description: 使用 Metaplex Umi 发送 HTTP 请求
---
Umi 提供了一个简单的 `HttpInterface`，可用于发送 HTTP 请求。这允许任何 Umi 插件或第三方库依赖最终用户选择使用的任何 HTTP 客户端，而不是在同一项目中使用多个 HTTP 客户端。

`HttpInterface` 只定义了一个 `send` 方法，它接受一个泛型 `HttpRequest<T>` 并返回一个泛型 `HttpResponse<U>`，其中 `T` 和 `U` 分别是请求和响应体类型。

Umi 定义了各种 HTTP 相关类型，如 `HttpHeaders` 和 `HttpMethod`，它们被 `HttpRequest` 和 `HttpResponse` 类型使用。为了改善发送请求的开发者体验，Umi 附带了一个小型请求构建器，可用于创建 `HttpRequest` 实例。您可能想查看 [`HttpRequestBuilder` 类型的 API 参考](https://umi.typedoc.metaplex.com/classes/umi.HttpRequestBuilder.html)以了解更多信息，但以下是一些示例：

```ts
// GET JSON 请求。
await umi.http.send(request().get('https://example.com/users/1').asJson());

// POST Form 请求。
const data = { name: 'John Doe', email: 'john.doe@example.com' };
await umi.http.send(request().post('https://example.com/users').asForm().withData(data));

// 带 bearer token 的 PUT 请求。
await umi.http.send(request().put('https://example.com/users/1').withToken('my-token'));

// 带 abort signal 的 GET 请求
await umi.http.send(request().get('https://example.com/users').withAbortSignal(mySignal));
```
