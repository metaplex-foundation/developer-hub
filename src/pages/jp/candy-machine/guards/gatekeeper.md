---
title: "Gatekeeper Guard"
metaTitle: Gatekeeper Guard | Candy Machine
description: "Gatekeeperガードは、ミントウォレットが指定されたGatekeeper Networkから有効なGateway Tokenを持っているかどうかをチェックします。"
---

## 概要

**Gatekeeper**ガードは、ミントウォレットが指定された**Gatekeeper Network**から有効な**Gateway Token**を持っているかどうかをチェックします。

ほとんどの場合、このトークンはCaptchaチャレンジを完了した後に取得されますが、任意のGatekeeper Networkを使用できます。

Candy Machine側では設定することはあまりありませんが、選択されたGatekeeper Networkによっては、必要なGateway Tokenを付与するために事前検証チェックを実行するようミントウォレットに求める必要がある場合があります。

Gatekeep Networkを設定する際に役立つ追加の推奨資料をいくつか示します。

- [CIVIC Documentation](https://docs.civic.com/civic-pass/overview)
- [Gateway JS Library](https://www.npmjs.com/package/@identity.com/solana-gateway-ts)
- [Gateway React Components](https://www.npmjs.com/package/@civic/solana-gateway-react)

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
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
Request Gateway Token

from the Gatekeeper

Network e.g. Captcha
{% /node %}
{% /node %}

{% node parent="request-token" y="140" x="34" %}
{% node #gateway-token theme="indigo" label="Gateway Token" /%}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-9" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from 
    
    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="78" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="gatekeeper-network" to="request-token" /%}
{% edge from="request-token" to="gateway-token" /%}

{% edge from="gateway-token" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node theme="transparent" parent="mint-candy-guard" x="-210" %}
if a valid token for the given

Network and payer does not exist 

Minting will fail
{% /node %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}


{% /diagram %}
## ガード設定

Gatekeeperガードには以下の設定が含まれます：

- **Gatekeeper Network**: ミントウォレットの有効性をチェックするために使用されるGatekeeper Networkの公開鍵。例えば、「**Civic Captcha Pass**」Network（ミントウォレットがcaptchaを通過したことを保証する）を使用する場合は、以下のアドレスを使用します：`ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6`。
- **Expire On Use**: NFTがミントされた後にミントウォレットのGateway Tokenを期限切れとしてマークするかどうか。
  - `true`に設定されている場合、別のNFTをミントするためには再びGatekeeper Networkを通過する必要があります。
  - `false`に設定されている場合、Gateway Tokenが自然に期限切れになるまで別のNFTをミントできます。

{% dialect-switcher title="Gatekeeperガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [Gatekeeper](https://mpl-candy-machine.typedoc.metaplex.com/types/Gatekeeper.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

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

Gatekeeperガードには以下のミント設定が含まれます：

- **Gatekeeper Network**: ミントウォレットの有効性をチェックするために使用されるGatekeeper Networkの公開鍵。
- **Expire On Use**: NFTがミントされた後にミントウォレットのGateway Tokenを期限切れとしてマークするかどうか。
- **Token Account** (オプション): 小さな注意点として、この設定を提供する必要があることは非常に稀ですが、必要な場合はここにあります。これは支払者とGatekeeper Networkから派生したGateway Token PDAを指し、支払者のミント資格を検証するために使用されます。このPDAアドレスはSDKによって推定できるため、提供する必要はありません。ただし、一部のGatekeeper Networkは同じウォレットに複数のGateway Tokenを発行する場合があります。PDAアドレスを区別するために、デフォルトで`[0, 0, 0, 0, 0, 0, 0, 0]`となる**Seeds**配列を使用します。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#gatekeeper)を参照してください。

{% dialect-switcher title="Gatekeeperガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してGatekeeperガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
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
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Gatekeeperガードはルート命令をサポートしません。_