---
title: HTTP 요청 보내기
metaTitle: HTTP 요청 보내기 | Umi
description: Metaplex Umi를 사용하여 HTTP 요청 보내기
---
Umi는 HTTP 요청을 보내는 데 사용할 수 있는 간단한 `HttpInterface`를 제공합니다. 이를 통해 Umi 플러그인이나 타사 라이브러리는 최종 사용자가 선택한 HTTP 클라이언트에 의존할 수 있으며, 같은 프로젝트에서 여러 HTTP 클라이언트를 사용하는 상황을 피할 수 있습니다.

`HttpInterface`는 제네릭 `HttpRequest<T>`를 받아서 제네릭 `HttpResponse<U>`를 반환하는 단일 메서드 `send`만 정의합니다. 여기서 `T`와 `U`는 각각 요청과 응답 본문 타입입니다.

Umi는 `HttpRequest`와 `HttpResponse` 타입에서 사용되는 `HttpHeaders`와 `HttpMethod` 같은 다양한 HTTP 관련 타입을 정의합니다. 요청 전송에 대한 개발자 경험을 개선하기 위해 Umi는 `HttpRequest` 인스턴스를 생성하는 데 사용할 수 있는 작은 요청 빌더를 제공합니다. [`HttpRequestBuilder` 타입의 API 참조](https://umi.typedoc.metaplex.com/classes/umi.HttpRequestBuilder.html)를 확인해보고 싶을 수 있지만, 다음은 몇 가지 예시입니다:

```ts
// GET JSON 요청
await umi.http.send(request().get('https://example.com/users/1').asJson());

// POST Form 요청
const data = { name: 'John Doe', email: 'john.doe@example.com' };
await umi.http.send(request().post('https://example.com/users').asForm().withData(data));

// Bearer 토큰이 있는 PUT 요청
await umi.http.send(request().put('https://example.com/users/1').withToken('my-token'));

// 중단 신호가 있는 GET 요청
await umi.http.send(request().get('https://example.com/users').withAbortSignal(mySignal));
```
