---
title: 概要
metaTitle: 概要 | Token Metadata
description: SolanaのNFT標準の高レベル概要を提供します。
---

Token Metadataプログラムは、SolanaブロックチェーンでNFTやFungible アセットを扱う際の基盤となるプログラムです。この概要では、このプログラムが何を行い、その様々な機能を高レベルでどのように活用できるかを説明します。 {% .lead %}

{% callout %}
Please note that certain Token Metadata instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="token-metadata" /%}

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/token-metadata/getting-started" description="お好みの言語またはライブラリを選択し、Solanaでデジタルアセットの開発を始めましょう。" /%}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="<https://mpl-token-metadata.typedoc.metaplex.com/>" target="_blank" description="何か特定のものをお探しですか？APIリファレンスをご覧になり、回答を見つけてください。" /%}

{% /quick-links %}

## 紹介

Token Metadataプログラムは、SolanaブロックチェーンでNFTを扱う際に最も重要なプログラムの1つです。その主な目標は、**Solanaの[Fungible](https://en.wikipedia.org/wiki/Fungibility)または非Fungible [トークン](https://spl.solana.com/token)に追加データを添付すること**です。

これは、Mintアカウントのアドレスから_派生_される[Program Derived Addresses](/understanding-programs/#program-derived-addresses-pda) (PDA) を使用して実現されます。[SolanaのTokenプログラム](https://spl.solana.com/token)に馴染みがない場合、_Mintアカウント_はトークンのグローバル情報を保存し、_トークンアカウント_はウォレットとMintアカウントの関係を保存する責任があります。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="誰かのウォレット。" theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="token" theme="transparent" %}
ウォレットが所有するトークン数 \
を保存します（その他の情報も \
含まれています）。
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="mint" theme="transparent" %}
トークン自体についての情報を \
保存します。例：現在の供給量 \
や権限など。
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}

{% /diagram %}

Mintアカウントは現在の供給量などいくつかのデータ属性を含んでいますが、アプリやマーケットプレイスが理解できる標準化されたデータを注入する機能は提供していません。

これがToken MetadataプログラムがPDAを介してMintアカウントに付加される**Metadataアカウント**を提供する理由です。

{% diagram height="h-64 md:h-[500px]" %}
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

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}

{% /diagram %}

そのMetadataアカウントは、エコシステム全体で使用できる多くの貴重な情報を保持しています。例えば、トークンの作成者のリストを維持します。各作成者には`Verified`属性があり、`True`の場合、そのトークンがその作成者によって署名されたことを保証します。各作成者には`Share`属性もあり、マーケットプレイスがロイヤルティを配分するために使用できます。

Mintアカウントにより多くのデータを付加することで、**Token Metadataプログラムは通常のオンチェーントークンをデジタルアセットにすることができます**。

## JSON標準

Metadataアカウントの重要な属性の1つは、オフチェーンのJSONファイルを指す`URI`属性です。これは、オンチェーンデータの保存に関わる費用の制約を受けることなく、安全に追加のデータを提供するために使用されます。そのJSONファイルは、誰でもトークンの有用な情報を見つけるために使用できる[特定の標準](/ja/smart-contracts/token-metadata/token-standard)に従います。

{% diagram height="h-64 md:h-[500px]" %}
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

