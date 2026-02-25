---
title: プログラマブルNFT（pNFT）
metaTitle: プログラマブルNFT（pNFT）| Token Metadata
description: Token MetadataのプログラマブルNFT（pNFT）について詳しく学習します
---

[概要ページ](/ja/smart-contracts/token-metadata#pnfts)で述べられているように、プログラマブルNFT（pNFT）は、作成者が特定の操作にカスタムルールを定義し、サードパーティの権限により細かく委任できる新しいアセット標準です。 {% .lead %}

## Token Metadataのバイパスの廃止

Token MetadataプログラムはSPL Tokenプログラムの上に構築されているため、任意の所有者またはspl-token委任がSPL Tokenプログラムと直接やり取りし、転送やバーンなどの重要な操作でToken Metadataプログラムをバイパスできます。これはプログラム間の優れた構成可能性パターンを作成しますが、Token Metadataプログラムが作成者の代わりにルールを強制できないことも意味します。

これが問題となる良い例は、Token Metadataがセカンダリセールのロイヤルティを強制できないことです。ロイヤルティの割合が**Metadata**アカウントに保存されていても、転送を実行するユーザーまたはプログラムがそれを尊重するかどうかを決定するのは彼ら次第です。これについて、およびpNFTがこの問題をどのように解決するかについては、[以下のセクション](#use-case-royalty-enforcement)で詳しく説明します。

プログラマブルNFTは、**作成者がアセットの認証層をカスタマイズできる**柔軟な方法でこの問題を解決するために導入されました。

プログラマブルNFTは以下のように動作します：

- **pNFTのTokenアカウントは、pNFTが委任されているかどうかに関係なく、SPL Tokenプログラムで常にフリーズされています**。これにより、誰もSPL Tokenプログラムと直接やり取りしてToken Metadataプログラムをバイパスできないことが保証されます。
- pNFTのTokenアカウントで操作が実行されるたびに、Token Metadataプログラムは**アカウントを解凍し、操作を実行し、再度アカウントをフリーズします**。これはすべて同じ命令で**アトミック**に発生します。このようにして、SPL Tokenプログラムで実行可能なすべての操作はpNFTでも利用できますが、常にToken Metadataプログラムを通じて実行されます。
- [Token委任](/ja/smart-contracts/token-metadata/delegates#token-delegates)がpNFTに設定されると、情報は**Token Record**アカウントに保存されます。pNFTはSPL Tokenプログラムで常にフリーズされているため、pNFTが実際にロックされているかどうかを追跡するのはToken Recordアカウントの責任です。
- pNFTに影響を与えるすべての単一操作がToken Metadataプログラムを通過する必要があるため、これらの操作に認証ルールを強制できるボトルネックが作成されました。これらのルールは、**Token Auth Rules**プログラムによって管理される**Rule Set**アカウントで定義されます。

本質的に、これによりpNFTは以下の能力を持ちます：

1. より細かい委任を持つ。
2. あらゆる操作にルールを強制する。

これら2つの能力についてより詳しく見てみましょう。

## より細かい委任

すべてのpNFT操作がToken Metadataプログラムを通過する必要があるため、spl-token委任の上に新しい委任システムを作成できます。これはより細かく、pNFT所有者がサードパーティに委任したい操作を選択できるようにします。

この新しい委任システムの情報は、pNFTのMintアカウントとTokenアカウントの両方から派生する特別な**Token Record** PDAに保存されます。新しい委任権限がpNFTに割り当てられると、Token MetadataプログラムはTokenアカウントとToken Recordアカウントの両方でその情報を同期します。

これらの委任については、[委任された権限ページの「Token委任」セクション](/ja/smart-contracts/token-metadata/delegates#token-delegates)でより詳しく説明します。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="0" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## 追加アカウント

pNFTはほとんどの操作で追加のアカウントを必要とし、これらには`tokenRecord`、`authorizationRules`、`authorizationRulesProgram`が含まれます。

### Token Record

`tokenRecord`アカウントは、`delegates`やその`lock`状態などのトークンとその状態に関する詳細を保持する責任があります。

`tokenRecord`アカウントにアクセスする方法がいくつかあり、それはmetadata、token account、token recordを含む必要なすべてのアカウントを返す`fetchDigitalAssetWithAssociatedToken`を使用するか、`findTokenRecordPda`関数を使用してmint IDとtoken accountアドレスでtoken record PDAアドレスを生成する方法です。

#### アセットとトークン

`fetchDigitalAssetWithAssociatedToken`関数を使用してすべてのアカウントを取得できます。これはpNFT metadataアカウント、token account、token recordアカウントなどのデータを返します。

{% code-tabs-imported from="token-metadata/pnft-fetch-with-token" frameworks="umi,kit" /%}

#### Token Record PDA

`mintId`とpNFTアセットが保存されているウォレットの`tokenAccount`を使用して、`tokenRecord`アカウントのPDAアドレスを生成します。

{% code-tabs-imported from="token-metadata/pnft-find-token-record-pda" frameworks="umi,kit" /%}

### RuleSet

`metadata`アカウントデータが利用可能な場合、metadataアカウントの`programmableConfig`フィールドを確認してルールセットを取得できます。

{% code-tabs-imported from="token-metadata/pnft-get-ruleset" frameworks="umi,kit" /%}

### Authorization Rules Program

pNFTアセットに`ruleSet`が設定されている場合、`ruleSet`を検証できるように**Authorization Rules Program ID**を渡す必要があります。

{% code-tabs-imported from="token-metadata/pnft-auth-rules-program" frameworks="umi,kit" /%}

### Authorization Data

検証に追加データが必要な`ruleSet`がpNFTアセットにある場合、命令パラメータで`authorizationData: { payload: ... }`として渡します。

## あらゆる操作へのルール強制

プログラマブルNFTの最も重要な機能の1つは、それらに影響を与えるあらゆる操作に一連のルールを強制できる能力です。認証層全体は、[Token Auth Rules](/token-auth-rules)と呼ばれる別のMetaplexプログラムによって提供されます。このプログラムはpNFTをプログラマブルにするために使用されますが、あらゆる用途の認証ルールを作成および検証するために使用できる汎用プログラムです。

pNFTの場合、以下の操作がサポートされています：

| 操作                          | 説明                                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Transfer:Owner`              | pNFTの所有者によって開始された転送                                                                                                                                                      |
| `Transfer:SaleDelegate`       | [Sale委任](/ja/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only)によって開始された転送                                                                                  |
| `Transfer:TransferDelegate`   | [Transfer](/ja/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only)または[Locked Transfer](/ja/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only)委任によって開始された転送 |
| `Transfer:MigrationDelegate`  | Migration委任によって開始された転送（pNFT移行期間中に使用されたレガシー委任）                                                                                                          |
| `Transfer:WalletToWallet`     | ウォレット間の転送（現在未使用）                                                                                                                                                        |
| `Delegate:Sale`               | [Sale委任](/ja/smart-contracts/token-metadata/delegates#sale-delegate-pnft-only)の承認                                                                                                  |
| `Delegate:Transfer`           | [Transfer委任](/ja/smart-contracts/token-metadata/delegates#transfer-delegate-pnft-only)の承認                                                                                          |
| `Delegate:LockedTransfer`     | [Locked Transfer委任](/ja/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only)の承認                                                                            |
| `Delegate:Utility`            | [Utility委任](/ja/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)の承認                                                                                            |
| `Delegate:Staking`            | [Staking委任](/ja/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)の承認                                                                                            |

作成者はこれらの操作のいずれかにカスタム**ルール**を割り当てることができます。その操作が実行されると、Token Metadataプログラムは操作を許可する前にルールが有効であることを確認します。利用可能なルールはToken Auth Rulesプログラムによって直接文書化されていますが、2種類のルールがあることに注意する価値があります：

- **プリミティブルール**：これらのルールは操作が許可されているかどうかを明示的に示します。例：`PubkeyMatch`ルールは、指定されたフィールドの公開鍵が指定された公開鍵と一致する場合にのみパスします。`ProgramOwnedList`は、指定されたフィールドのアカウントを所有するプログラムが指定されたプログラムリストの一部である場合にのみパスします。`Pass`ルールは常にパスします。など。
- **複合ルール**：これらのルールは複数のルールを集約して、より複雑な認証ロジックを作成します。例：`All`ルールは、含まれるすべてのルールがパスする場合にのみパスします。`Any`ルールは、含まれるルールの少なくとも1つがパスする場合にのみパスします。`Not`ルールは、含まれるルールがパスしない場合にのみパスします。など。

操作のすべてのルールが定義されたら、Token Auth Rulesプログラムの**Rule Set**アカウントに保存できます。このRule Setに変更が必要な場合、新しい**Rule Set Revision**がRule Setアカウントに追加されます。これにより、特定のリビジョン内に現在ロックされているpNFTが、最新のリビジョンに移行する前にロック解除できることが保証されます。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="41" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #ruleset-revision label="Rule Set Revision" theme="orange" z=1 /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-80" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" theme="orange" z=1 /%}
{% /node %}

{% node parent="metadata" x="-260" %}
{% node #ruleset label="Rule Set Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% node label="Header" /%}
{% node label="Rule Set Revision 0" /%}
{% node #ruleset-revision-1 label="Rule Set Revision 1" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" fromPosition="top" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" path="straight" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" dashed=true arrow="none" animated=true /%}
{% edge from="ruleset-revision" to="ruleset-revision-1" dashed=true arrow="none" animated=true toPosition="left" /%}
{% /diagram %}

## 使用例：ロイヤルティの強制

pNFTについてより理解できたところで、pNFTで解決できる具体的な使用例を見てみましょう：ロイヤルティの強制。

上記で述べたように、pNFTがなければ、誰でもSPL Tokenプログラムと直接やり取りすることで、**Metadata**アカウントに保存されているロイヤルティパーセンテージをバイパスできます。これは、作成者がアセットとやり取りするユーザーやプログラムの善意に依存しなければならないことを意味します。

しかし、pNFTを使用すれば、作成者は**ロイヤルティを強制しないプログラムがアセットの転送を実行することを禁止する** **Rule Set**を設計できます。ニーズに応じて、許可リストまたは拒否リストを作成するためにルールの組み合わせを使用できます。

さらに、Rule Setは複数のpNFT間で共有および再利用できるため、作成者は**コミュニティRule Set**を作成および共有して、ロイヤルティのサポートを停止するプログラムが、そのようなコミュニティRule Setを使用するすべてのpNFTとのやり取りから即座に禁止されるようにできます。これは、プログラムがロイヤルティをサポートする強力なインセンティブを作成します。そうしなければ、多数のアセットとのやり取りから禁止されることになるからです。
