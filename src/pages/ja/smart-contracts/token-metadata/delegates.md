---
title: 委任された権限
metaTitle: 委任された権限 | Token Metadata
description: Token Metadataでアセットに委任された権限を承認する方法を学習します
---

アセットに単一の権限を持つことは常に理想的ではありません。時々、これらの責任の一部を他のウォレットやプログラムに委任して、私たちの代わりに行動できるようにしたい場合があります。これがToken Metadataが異なるスコープを持つ一連の委任を提供する理由です。 {% .lead %}

## MetadataとTokenの委任

Token Metadataによって提供される委任は、**Metadata委任**と**Token委任**の2つのカテゴリに分けることができます。以下でそれぞれについて詳しく説明しますが、まずそれらの違いを簡単に見てみましょう。

- **Metadata委任**は、アセットのMintアカウントに関連付けられ、委任された権限がMetadataアカウントで更新を実行できるようにします。これらはアセットの更新権限によって承認され、必要な数だけ存在できます。
- **Token委任**は、アセットのTokenアカウントに関連付けられ、委任された権限がトークンを転送、バーン、および/またはロックできるようにします。これらはアセットの所有者によって承認され、一度に1つのトークンアカウントにつき1つだけ存在できます。

## Metadata委任

Metadata委任は、Metadataレベルで動作する委任です。これらの委任は**Metadata Delegate Record** PDA（シードは `["metadata", program id, mint id, delegate role, update authority id, delegate id]`）を使用して保存されます。

そのアカウントは、**Delegate**権限およびそれを承認した**Update Authority**を追跡します。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-15" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-delegate-pda parent="mint" x="-15" y="-260" label="PDA" theme="crimson" /%}