{% node #metadata-pda parent="mint" x="41" y="-100" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" y="-300" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataV1" /%}
{% node label="Update Authority" /%}
{% node label="Mint" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node #uri label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Creators" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Edition Nonce" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Uses" /%}
{% node label="Collection Details" /%}
{% node label="Programmable Configs" /%}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
オフチェーン \
JSONメタデータ
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

なお、このJSONファイルは、更新できないことを保証するためにArweaveなどの永続ストレージソリューションを使用して保存できます。さらに、Metadataアカウントの`Is Mutable`属性を使用してそれを不変にし、したがって`URI`属性—および`Name`や`Creators`などの他の属性—が変更されることを禁止できます。この組み合わせを使用することで、オフチェーンJSONファイルの不変性を保証できます。

## NFTs

あなたは疑問に思うかもしれません：これはNFTと何の関係があるのでしょうか？実際、NFTは非Fungibleな特殊なトークンです。

より正確に言うと、SolanaのNFTは以下の特性を持つMintアカウントです：

- **供給量が1**である、つまり流通しているトークンは1つだけです。
- **小数点以下が0**である、つまり0.5トークンのようなものは存在できません。
- **ミント権限がない**、つまり誰も追加のトークンをミントできません。

最終的に得られるのは、同じ種類のものと交換できないトークンであり、これが非Fungibleトークン（NFT）の定義です。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = None" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% /diagram %}

この特殊でありながら人気のあるケースでは、Metadataアカウントの目標は、そのNFTの実際のデータを提供して有用なデジタルアセットにすることです。

さらに、Token Metadataプログラムは、NFT専用の**Master Editionアカウント**と呼ばれる別のアカウントを提供します。このアカウントもMintアカウントから派生されるPDAです。

このアカウントを作成する前に、Token Metadataプログラムは上記の非Fungibleトークンの特殊な特性が満たされていることを確認します。ただし、Mint Authorityを無効にする代わりに、Mint AuthorityとFreeze AuthorityをMaster Edition PDAに転送し、Token Metadataプログラムを通さずに誰もトークンをミントまたはフリーズできないようにすることは注目に値します。[なぜこの決定が行われたかについてはFAQで詳しく読むことができます](/ja/smart-contracts/token-metadata/faq#why-are-the-mint-and-freeze-authorities-transferred-to-the-edition-pda)。

したがって、**Master Editionアカウントの存在は、そのMintアカウントの非Fungibility性の証明として機能します**。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-240" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" animated=true /%}
{% /diagram %}

## エディションの印刷

非Fungibility性の証拠であることに加えて、Master EditionアカウントはユーザーがNFTの1つまたは複数のコピーを印刷することも可能にします。

この機能は、1/1 NFTの複数のコピーをオーディエンスに提供したいクリエイターにとって特に有用です。

Master Editionアカウントには、この方法で印刷できるNFTの最大数を決定するオプションの`Max Supply`属性が含まれています。`0`に設定すると、印刷は無効になります。`None`に設定すると、無制限の数のコピーを印刷できます。

Master Edition NFT（別名オリジナルNFT）は、コピー（別名プリントNFT）を印刷するために使用できるマスターレコードとして機能します。

各プリントNFTは、独自のMintアカウントと、オリジナルNFTからデータがコピーされた独自のMetadataアカウントで構成されています。ただし、MintアカウントにMaster Editionアカウントを付加する代わりに、プリントNFTは**Editionアカウント**と呼ばれるさらに別のPDAアカウントを使用します。このアカウントは、エディション番号とそれが由来する親Master Editionを追跡します。

Master EditionアカウントとEditionアカウントは、PDAで同じシードを共有することに注意してください。これは、NFTが一方または他方になることはできるが、両方にはなれないことを意味します。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-160" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## 半Fungibleトークン

NFTがToken Metadataプログラムの最大のユースケースですが、このプログラムはFungibleトークンや、いわゆる半Fungibleトークンまたは Fungibleアセットとも連動することに注意することが重要です。

結局のところ、Metadataアカウントは、トークンのFungibility性に関係なく、トークンにデータを付加することに役立ちます。ただし、オフチェーンJSONファイルの標準は、それらのニーズに対応するために若干異なります。

トークンのFungibility性を安全に識別し、したがって使用すべき標準を決定するために、Metadataアカウントはその情報を`Token Standard`属性で追跡します。この属性はプログラムによって自動的に計算され、手動で更新することはできません。以下の値を取ることができます。

- `NonFungible`: MintアカウントはMaster Editionアカウントに関連付けられており、したがって非Fungibleです。これは典型的なNFT標準です。
- `NonFungibleEdition`: これは`NonFungible`と同じですが、NFTはオリジナルNFTから印刷されたものであり、したがってMaster EditionアカウントではなくEditionアカウントに関連付けられています。
- `FungibleAsset`: MintアカウントはFungibleですが、小数点以下は0です。小数点以下が0であることは、供給量が1に限定されていないアセットとしてトークンを扱うことができることを意味します。例えば、Fungibleアセットはゲーム業界で「木材」や「鉄」などのリソースを保存するために使用できます。
- `Fungible`: MintアカウントはFungibleであり、小数点以下が1以上です。これは分散型通貨として使用されるトークンである可能性が高いでしょう。
- `ProgrammableNonFungible`: カスタム認可ルールを強制するために常時フリーズされる特殊な`NonFungible`トークンです。詳細については次のセクションをご覧ください。

[これらの標準についてはこちらで詳しく読むことができます](/ja/smart-contracts/token-metadata/token-standard)。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

## プログラマブルNFT {% #pnfts %}

Token MetadataプログラムはSolana Tokenプログラムの上に構築されているため、誰でもToken Metadataプログラムを通さずにトークン（Fungibleかどうかに関係なく）を転送できます。これはプログラムの構成可能性にとって素晴らしいことですが、Token Metadataプログラムが付加されているトークンに対してルールを強制できないことも意味します。

これが問題になる理由の良い例は、Token Metadataがセカンダリセールロイヤルティを強制できないことです。Metadataアカウントには**Seller Fee Basis Points**属性がありますが、これは純粋に[指標的](/understanding-programs#indicative-fields)であり、誰でもロイヤルティを尊重しないマーケットプレイスを作成できました—これは実際に起こりました。

**プログラマブルNFT**は、この問題を解決するために導入されました。これらは、**基礎となるトークンアカウントを常時フリーズ状態に保つ**新しい_オプトイン_トークン標準です。そうすることで、Token Metadataプログラムを通さずに誰もプログラマブルNFTを転送、ロック、またはバーンできません。

次に、Token Metadataプログラムによって強制されるカスタムオペレーション固有の認可ルールを定義するのはクリエイター次第です。これらは、Metadataアカウントに付加される特別な**RuleSet**アカウントで定義されます。そのようなRuleSetの例は、ロイヤルティを尊重するプログラムアドレスの許可リストです。RuleSetは、[Token Auth Rules](/ja/smart-contracts/token-auth-rules)と呼ばれる新しいMetaplexプログラムの一部です。

[プログラマブルNFTについてはこちらで詳しく読むことができます](/ja/smart-contracts/token-metadata/pnfts)。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="State = Frozen" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="41" y="-120" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-230" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node #programmable-configs label="Programmable Configs" /%}
{% /node %}

{% node parent="metadata" x="-260" y="0" %}
{% node #ruleset label="RuleSet Account" theme="crimson" /%}
{% node label="Owner: Token Auth Rules Program" theme="dimmed" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="programmable-configs" to="ruleset" arrow="none" dashed=true /%}
{% /diagram %}

## その他多数

これはToken Metadataプログラムとそれが提供するものの良い概要を提供しますが、それでもやれることはまだたくさんあります。

このドキュメンテーションの他のページは、さらに詳しくドキュメント化し、重要な機能をそれぞれ個別のページで説明することを目的としています。

- [トークン標準（アセット）](/ja/smart-contracts/token-metadata/token-standard)
- [アセットのミント](/ja/smart-contracts/token-metadata/mint)
- [アセットの更新](/ja/smart-contracts/token-metadata/update)
- [アセットの転送](/ja/smart-contracts/token-metadata/transfer)
- [アセットのバーン](/ja/smart-contracts/token-metadata/burn)
- [印刷エディション](/ja/smart-contracts/token-metadata/print)
- [検証済みコレクション](/ja/smart-contracts/token-metadata/collections)
- [検証済み作成者](/ja/smart-contracts/token-metadata/creators)
- [委任された権限](/ja/smart-contracts/token-metadata/delegates)
- [アセットのロック](/ja/smart-contracts/token-metadata/lock)
- [プログラマブルNFT](/ja/smart-contracts/token-metadata/pnfts)
- [NFTエスクロー](/ja/smart-contracts/token-metadata/escrow)
