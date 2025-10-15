---
title: "Gatekeeperガード"
metaTitle: "Gatekeeperガード | Core Candy Machine"
description: "Core Candy Machineの`Gatekeeper`ガードは、ミントを行うウォレットが指定されたGatekeeper Networkから有効なGateway Tokenを持っているかどうかを確認します。"
---

## 概要

**Gatekeeper**ガードは、ミントを行うウォレットが指定された**Gatekeeper Network**から有効な**Gateway Token**を持っているかどうかを確認します。

ほとんどの場合、このトークンはCaptchaチャレンジを完了した後に取得されますが、任意のGatekeeper Networkを使用できます。

Core Candy Machine側で設定することはあまりありませんが、選択したGatekeeper Networkによっては、必要なGateway Tokenを付与するために、ミントを行うウォレットに事前検証チェックを実行するよう求める必要がある場合があります。

Gatekeep Networkを設定する際に役立つ追加の推奨資料をいくつか紹介します。

- [The CIVIC Documentation](https://docs.civic.com/civic-pass/overview)
- [Gateway JS Library](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React Components](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #gatekeeper label="Gatekeeper" /%}
{% node #gatekeeper-network label="- Gatekeeper Network" /%}
{% node #expire label="- Expire on use" /%}
{% node label="..." /%}
{% /node %}

{% node parent="gatekeeper" x="250" y="-17" %}
{% node #request-token theme="indigo" %}
Gatekeeperネットワーク

からGateway Tokenを

リクエスト（例: Captcha）
{% /node %}
{% /node %}

{% node parent="request-token" y="140" x="34" %}
{% node #gateway-token theme="indigo" label="Gateway Token" /%}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    _Candy Guard Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-30" %}
  {% node #mint-candy-machine theme="pink" %}
    _Core Candy Machine Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="92" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="gatekeeper-network" to="request-token" /%}
{% edge from="request-token" to="gateway-token" /%}

{% edge from="gateway-token" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node theme="transparent" parent="mint-candy-guard" x="-210" %}
指定されたNetworkと支払者に対して

有効なトークンが存在しない場合、

ミントは失敗します
{% /node %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}


{% /diagram %}
## ガード設定

Gatekeeperガードには以下の設定が含まれます:

- **Gatekeeper Network**: ミントを行うウォレットの有効性を確認するために使用されるGatekeeper NetworkのPublic Key。たとえば、「**Civic Captcha Pass**」Network（ミントを行うウォレットがCaptchaを通過したことを確認する）を使用する場合は、次のアドレスを使用できます: `ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`。
- **Expire On Use**: NFTがミントされた後、ミントを行うウォレットのGateway Tokenを期限切れとしてマークするかどうか。
  - `true`に設定すると、別のNFTをミントするには、再度Gatekeeper Networkを通過する必要があります。
  - `false`に設定すると、Gateway Tokenが自然に期限切れになるまで別のNFTをミントできます。

{% dialect-switcher title="Gatekeeperガードを使用してCore Candy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [Gatekeeper](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションにこのオブジェクトを追加します:

```json
"gatekeeper" : {
    "gatekeeperNetwork": "<PUBKEY>",
    "expireOnUse": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Gatekeeperガードは以下のミント設定を受け入れます:

- **Gatekeeper Network**: ミントを行うウォレットの有効性を確認するために使用されるGatekeeper NetworkのPublic Key。
- **Expire On Use**: NFTがミントされた後、ミントを行うウォレットのGateway Tokenを期限切れとしてマークするかどうか。
- **Token Account** (オプション): 免責事項として、この設定を提供する必要があることは非常にまれですが、必要な場合に備えてここにあります。これは、支払者とGatekeeper Networkから派生したGateway Token PDAを参照し、支払者がミントする資格があるかどうかを確認するために使用されます。このPDAアドレスはSDKによって推論できるため、提供する必要はありません。ただし、一部のGatekeeper Networkは同じウォレットに複数のGateway Tokenを発行する場合があります。PDAアドレスを区別するために、デフォルトで`[0, 0, 0, 0, 0, 0, 0, 0]`である**Seeds**配列を使用します。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#gatekeeper)を参照してください。

{% dialect-switcher title="Gatekeeperガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

GatekeeperガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    gatekeeper: some({
      network: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"),
      expireOnUse: true,
    }),
  },
});
```
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Gatekeeperガードはルート命令をサポートしていません。_
