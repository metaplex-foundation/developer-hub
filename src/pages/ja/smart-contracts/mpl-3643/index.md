---
title: MPL-3643 — RWAのためのパーミッションドトークン標準
metaTitle: MPL-3643 — Solana上のRWA向けパーミッションドトークン標準 | Metaplex
description: MPL-3643は、mpl-permissionオンチェーンプログラム群を通じて実装された、SolanaにおけるERC-3643相当の標準です。Token-2022、Token ACL（sRFC 37）、Solana Attestation Serviceの上に構築され、パーミッションドトークンの発行・管理・移転を可能にします。
created: '08-22-2026'
updated: '09-28-2026'
keywords:
  - MPL-3643
  - mpl-permission
  - tokenized securities
  - real world assets
  - RWA Solana
  - ERC-3643 Solana
  - T-REX Solana
  - compliance standard
  - permissioned token
  - Token-2022
  - Token ACL
  - sRFC 37
  - Solana Attestation Service
  - identity registry
  - KYC on-chain
  - security token
about:
  - Tokenized securities
  - On-chain compliance
  - MPL-3643
proficiencyLevel: Intermediate
faqs:
  - q: MPL-3643 とは何ですか？
    a: MPL-3643 は、トークン化証券などの RWA のために設計された、Solana 上のパーミッションドトークンのオンチェーン標準です。ERC-3643 に相当するフレームワークであり、mpl-permission プログラム群を通じて実装されています。Token-2022、Token ACL（sRFC 37）、Solana Attestation Service の上に、4つの Metaplex プログラム（Identity Registry、Compliance Module、Gate、Lifecycle Manager）で構成されています。
  - q: MPL-3643 は新しいトークンプログラムですか？
    a: いいえ。MPL-3643 トークンは標準的な Token-2022 ミントであり、コンプライアンスはトークンの置き換えではなく、その上の層です。ウォレット、エクスプローラー、DEX は既存の Token-2022 サポートを通じて統合できます。サポートの程度は、transfer hook などミントが使用する拡張の扱いと、パーミッションド資産に対する各プラットフォーム自身のポリシーに依存します。
  - q: MPL-3643 は ERC-3643 とどのような関係にありますか？
    a: MPL-3643 は ERC-3643 の Solana 版であり、アイデンティティ・コンプライアンス・トークンの各層を分離する同じアーキテクチャを保ちながら、各層を Solana のプリミティブで構築しています。Token-2022 がトークンを提供し、Token ACL と Gate Program が ERC-3643 のコンプライアンスコールバックの役割を果たし、ウォレットに紐づく Claim アカウントが Ethereum における ONCHAINID の役割を担います。Claim は Solana Attestation Service のアテステーションに裏付けられるか、信頼済みアテスターが直接付与できます。
  - q: ユーザーはトークンごとに KYC を行う必要がありますか？
    a: 各オファリングがそれぞれ入場判断を行います。発行体が元の KYC データへのアクセスを必要とする場合、MPL-3643 は再利用可能な KYC プロバイダーと組み合わせて使う設計になっており、投資家の同意のもとで既存の検証結果が新しい発行体に共有されます。元データへのアクセスが不要な発行では、共有されたオンチェーンアテステーションに依拠するより簡単な方法もあります。この場合、検証を行ったアテステーションプロバイダーを信頼することになります。
  - q: すべての MPL-3643 転送に追加のコンピュートコストがかかりますか？
    a: 発行体が転送ごとの強制執行を選択した場合のみです。境界のみ（boundary-only）のトークンは解凍時とパーミッションレスな再凍結によってコンプライアンスを強制するため、解凍後の転送は追加オーバーヘッドのない通常の Token-2022 転送です。
  - q: 発行体はトークンを差し押さえたり、取り戻したりできますか？
    a: ミントがリカバリーを有効化した場合のみです。リカバリー対応ミントは Token-2022 の permanent delegate を Lifecycle Manager の PDA に設定します。この PDA はガードレール付き命令を通じてのみ署名でき、提案者と承認者の役割分離、タイムロック、限定された実行ウィンドウ、リクエストごとの対象と数量が必須です。
  - q: MPL-3643 はメインネットで利用できますか？
    a: はい。MPL-3643 は Solana メインネット上でアーリーアクセスとして稼働しています。https://form.typeform.com/to/AgllGJaz からアルファアクセスをリクエストしてください。
