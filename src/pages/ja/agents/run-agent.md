---
title: エージェントデータを読み取る
metaTitle: Solanaでエージェントデータを読み取る | Metaplex Agent Registry
description: Solana上でエージェントの登録を確認し、エージェントIDデータを読み取ります。
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-12-2026'
---

[登録](/agents/register-agent)後にオンチェーンでエージェントIDデータを読み取り、確認します。{% .lead %}

## 概要

エージェントIDデータの読み取り、登録状態の確認、AgentIdentityプラグインの検査、オフチェーン登録ドキュメントの取得、エージェントの内蔵ウォレットアドレスの派生を行います。

- `safeFetchAgentIdentityV1`を使用して**登録を確認** — 未登録アセットには`null`を返します
- 取得したCoreアセットのURIとライフサイクルフックを直接確認して**AgentIdentityプラグインを検査**
- オンチェーンURIから**登録ドキュメントを取得**し、エージェントメタデータとサービスエンドポイントを読み取ります
- `findAssetSignerPda`を使用して**エージェントのウォレットを派生** — 秘密鍵のないPDAがエージェントの資金を保持

## 登録を確認

安全取得メソッドはIDが存在しない場合にスローする代わりに`null`を返すため、アセットが登録されているかどうかのチェックに便利です：

```typescript
import { safeFetchAgentIdentityV1, findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
const identity = await safeFetchAgentIdentityV1(umi, pda);

console.log('Registered:', identity !== null);
```

## シードから取得

PDAを手動で派生せずに、アセットの公開鍵から直接IDを取得することもできます：

```typescript
import { fetchAgentIdentityV1FromSeeds } from '@metaplex-foundation/mpl-agent-registry';

const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
});
```

## AgentIdentityプラグインを確認

登録により`AgentIdentity`プラグインがCoreアセットにアタッチされます。取得したアセットから直接読み取って、登録URIとライフサイクルフックを検査できます：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 登録ドキュメントを読み取る

`AgentIdentity`プラグインの`uri`は、エージェントの完全なプロファイル（名前、説明、サービスエンドポイントなど）を含むオフチェーンJSONドキュメントを指します。他のURIと同様に取得します：

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);
const agentIdentity = assetData.agentIdentities?.[0];

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri);
  const registration = await response.json();

  console.log(registration.name);          // "Plexpert"
  console.log(registration.description);   // "An informational agent..."
  console.log(registration.active);        // true

  for (const service of registration.services) {
    console.log(service.name);             // "web", "A2A", "MCP", etc.
    console.log(service.endpoint);         // service URL
    console.log(service.version);          // protocol version (if set)
  }
}
```

このドキュメントは[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)エージェント登録標準に準拠しています。典型的な例は以下の通りです：

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

フィールドの完全なリファレンスについては、[エージェントを登録](/agents/register-agent#agent-registration-document)をご覧ください。

## エージェントのウォレットを取得

すべてのCoreアセットには**Asset Signer**と呼ばれる内蔵ウォレットがあります。アセットの公開鍵から派生したPDAです。秘密鍵は存在しないため、盗まれることはありません。ウォレットはSOL、トークン、その他のアセットを保持できます。`findAssetSignerPda`でアドレスを派生します：

```typescript
import { findAssetSignerPda } from '@metaplex-foundation/mpl-core';

const assetSignerPda = findAssetSignerPda(umi, { asset: assetPublicKey });

const balance = await umi.rpc.getBalance(assetSignerPda);
console.log('Agent wallet:', assetSignerPda);
console.log('Balance:', balance.basisPoints.toString(), 'lamports');
```

アドレスは決定論的なので、誰でもアセットの公開鍵からアドレスを派生して資金を送信したり残高を確認したりできます。このウォレットに対して署名できるのは、委任された[エグゼクティブ](/agents/run-an-agent)を通じたCoreの[Execute](/smart-contracts/core/execute-asset-signing)命令によるアセット自身のみです。

アカウントレイアウト、PDA派生の詳細、エラーコードについては、[MPL Agent Registry](/smart-contracts/mpl-agent)スマートコントラクトドキュメントをご覧ください。

## 注意事項

- Asset SignerはPDAです。秘密鍵は存在しません。任意のソースから資金を受け取れますが、発信トランザクションに署名できるのはCoreの[Execute](/smart-contracts/core/execute-asset-signing)命令を通じたアセット自身のみです。
- `safeFetchAgentIdentityV1`は未登録アセットに対してスローする代わりに`null`を返すため、try/catchなしでの存在チェックに安全です。
- `findAssetSignerPda`はウォレットアドレスを決定論的に派生します。ネットワークに関係なく同じアドレスが返されるため、同じアセットキーでdevnetとmainnetの両方で使用できます。