{% node parent="metadata-delegate-pda" x="-283" %}
{% node #metadata-delegate label="Metadata Delegate Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataDelegate" /%}
{% node label="Bump" /%}
{% node label="Mint" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Update Authority" theme="orange" z=1 /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="metadata-delegate-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="metadata-delegate-pda" to="metadata-delegate" path="straight" /%}
{% /diagram %}

Metadata委任の主要な特性は以下の通りです：

- 特定のアセットに対して必要な数だけMetadata委任を作成できます。
- Metadata委任はMintアカウントから派生されるため、アセットの所有者に関係なく存在します。そのため、アセットの転送はMetadata委任に影響しません。
- Metadata委任は、アセットの現在のUpdate Authorityからも派生されます。これは、アセットのUpdate Authorityが更新されるたびに、すべてのMetadata委任が無効になり、新しいUpdate Authorityによって使用できなくなることを意味します。ただし、Update Authorityが転送し直された場合、それに関連するすべてのMetadata委任は自動的に再アクティブ化されます。
- Metadata委任は、それを承認したUpdate Authorityによって取り消すことができます。
- Metadata委任は自分自身を取り消すこともできます。

7つの異なるタイプのMetadata委任が存在し、それぞれ異なる行動スコープを持っています。以下は、異なるタイプのMetadata委任を要約した表です：

| 委任                      | セルフ更新 | コレクション内アイテム更新 | 更新スコープ                                                              |
| ------------------------- | ---------- | -------------------------- | ------------------------------------------------------------------------- |
| Authority Item            | ✅         | ❌                         | `newUpdateAuthority` ,`primarySaleHappened` ,`isMutable` ,`tokenStandard` |
| Collection                | ✅         | ✅                         | `collection` + アイテムでのコレクション検証/未検証                        |
| Collection Item           | ✅         | ❌                         | `collection`                                                              |
| Data                      | ✅         | ✅                         | `data`                                                                    |
| Data Item                 | ✅         | ❌                         | `data`                                                                    |
| Programmable Configs      | ✅         | ✅                         | `programmableConfigs`                                                     |
| Programmable Configs Item | ✅         | ❌                         | `programmableConfigs`                                                     |

名前が`Item`で終わるMetadata委任は、自分自身にのみ作用できるのに対し、他の委任は委任アセットのコレクションアイテムにも作用できることに注意してください。例えば、NFT BとCを含むCollection NFT Aがあるとします。AでData委任を承認すると、NFT A、B、Cのdataオブジェクトを更新できます。しかし、AでData Item委任を承認すると、NFT Aのdataオブジェクトのみを更新できます。

さらに、Collection委任は、コレクションのアイテムで委任されたNFTを検証/未検証できるため、少し特別です。上記の例では、AでCollection委任を承認すると、NFT BとCでそのコレクションを検証/未検証できます。

これらの各Metadata委任について詳しく見ていき、承認、取り消し、使用のコードサンプルを提供します。

### Authority Item委任

- 委任された権限はアセットのサブセットを更新できます。Metadataアカウントの以下の属性を更新できます：
  - `newUpdateAuthority`：Update Authorityを別のアカウントに転送します。
  - `primarySaleHappened`：アセットの一次販売が発生したときに`true`に切り替えます。
  - `isMutable`：アセットを不変にするために`false`に切り替えます。
  - `tokenStandard`：アセットが設定が必須になる前に作成された場合、トークン標準を設定できます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-authority-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Collection委任

- 委任された権限はアセットのサブセットを更新できます。Metadataアカウントの`collection`属性を設定できます。
- Collection NFTに適用された場合、委任された権限はそのコレクション内のアイテムに対して以下の操作を実行できます：
  - アイテムでそのCollection NFTを検証および未検証できます。これはCollection NFTが既にアイテムに設定されている場合にのみ実行できます。そうでない場合、アイテムが委任されたCollection NFTの一部であるかどうかを知る方法がありません。
  - アイテムからCollection NFTをクリアできます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任されたアセットのコレクションを更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="アイテムのコレクションをクリア" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-clear" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="アイテムのコレクションを検証" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-verify" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="アイテムのコレクションを未検証" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-unverify" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Collection Item委任

- 委任された権限はアセットのサブセットを更新できます。Metadataアカウントの`collection`属性を設定できます。
- アセットがCollection NFTであっても、Collection委任とは異なり、Collection Item委任はそのコレクションのアイテムに影響を与えることができません。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-collection-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Data委任

- 委任された権限はアセットのサブセットを更新できます。Metadataアカウントの`data`オブジェクト全体を更新できますが、それ以外は更新できません。これは、アセットの`creators`を更新できることを意味します。
- `data`オブジェクト内の`creators`配列を更新する場合、検証されていないクリエイターのみを追加および/または削除できることに注意してください。
- Collection NFTに適用された場合、委任された権限はそのコレクション内のアイテムに対して同じ更新を実行できます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="アイテムの委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-update-item" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Data Item委任

- 委任された権限はアセットのサブセットを更新できます。Metadataアカウントの`data`オブジェクト全体を更新できますが、それ以外は更新できません。これは、アセットの`creators`を更新できることを意味します。
- `data`オブジェクト内の`creators`配列を更新する場合、検証されていないクリエイターのみを追加および/または削除できることに注意してください。
- アセットがCollection NFTであっても、Data委任とは異なり、Data Item委任はそのコレクションのアイテムに影響を与えることができません。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-data-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Programmable Config委任

- Programmable Config委任は[プログラマブル非代替性トークン](/ja/smart-contracts/token-metadata/pnfts)にのみ関連します。
- 委任された権限はMetadataアカウントの`programmableConfigs`属性を更新できますが、それ以外は更新できません。これは、PNFTの`ruleSet`を更新できることを意味します。
- Collection NFTに適用された場合、委任された権限はそのコレクション内のアイテムに対して同じ更新を実行できます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="アイテムの委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-update-item" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Programmable Config Item委任

- Programmable Config委任は[プログラマブル非代替性トークン](/ja/smart-contracts/token-metadata/pnfts)にのみ関連します。
- 委任された権限はMetadataアカウントの`programmableConfigs`属性を更新できますが、それ以外は更新できません。これは、PNFTの`ruleSet`を更新できることを意味します。
- アセットがCollection NFTであっても、Programmable Config委任とは異なり、Programmable Config Item委任はそのコレクションのアイテムに影響を与えることができません。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された更新" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-programmable-config-item-update" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

## Token委任

Token委任は、Tokenレベルで動作する委任です。これはSPL TokenプログラムのTokenアカウントに直接保存されるspl-token委任を意味します。そのため、Token委任は所有者に代わってトークンを**転送およびバーン**できるだけでなく、所有者が転送、バーン、または委任を取り消すことを防ぐためにトークンを**ロックおよびロック解除**できます。これらの委任は、エスクローレスマーケットプレイス、ステーキング、アセットローンなどのアプリケーションに不可欠です。

SPL Tokenプログラムが提供する委任タイプは1つだけですが、[プログラマブルNFT](/ja/smart-contracts/token-metadata/pnfts)（PNFT）により、Token Metadataプログラムはケースバイケースで選択できるより細かい委任を提供できるようになりました。これはPNFTがSPL Tokenプログラム上で常に凍結されているため、その上に委任システムを構築できるためです。

その委任システムを**Token Record** PDAと呼ばれるPNFT固有のアカウントに保存します（シードは`["metadata", program id, mint id, "token_record", token account id]`）。SPL Tokenプログラムでも委任された権限を同期しますが、トークンは常に凍結されています。アセットが本当にロックされているかどうかを追跡するのはToken Recordアカウントの責任です。

{% diagram height="h-64 md:h-[600px]" %}
{% node %}
{% node #wallet-1 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" x=-10 y=-25 label="Non-Fungibles and Semi-Fungibles" theme="transparent" /%}

{% node x="200" parent="wallet-1" %}
{% node #token-1 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount" theme="orange" z=1 /%}
{% /node %}

{% node x="200" parent="token-1" %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" y=150 %}
{% node #wallet-2 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-2" x=-10 y=-25 label="Programmable Non-Fungibles" theme="transparent" /%}

{% node #token-2-wrapper x="200" parent="wallet-2" %}
{% node #token-2 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount = 1" /%}
{% node label="Token State = Frozen" theme="orange" z=1 /%}
{% /node %}

{% node #mint-2-wrapper x="200" parent="token-2" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint-2" x="-158" y="150" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State = Locked, Unlocked, Listed" theme="orange" z=1 /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" theme="orange" z=1 /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet-1" to="token-1" /%}
{% edge from="mint-1" to="token-1" /%}

{% edge from="wallet-2" to="token-2" /%}
{% edge from="mint-2" to="token-2" /%}
{% edge from="token-2-wrapper" to="token-record-pda" fromPosition="bottom" path="straight" /%}
{% edge from="mint-2-wrapper" to="token-record-pda" fromPosition="bottom" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

Token委任の主要な特性は以下の通りです：

- トークンアカウントごとに1つのToken委任のみ存在できます。同じトークンアカウントに新しいToken委任を設定すると、既存のものが上書きされます。
- Token委任は、アセットがロックされていない限り、アセットの所有者によって取り消すことができます。
- Token委任は、Tokenプログラムでも設定されているため、委任が自分自身を取り消すことを許可しないため、自分自身を取り消すことができません。
- Token委任は転送時にリセットされます。代替性アセットを扱う場合、委任されたすべてのトークンが転送されると、委任された権限がリセットされます。
- Standard委任は、プログラマブル非代替性トークンを除くすべてのアセットで使用できます。他のすべてのToken委任は、プログラマブル非代替性トークンでのみ使用できます。
- プログラマブル非代替性トークンで使用できるすべてのToken委任は、現在の委任された権限、その役割、およびその状態（ロックまたはロック解除）をPNFTのToken Recordアカウントに保存します。

6つの異なるタイプのToken委任が存在し、それぞれ異なる行動スコープを持っています。以下は、異なるタイプのToken委任を要約した表です：

| 委任            | ロック/ロック解除 | 転送 | バーン | 対象             | 注記                                                       |
| --------------- | ----------------- | ---- | ------ | ---------------- | ---------------------------------------------------------- |
| Standard        | ✅                | ✅   | ✅     | PNFT以外すべて   |                                                            |
| Sale            | ❌                | ✅   | ❌     | PNFTのみ         | 委任を取り消すまで所有者は転送/バーンできない              |
| Transfer        | ❌                | ✅   | ❌     | PNFTのみ         | 委任が設定されていても所有者は転送/バーンできる            |
| Locked Transfer | ✅                | ✅   | ❌     | PNFTのみ         |                                                            |
| Utility         | ✅                | ❌   | ✅     | PNFTのみ         |                                                            |
| Staking         | ✅                | ❌   | ❌     | PNFTのみ         |                                                            |

**Standard**委任は、spl-token委任に単純に委任する必要があるため、他のPNFT固有の委任よりもはるかに多くの権限を持っていることに注意してください。ただし、他の委任はより細かく、より具体的なユースケースで使用できます。例えば、**Sale**委任は、委任が設定されている限り所有者がバーンまたは転送することを禁止するため、マーケットプレイスでアセットを出品するのに最適です。

これらの各Token委任について詳しく見ていき、承認、取り消し、使用のコードサンプルを提供します。

### Standard委任

上記で述べたように、Standard委任はspl-token委任のラッパーです。Tokenプログラムに直接命令を送信することもできますが、この委任はトークン標準に関係なくToken Metadataで同じAPIを提供することを目的としています。さらに、Standard委任はネイティブのspl-token委任では不可能なアセットのロック/ロック解除ができます。

Standard委任の主要な特性は以下の通りです：

- この委任はプログラマブル非代替性トークンでは機能しません。
- 委任された権限はアセットを任意のアドレスに転送できます。そうすると委任された権限は取り消されます。
- 委任された権限はアセットをバーンできます。
- 委任された権限はアセットをロックできます（Tokenプログラムでアセットを「凍結」することとも呼ばれます）。委任された権限がアセットをロック解除（または「解凍」）するまで、所有者はそれを転送、バーン、または委任された権限を取り消すことができません。これはStandard委任に固有のものであり、ネイティブのspl-token委任では実行できません。
- 代替性アセットで使用する場合、委任された権限に委任するトークンの数を指定するために1より大きい金額を提供できます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された転送" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任されたバーン" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-burn" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック（凍結）" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック解除（解凍）" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-standard-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Sale委任（PNFTのみ）

- この委任はプログラマブル非代替性トークンでのみ機能します。
- 委任された権限はPNFTを任意のアドレスに転送できます。そうすると委任された権限は取り消されます。
- PNFTにSale委任が設定されている限り、PNFTは`Listed`という特別なトークン状態に入ります。`Listed`トークン状態は`Locked`トークン状態のより軽いバリエーションです。その間、所有者はPNFTを転送またはバーンできません。ただし、所有者はいつでもSale委任を取り消すことができ、これにより`Listed`トークン状態が削除され、PNFTは再び転送およびバーン可能になります。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された転送" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-sale-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Transfer委任（PNFTのみ）

- この委任はプログラマブル非代替性トークンでのみ機能します。
- 委任された権限はPNFTを任意のアドレスに転送できます。そうすると委任された権限は取り消されます。
- Sale委任とは異なり、Transfer委任が設定されている場合でも、所有者はPNFTを転送およびバーンできます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された転送" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-transfer-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Locked Transfer委任（PNFTのみ）

- この委任はプログラマブル非代替性トークンでのみ機能します。
- 委任された権限はPNFTをロックできます。委任された権限がPNFTをロック解除するまで、所有者はそれを転送、バーン、または委任された権限を取り消すことができません。
- 委任された権限はPNFTを任意のアドレスに転送できます。そうすると委任された権限は取り消され、ロックされていた場合はPNFTがロック解除されます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任された転送" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-transfer" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック解除" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-locked-transfer-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Utility委任（PNFTのみ）

- この委任はプログラマブル非代替性トークンでのみ機能します。
- 委任された権限はPNFTをロックできます。委任された権限がPNFTをロック解除するまで、所有者はそれを転送、バーン、または委任された権限を取り消すことができません。
- 委任された権限はPNFTをバーンできます。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="委任されたバーン" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-burn" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック解除" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-utility-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

### Staking委任（PNFTのみ）

- この委任はプログラマブル非代替性トークンでのみ機能します。
- 委任された権限はPNFTをロックできます。委任された権限がPNFTをロック解除するまで、所有者はそれを転送、バーン、または委任された権限を取り消すことができません。

{% totem %}

{% totem-accordion title="承認" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-approve" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="取り消し" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-revoke" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-lock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% totem-accordion title="ロック解除" %}
{% code-tabs-imported from="token-metadata/delegates/delegate-staking-unlock" frameworks="umi,kit" /%}
{% /totem-accordion %}

{% /totem %}

## レガシー委任

最後に、この委任システムの前に、コレクション委任は特定の**Collection Authority Record** PDAに保存されていたことに注意する価値があります。そのPDAは**Metadata Delegate Record**に似ていますが、**Collection**という1つの役割のみをサポートします。このレガシーコレクション委任は現在非推奨であり、代わりに新しい委任システムを使用することをお勧めします。

とはいえ、Token Metadataプログラムは、新しいCollection委任が期待される場所でこれらのレガシーコレクション委任を引き続き受け入れます。これは、これらのレガシー委任にまだ委任しているアセットとの下位互換性を確保するために行われます。

[Token Metadataプログラム](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/src/instruction/collection.rs)で直接詳細を学ぶことができます。
