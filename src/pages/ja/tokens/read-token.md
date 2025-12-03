---
title: トークンデータを読み取る
metaTitle: トークンデータを読み取る | トークン
description: Solanaブロックチェーンおよびdas APIを使用してファンジブルトークンデータを取得する方法を学びます
created: '11-28-2025'
updated: '11-28-2025'
---

Solanaブロックチェーンから直接、またはDAS APIを通じて最適化されたクエリでファンジブルトークン情報を取得します。 {% .lead %}

## 学習内容

このガイドでは、トークンデータを読み取る2つのアプローチを説明します：

- **直接ブロックチェーンクエリ** - RPCコールを使用してトークンデータを取得
- **DAS APIクエリ** - インデックス化されたデータを使用して高速で柔軟な検索

## トークンデータを直接取得する

### ミントアドレスでトークンメタデータを取得

ブロックチェーンからトークンのメタデータを直接取得するには、ミントアドレスが必要です。このアプローチはオンチェーンアカウントからデータを直接読み取ります。

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  fetchDigitalAsset,
  mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(mplTokenMetadata())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the token's metadata
  const asset = await fetchDigitalAsset(umi, mintAddress)

  console.log('Token Name:', asset.metadata.name)
  console.log('Token Symbol:', asset.metadata.symbol)
  console.log('Token URI:', asset.metadata.uri)
  console.log('Decimals:', asset.mint.decimals)
  console.log('Supply:', asset.mint.supply)
})();
```
{% /totem-accordion %}
{% /totem %}

### ウォレットのトークン残高を取得

特定のウォレットが指定されたトークンミントに対して保有するトークン残高を取得します。

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  findAssociatedTokenPda,
  fetchToken
} from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
  const walletAddress = publicKey('WALLET_ADDRESS')

  // Find the Associated Token Account
  const tokenAccount = findAssociatedTokenPda(umi, {
    mint: mintAddress,
    owner: walletAddress,
  })

  // Fetch the token account data
  const tokenData = await fetchToken(umi, tokenAccount)

  console.log('Token Balance:', tokenData.amount)
  console.log('Mint:', tokenData.mint)
  console.log('Owner:', tokenData.owner)
})();
```
{% /totem-accordion %}
{% /totem %}

### ウォレットの全トークンアカウントを取得

特定のウォレットが所有するすべてのトークンアカウントを取得して、すべてのトークン保有を確認します。

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Get all token accounts using getProgramAccounts
  const tokenAccounts = await umi.rpc.getProgramAccounts(SPL_TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 }, // Token account size
      {
        memcmp: {
          offset: 32, // Owner offset in token account
          bytes: walletAddress,
        },
      },
    ],
  })

  console.log(`Found ${tokenAccounts.length} token accounts`)

  tokenAccounts.forEach((account) => {
    console.log('Token Account:', account.publicKey)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## DAS APIでトークンデータを取得する

[Digital Asset Standard (DAS) API](/das-api)は、トークンデータへのインデックス化されたアクセスを提供し、高速なクエリと高度なフィルタリング機能を実現します。複数のトークンをクエリしたり、さまざまな条件で検索する必要があるアプリケーションには、このアプローチが推奨されます。

### ミントアドレスでトークンを取得

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the asset using DAS
  const asset = await umi.rpc.getAsset(mintAddress, {
    displayOptions: {
      showFungible: true
    }
  })

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
  console.log('Supply:', asset.supply)
  console.log('Decimals:', asset.token_info?.decimals)
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAsset',
      params: {
        id: 'YOUR_TOKEN_MINT_ADDRESS',
        displayOptions: {
          showFungible: true
        }
      }
    })
  })

  const { result: asset } = await response.json()

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAsset",
    "params": {
      "id": "YOUR_TOKEN_MINT_ADDRESS",
      "displayOptions": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### 所有者別の全ファンジブルトークンを取得

ウォレットアドレスが所有するすべてのファンジブルトークンを取得します。効率的なクエリには`FungibleToken`インターフェースフィルターを使用します。

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Search for all fungible tokens owned by the wallet
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: walletAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${fungibleTokens.items.length} fungible tokens`)

  fungibleTokens.items.forEach(token => {
    console.log(`\nToken: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
    console.log(`Symbol: ${token.content.metadata?.symbol || 'Unknown'}`)
    console.log(`Balance: ${token.token_info?.balance}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        ownerAddress: 'WALLET_ADDRESS',
        interface: 'FungibleToken',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()

  console.log(`Found ${result.items.length} fungible tokens`)

  result.items.forEach(token => {
    console.log(`Token: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "interface": "FungibleToken",
      "limit": 1000,
      "options": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### クリエイター別のトークンを検索

特定のアドレスによって作成されたすべてのファンジブルトークンを検索します。

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const creatorAddress = publicKey('CREATOR_ADDRESS')

  // Search for tokens by creator
  const tokens = await umi.rpc.searchAssets({
    creatorAddress: creatorAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${tokens.items.length} tokens by creator`)

  tokens.items.forEach(token => {
    console.log(`Token: ${token.content.metadata?.name} (${token.id})`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        creatorAddress: 'CREATOR_ADDRESS',
        interface: 'FungibleToken',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()
  console.log(`Found ${result.items.length} tokens by creator`)
})();
```
{% /totem-accordion %}
{% /totem %}

## アプローチの比較

| 機能 | 直接RPC | DAS API |
|---------|-----------|---------|
| 速度 | バルククエリでは遅い | バルククエリに最適化 |
| データの鮮度 | リアルタイム | ほぼリアルタイム（インデックス化） |
| 検索機能 | 限定的 | 高度なフィルタリング |
| レート制限 | 標準RPCの制限 | プロバイダー依存 |
| ユースケース | 単一トークンの検索 | ポートフォリオビュー、検索 |

## ヒントとベストプラクティス

1. **ポートフォリオビューにはDASを使用** - ユーザーが所有するすべてのトークンを表示する場合、DAS APIは複数のRPCコールよりも大幅に高速です。

2. **showFungibleを有効にする** - 残高や小数点以下桁数を含む完全なトークン情報を取得するには、表示オプションで常に`showFungible: true`を設定してください。

3. **小数点以下桁数を正しく処理** - トークン量は生の整数として返されます。人間が読める量を取得するには`10^decimals`で割ってください。

4. **メタデータをキャッシュ** - トークンメタデータはほとんど変更されません。APIコールを減らしパフォーマンスを向上させるためにキャッシュしてください。

5. **大きな結果をページネーション** - 多くのトークンを取得する場合、大きな結果セットを効率的に処理するためにページネーションを使用してください。詳細は[DASページネーションガイド](/das-api/guides/pagination)をご覧ください。

## 関連ガイド

- [トークンを作成する](/tokens/create-a-token)
- [DAS API概要](/das-api)
- [所有者別のファンジブルアセットを取得](/das-api/guides/get-fungible-assets)
- [条件でアセットを検索](/das-api/guides/search-by-criteria)