---

**MPL-3643** は、Solana 上で**パーミッションドトークン**の発行・管理・移転を可能にするオンチェーンプログラム群です。Solana における [ERC-3643](https://www.erc3643.org/) 相当の標準であり、**mpl-permission** プログラムを通じて実装されています。事前に定義された条件を満たすユーザーだけがトークン保有者になれることを保証するため、証券、不動産、プライベートファンドなど、実世界の価値を表すデジタル資産に最適です。コンプライアンスは標準的な **Token-2022** トークンの上の層であり、新しいトークンタイプではありません。 {% .lead %}

MPL-3643 は Solana メインネット上でアーリーアクセスとして稼働しています — [アルファアクセスをリクエスト](https://form.typeform.com/to/AgllGJaz)して開発を始めてください。

{% callout type="warning" title="監査状況" %}
MPL-3643 は監査を受けていません。Metaplex と調整することなく実資産をカストディしないでください。
{% /callout %}

## 概要

MPL-3643 は、Token-2022、Token ACL（sRFC 37）、Solana Attestation Service の上に構築された4つの Metaplex プログラムで構成されており、発行体は発行体ごとのカスタムコードではなく、オンチェーンプログラムによって適格性ルールが強制されるパーミッションドトークンをローンチできます。

- **標準と実装** — MPL-3643 は標準の名称、**mpl-permission** はコードの名称です。リポジトリ、npm パッケージ、Rust クレートはすべて `mpl-permission` プレフィックスを使用します。
- **標準トークン＋レイヤー化されたコンプライアンス** — MPL-3643 トークンはカスタムトークンプログラムではなく Token-2022 ミントであるため、ウォレット、エクスプローラー、DEX は既存の Token-2022 サポートを通じて統合できます。サポートの程度は、transfer hook などミントが使用する拡張の扱いと、パーミッションド資産に対する各プラットフォーム自身のポリシーに依存します。
- **4つのプログラム** — Identity Registry、Compliance Module、Gate、Lifecycle Manager。それぞれ独立して監査可能です。
- **再利用可能な検証** — この標準は再利用可能な KYC プロバイダーと組み合わせて使う設計になっています。投資家の同意のもと、既存の検証結果がオフチェーンで新しい発行体に共有されるため、投資家は書類提出を繰り返す必要がなく、各発行体は自身のデータ管理、規制上の責任、オンチェーンのクレームを保持します。
- **アーリーアクセス** — メインネットで稼働中。[アルファアクセスをリクエスト](https://form.typeform.com/to/AgllGJaz)して開発を始めてください。[ステータスと提供状況](#ステータスと提供状況)をご覧ください。

## MPL-3643 の対象ユーザー

MPL-3643 は4つのオーディエンスに対応しており、それぞれ入口が異なります。まずは[はじめに](/ja/smart-contracts/mpl-3643/getting-started)からどうぞ。

| オーディエンス | 行うこと |
|---|---|
| **RWA 発行体** | パーミッションドトークンのローンチと管理 — 管轄区域やロックアップなどの事前条件 |
| **統合開発者** | MPL-3643 トークンを扱うウォレット、取引所、アプリの構築 |
| **KYC プロバイダー** | 投資家を適格にするアテステーションの発行 |
| **ウォレット・取引所インテグレーター** | 凍結アカウント、解凍フロー、拒否理由のユーザーへの表示 |

## MPL-3643 が解決すること

Token-2022、Token ACL、Solana Attestation Service はパーミッションドトークンのためのプリミティブをすでに提供していますが、それらをコンプライアンスファーストのシステムとして組み立てるものは存在しません。今日、Solana 上で規制対象トークンを発行する各発行体は、その組み立てをゼロから書いています。

MPL-3643 は欠けていたピースを提供します：

- アイデンティティとコンプライアンス状態をチェックすることで sRFC 37 ゲートインターフェースを実装する **Gate プログラム**。
- アテステーションをトークンごとの要件にマッピングする**レジストリ** — 「このトークンには信頼できるプロバイダーによる KYC と適格投資家認定が必要」といった定義。
- **設定可能なルールエンジン** — 保有者数上限、管轄区域リスト、ロックアップ、取引量制限 — 発行体ごとのカスタムコードなしにオンチェーンで強制。
- **ライフサイクルインフラ** — ベスティング、コーポレートアクション、ガードレール付きリカバリー — コンプライアンス状態と連動。

## MPL-3643 のアーキテクチャ

MPL-3643 は、既存の3つの Solana コンポーネントの上に階層化された4つの Metaplex プログラムです。アイデンティティ、コンプライアンスルール、凍結権限は別々のプログラムの別々の関心事であるため、それぞれ独立して監査・アップグレードできます。

{% diagram height="h-[620px]" %}

{% node %}
{% node #sdk label="mpl-permission TypeScript SDK" theme="blue" /%}
{% node label="トークンプロファイル、ワンコールでのトークンローンチ" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="-320" %}
{% node #identity label="Identity Registry" theme="blue" /%}
{% node label="Claim, TrustedAttestor, TokenTrustScope" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="0" %}
{% node #compliance label="Compliance Module" theme="blue" /%}
{% node label="境界および転送ごとのルールモジュール" theme="dimmed" /%}
{% /node %}

{% node parent="sdk" y="140" x="320" %}
{% node #lifecycle label="Lifecycle Manager" theme="blue" /%}
{% node label="イールド、ベスティング、コーポレートアクション、リカバリー" theme="dimmed" /%}
{% /node %}

{% node parent="compliance" y="150" x="-160" %}
{% node #gate label="Gate Program" theme="crimson" /%}
{% node label="sRFC 37 ゲートインターフェースを実装" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="-180" %}
{% node #tokenacl label="Token ACL (sRFC 37)" theme="slate" /%}
{% node label="ミントの凍結権限を保持" theme="dimmed" /%}
{% /node %}

{% node parent="gate" y="150" x="200" %}
{% node #sas label="Solana Attestation Service" theme="slate" /%}
{% node label="ライブの KYC アテステーション" theme="dimmed" /%}
{% /node %}

{% node parent="tokenacl" y="140" x="140" %}
{% node #t22 label="Token-2022 Mint" theme="slate" /%}
{% node label="DefaultAccountState = Frozen" theme="dimmed" /%}
{% /node %}

{% edge from="sdk" to="identity" /%}
{% edge from="sdk" to="compliance" /%}
{% edge from="sdk" to="lifecycle" /%}
{% edge from="gate" to="identity" label="アイデンティティ確認" /%}
{% edge from="gate" to="compliance" label="適格性／再凍結チェック" /%}
{% edge from="tokenacl" to="gate" label="CPI" /%}
{% edge from="identity" to="sas" label="ライブのアテステーションを読み取り" /%}
{% edge from="tokenacl" to="t22" label="凍結／解凍" /%}

{% /diagram %}

**図の説明:** mpl-permission TypeScript SDK は、Identity Registry、Compliance Module、Lifecycle Manager の3つのプログラムの上位に位置します。Gate Program は Compliance Module の下位に位置し、Identity Registry（アイデンティティ検証）と Compliance Module（保有適格性および再凍結チェック）の両方を呼び出します。Token ACL はミントの凍結権限を保持し、すべての凍結・解凍の判断のために Gate Program をクロスプログラム呼び出しします。Identity Registry は Solana Attestation Service からライブのアテステーションを読み取ります。ミントに対して Token-2022 の凍結・解凍命令を呼び出すのは Token ACL だけであり、そのアカウントは `DefaultAccountState` により作成時に凍結されています。

### プログラムの責務

各 MPL-3643 プログラムは、それぞれ厳密に1つの関心事を所有します。

| プログラム | 所有するもの |
|---|---|
| **Identity Registry** | クレーム、信頼済みアテスター、トークンごとのトラストスコープ |
| **Compliance Module** | オファリングルール — 保有者数上限、国、ロックアップ、取引量、ブラックアウト |
| **Gate Program** | アイデンティティ＋コンプライアンスを sRFC 37 の2つのエントリーポイントに合成 |
| **Lifecycle Manager** | イールド、ベスティング、コーポレートアクション、ガードレール付きリカバリー |

### コンプライアンスモジュール

発行体は、コンプライアンスモジュールのメニューからトークンごとのポリシーを構成し、各モジュールを独立して有効化・設定します。MPL-3643 は活発に開発中のため、モジュールセットはリリース前に変更される可能性があります。

| モジュール | 強制するルール |
|---|---|
| **Country** | 居住地クレームの国に基づき保有者を許可リストまたは拒否リストで管理 |
| **Holder cap** | 保有者の総数に上限を設定 |
| **Investor cap** | リンクされたウォレットを1人の投資家として数え、ユニーク投資家数に上限を設定 |
| **Lockup** | 新しく取得したトークンを転送可能になるまで時間ロック |
| **Affiliate volume** | 指定された保有者の転送量に上限を設定 |
| **Blackout** | 予定されたウィンドウ中の転送を停止 |
| **Jurisdiction pair** | 特定の国ペア間の転送を制限 |
| **Venue** | 取引を承認済みの取引所に制限 |

### クレームトピック

アイデンティティクレームは**トピック**ごとに整理されます。トピックは、信頼済みアテスターがウォレットについて主張できる事実の語彙です。現在定義されているトピックには、KYC、AML、居住地、適格投資家認定、制裁スクリーニングに加え、特定のモジュールが内部的に使用する分類トピックがあります。各トークンのトラストポリシーは必要とするトピックを指定し、各信頼済みアテスターはトピックごとに認可されます。トピック空間は拡張可能で、新しい合否形式の適格性ラベルはプログラム変更ではなく設定変更で追加できます。モジュールセットと同様、現在定義されているトピックはリリース前に洗練される可能性があります。

### Metaplex と発行体の役割

Metaplex はインフラを提供し、発行体は自身のトークンのポリシーを設定します。

- **Metaplex はオンチェーンインフラを提供します。** Metaplex は MPL-3643 を動かす4つのプログラムをデプロイ・保守し、グローバルな信頼済みアテスターリストをキュレーションします。MPL-3643 は、ユーザーがトークンを保有するために発行体が定めた事前条件を強制します。
- **発行体はポリシーオペレーターです。** 各発行体は自身の `ComplianceConfig` を作成し、有効化するモジュールを選択し、モジュールパラメータを設定し、トークンごとのトラストスコープを通じて受け入れる KYC プロバイダーを選択し、オーナーキーを管理します。トークン自体とそのコンプライアンス態勢に対する責任は発行体にあります。

{% callout type="note" title="MPL-3643 は設定を強制しますが、コンプライアンスを保証するものではありません" %}
これらのページはプログラムが強制する内容を説明しています。特定の設定が適用される規制を満たすかどうかは、発行体とその法律顧問が判断すべき問題です。
{% /callout %}

## ERC-3643 から MPL-3643 へのコンポーネント対応

MPL-3643 は ERC-3643 の関心事の分離を維持し、各 Ethereum コントラクトを Solana のプリミティブで置き換えています。

| ERC-3643 コンポーネント | MPL-3643 での対応物 |
|---|---|
| トークンコントラクト（ERC-20） | Token ACL（sRFC 37）に接続された Token-2022 ミント |
| Identity Registry | Identity Registry プログラム |
| Identity Registry Storage | Identity Registry 内のウォレットに紐づく `Claim` アカウント |
| ONCHAINID | ウォレットに紐づく `Claim` アカウント。Solana Attestation Service のアテステーションに裏付けられるか、信頼済みアテスターが直接付与 |
| Trusted Issuers Registry | Identity Registry 内の `TrustedAttestor` アカウント |
| Claim Topics Registry | トークントラストスコープの必須トピック（トークンごとに設定） |
| Compliance Module | Compliance Module プログラム＋sRFC 37 Gate Program |
| Agent ロール | プログラムごとの `RoleGrant` PDA による `owner` / `operator` / `agent` ロール |

構造上の唯一の違い：ERC-3643 はトークンの `transfer()` 内でコンプライアンスをチェックします。Solana には通常の転送に対する同等のフックがないため、MPL-3643 は**凍結と解凍**の時点で適格性を強制します — アカウントは作成時に凍結されており、コンプライアンスを満たすウォレットだけが解凍できます。ロックアップや取引量制限など、すべての転送で評価しなければならない一部のコンプライアンスモジュールは転送ごとのチェックを必要とし、それらは Token-2022 transfer hook を通じて強制されます。

## 通常の Token-2022 ミントとの違い

MPL-3643 が変えるのはトークンを保有できる人であり、トークン自体の移動方法ではありません。

| | 通常の Token-2022 ミント | MPL-3643 トークン |
|---|---|---|
| トークンアカウントの初期状態 | 解凍済み | 凍結（`DefaultAccountState = Frozen`） |
| 凍結権限 | 発行体のキー | Token ACL の `MintConfig` PDA |
| ミント権限 | 発行体のキー | コンプライアンス初期化後は `ComplianceConfig` PDA |
| 解凍できる人 | 凍結権限者 | 誰でもパーミッションレスに — Gate Program が判断 |
| 保有できる人 | 誰でも | アイデンティティと保有適格性チェックを通過したウォレット |
| 転送ごとのコスト | なし | 境界のみのトークンではなし。オプトインした場合は transfer hook |

## プロトコル手数料

MPL-3643 は、資産設定、保有者アカウント有効化、分配実行の時点で、SOL 建ての固定プロトコル手数料を課します。移転される価値、調達資本、運用資産額に対するパーセンテージは一切ありません。

{% protocol-fees program="mpl-3643" showTitle=false /%}

Metaplex の全プロトコル手数料の最新情報については、[プロトコル手数料](/ja/protocol-fees)ページをご覧ください。

## クイックリファレンス

### プログラム

| プログラム | プログラム名 | 目的 |
|---|---|---|
| Identity Registry | `mpl-permission-identity-registry` | クレーム、信頼済みアテスター、トラストスコープ |
| Compliance Module | `mpl-permission-compliance` | 境界および転送ごとのルール強制 |
| Gate Program | `mpl-permission-gate` | 解凍・凍結判断のための sRFC 37 ゲート |
| Lifecycle Manager | `mpl-permission-lifecycle` | イールド、ベスティング、コーポレートアクション、リカバリー |

### SDK

MPL-3643 には、統合 TypeScript SDK（`@metaplex-foundation/mpl-permission`）と Rust SDK（`mpl-permission`）が付属し、それぞれ4つのプログラム向けに生成された低レベルクライアントに裏付けられています。SDK が主要なインターフェースであり、ローンチのブートストラップ順序を自動的に処理します。SDK は[アルファオンボーディング](https://form.typeform.com/to/AgllGJaz)を通じて提供されます。

### 外部依存関係

| 依存関係 | MPL-3643 での役割 | 状況 |
|---|---|---|
| [Token-2022](https://spl.solana.com/token-2022) | ミントとトークンアカウント | メインネットで稼働中 |
| [Token ACL (sRFC 37)](https://solana.com/developers/guides/advanced/acl) | ミントの凍結権限を保持し、Gate Program を呼び出す | メインネットとデブネットで稼働中。ソースコード監査済み |
| [Solana Attestation Service](https://attest.solana.com/) | ライブの KYC・適格投資家認定アテステーション | メインネットで稼働中 |

## ステータスと提供状況

MPL-3643 はメインネット上でアーリーアクセスとして稼働しており、監査前の段階です。

- **メインネットでのアーリーアクセス。** 4つのプログラムはメインネットにデプロイされ、アルファパートナーとともに運用されています（[アルファアクセスをリクエスト](https://form.typeform.com/to/AgllGJaz)）。
- **監査。** MPL-3643 はセキュリティ監査を受ける予定です。Metaplex のプログラム監査の方法と脆弱性の報告方法については[セキュリティ](/ja/security)をご覧ください。
- **Token ACL 依存関係。** Token ACL（sRFC 37）は稼働中で、ソースコードは監査済みです。MPL-3643 は、リリースデューデリジェンスの一環としてバインドする Token ACL デプロイメントを検証します。
- **安定性レベル。** MPL-3643 は[安定性インデックス](/ja/stability-index)で Experimental として掲載されています。

## 注記

- MPL-3643 トークンは **Token-2022** ミントであり、従来の SPL Token ミントではありません。統合には Token-2022 プログラム ID を使用する必要があります。
- 境界のみのトークンには transfer hook がないため、解凍後の転送に MPL-3643 のコンピュートコストはかかりません。転送ごとのモジュールを使うには Compliance Module の Token-2022 transfer hook へのオプトインが必要で、既存のミントに後から追加することはできません。
- オンチェーンの強制執行により、少数の固定された事実が公開で読み取り可能になりますが、いずれも直接的な識別子を含みません。管轄区域ルールの対象となるウォレットは ISO-3166 国コードを記録した居住地クレームを保有します — これはルールを自律的に強制するためのトレードオフであり、ERC-3643 の ONCHAINID と同じ選択です。クレームはトピック、アテスター、有効期限を公開し、投資家数上限をオプトインしたトークンは同一投資家が管理するウォレットをリンクします。氏名、書類、詳細な KYC 結果はオフチェーンに留まりますが、ウォレットに紐づくレコード自体は公開されており、他の公開チェーンデータと同様、ウォレットと所有者を結びつけられる観察者にとっては個人データとなり得ます。
- コンプライアンス初期化はミントの `MintTokens` 権限を `ComplianceConfig` PDA に不可逆的に移転します。生のミント権限を必要とするすべての命令は、その前に実行しなければなりません。
- Metaplex Foundation により保守。最終確認 2026-09-28。

## FAQ

### MPL-3643 とは何ですか？

MPL-3643 は、トークン化証券などの RWA のために設計された、Solana 上のパーミッションドトークンのオンチェーン標準です。ERC-3643 に相当するフレームワークであり、**mpl-permission** プログラム群を通じて実装されています。Token-2022、Token ACL（sRFC 37）、Solana Attestation Service の上に、4つの Metaplex プログラム — Identity Registry、Compliance Module、Gate、Lifecycle Manager — で構成されています。開発者向け成果物 — リポジトリ、npm パッケージ、Rust クレート — は `mpl-permission` プレフィックスを使用します。

### MPL-3643 は新しいトークンプログラムですか？

いいえ。MPL-3643 トークンは標準的な Token-2022 ミントであり、コンプライアンスはトークンの置き換えではなく、その上の層です。ウォレット、エクスプローラー、DEX は既存の Token-2022 サポートを通じて統合できます。サポートの程度は、transfer hook などミントが使用する拡張の扱いと、パーミッションド資産に対する各プラットフォーム自身のポリシーに依存します。

### MPL-3643 は ERC-3643 とどのような関係にありますか？

MPL-3643 は ERC-3643 の Solana 版であり、アイデンティティ・コンプライアンス・トークンの各層を分離する同じアーキテクチャを保ちながら、各層を Solana のプリミティブで構築しています。Token-2022 がトークンを提供し、Token ACL と Gate Program が ERC-3643 のコンプライアンスコールバックの役割を果たし、ウォレットに紐づく `Claim` アカウントが Ethereum における ONCHAINID の役割を担います。Claim は Solana Attestation Service のアテステーションに裏付けられるか、信頼済みアテスターが直接付与できます。[コンポーネント対応](#erc-3643-から-mpl-3643-へのコンポーネント対応)をご覧ください。

### ユーザーはトークンごとに KYC を行う必要がありますか？

各オファリングがそれぞれ入場判断を行います。発行体が元の KYC データへのアクセスを必要とする場合、MPL-3643 は再利用可能な KYC プロバイダーと組み合わせて使う設計になっています。投資家の同意のもと、元の検証結果がオフチェーンで新しい発行体に共有されるため、投資家は書類の再アップロードを避けられ、各発行体は自身のデータ管理と規制上の責任を保持します。元データへのアクセスが不要な発行では、共有されたオンチェーンアテステーションに依拠するより簡単な方法もあります。この場合、検証を行ったアテステーションプロバイダーを信頼することになります。いずれの方法でも、氏名、書類、詳細な KYC 結果はオフチェーンに留まります。共有されるオンチェーンアテステーションが記録するのは検証合格の結果のみであり、MPL-3643 が記録するのはウォレット、クレームトピック、アテスター、有効期限といった強制執行メタデータです。ただし、このメタデータはウォレットに紐づく公開情報であるため、ウォレットと所有者を結びつけられる者にとっては依然として個人データとなり得ます。

### すべての MPL-3643 転送に追加のコンピュートコストがかかりますか？

発行体が転送ごとの強制執行を選択した場合のみです。境界のみのトークンは解凍時に、そしてパーミッションレスな再凍結を通じて継続的にコンプライアンスを強制するため、解凍後の転送は通常の Token-2022 転送です。Compliance Module の transfer hook を有効化したトークンは、すべての転送でコンプライアンス評価のコストを支払います。

### 発行体はトークンを差し押さえたり、取り戻したりできますか？

ミントがリカバリーをオプトインした場合のみです。リカバリー対応ミントは、Token-2022 の permanent delegate を、秘密鍵を持たず、ガードレール付きリカバリー命令を通じてのみ署名できる Lifecycle Manager のプログラムアドレスに設定します — 提案者と承認者の役割分離、タイムロック、限定された実行ウィンドウ、オンチェーンの監査証跡、リクエストごとの対象アカウントと数量が必須です。permanent delegate を持たないミントは、一切取り戻すことができません。

### MPL-3643 はメインネットで利用できますか？

はい。MPL-3643 は Solana メインネット上でアーリーアクセスとして稼働しています。[アルファアクセスをリクエスト](https://form.typeform.com/to/AgllGJaz)して始めてください。

## 用語集

| 用語 | 定義 |
|---|---|
| **Attestation（アテステーション）** | KYC プロバイダーが Solana Attestation Service を通じて発行する、署名付きのオンチェーン資格情報。 |
| **Boundary module（境界モジュール）** | 各転送時ではなく、ウォレットが適格性に出入りするタイミング（解凍、再凍結、ミント、バーン）で評価されるコンプライアンスルール。 |
| **Claim（クレーム）** | あるウォレットが特定の信頼済みアテスターから特定のクレームトピックを保有していることを記録する、ウォレットに紐づく Identity Registry アカウント。 |
| **Claim topic（クレームトピック）** | KYC、適格投資家認定、保有者ロールなど、クレームの種類を表す数値識別子。 |
| **Cranker（クランカー）** | コンプライアンスを満たさなくなったアカウントを再凍結したり、イールドインデックスを進めたりするパーミッションレスな呼び出し主体。 |
| **Gate Program（ゲートプログラム）** | sRFC 37 ゲートインターフェースを実装し、すべての解凍・凍結判断に応答する MPL-3643 プログラム。 |
| **Per-transfer module（転送ごとモジュール）** | すべての転送時に Token-2022 transfer hook 内で評価されるコンプライアンスルール。 |
| **Re-freeze（再凍結）** | 一度解凍された後にコンプライアンスを満たさなくなったアカウントを、パーミッションレスに凍結すること。 |
| **sRFC 37** | Token ACL と、パーミッションレスな凍結・解凍のためのゲートプログラムインターフェースを定義する Solana 標準。 |
| **Token ACL** | ミントの凍結権限を保持し、凍結・解凍の前にゲートプログラムに照会する稼働中の Solana プログラム。 |
| **Transfer envelope（転送エンベロープ）** | MPL-3643 トークンを移動するためにインテグレーターが従うべき、準備・転送・確定のシーケンス。 |
| **Trust scope（トラストスコープ）** | トークンが受け入れる信頼済みアテスターと必要とするクレームトピックを指定する、トークンごとのアカウント。 |
| **Trusted attestor（信頼済みアテスター）** | オンチェーンでクレームを付与するキーの持ち主 — 通常はトークン発行体 — で、Identity Registry にグローバルに登録され、特定のクレームトピックについて認可されます。検証を実施するオフチェーンの KYC プロバイダーとは区別されます。 |
