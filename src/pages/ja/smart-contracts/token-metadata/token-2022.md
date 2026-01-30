---
title: Token MetadataでのSPL Token-2022
metaTitle: SPL Token-2022 | Token Metadata
description: SPL Token-2022がToken Metadataとどのように統合されているかを学習します
---

SPL Token-2022は、Solanaブロックチェーン上でfungibleおよびnon-fungibleトークンを作成するために使用できる最新のトークンプログラムです。SPL Tokenプログラムと同じ機能と構造をサポートしていますが、新しい機能を追加する拡張機能セットも含まれています。

Token-2022 Mintアカウントにメタデータ情報を追加することをサポートするために、Token Metadataの一連の命令が更新され、希望するトークンプログラムを指定できるようになりました。例えば、Token MetadataはToken-2022 Mintを初期化し、`Create`および`Mint`命令を使用してメタデータを作成し、トークンをミントし、使用するトークンプログラムとしてSPL Token-2022を指定できます。

{% totem %}

{% totem-accordion title="Metadataの作成" %}

{% code-tabs-imported from="token-metadata/token-2022-create" frameworks="umi,kit,shank" /%}

{% /totem-accordion  %}

{% totem-accordion title="トークンのミント" %}

{% code-tabs-imported from="token-metadata/token-2022-mint" frameworks="umi,kit,shank" /%}

{% /totem-accordion  %}

{% totem-prose %}

Mintアカウントのトークンプログラムは、アカウントの`owner`プロパティを確認することで判別できます。

{% /totem-prose %}

{% /totem %}

`Burn`、`Delegate`、`Lock`、`Print`、`Revoke`、`Transfer`、`Unlock`、`Unverify`、`Update`、`Verify`などの他の命令にも同様のアプローチを使用できます。これらの命令はSPL Token-2022のMintおよびTokenアカウントを検証できます。トークンプログラムを必要とする命令（例：`Delegate`）では、対応するトークンプログラムを使用する必要があります：MintおよびTokenアカウントがToken-2022からのものである場合、`Delegate`命令は正しいトークンプログラムが指定されているかを検証します。

{% callout %}
デフォルトでは、`Create`および`Mint`は、これらのアカウントが存在しない場合、SPL Token MintおよびTokenアカウントを作成します。Token-2022アカウントを使用するには、使用するトークンプログラムとしてSPL Token-2022を指定する必要があります。
{% /callout %}

## サポートされる拡張機能

Token-2022はいくつかの拡張機能を提供していますが、拡張機能の大部分はfungibleトークンに焦点を当てています。例えば、`confidential transfer`は転送されるトークンの量を隠すために使用できます。これは、異なる転送間で量が変化する可能性があるためfungibleに関連しますが、供給量が常に`1`で小数点が常に`0`であるnon-fungibleトークンには適用されません。したがって、non-fungibleトークンの転送量は常に`1`になります。

Token Metadataは、`Token Standard`に基づいてMintおよびTokenアカウントに存在できる拡張機能のタイプに制限を適用します。fungibleアセット（`Fungible`および`FungibleAsset`標準）の場合、制限は設定されません - 唯一の制限はメタデータ情報を提供するプログラムに関するものです。non-fungibleアセット（`NonFungible`および`ProgrammableNonFungible`標準）の場合、Token Metadataはどの拡張機能が有効になっているかを検証し、使用できる拡張機能のセットを制限します。

### Mintアカウント拡張機能

これらはSPL Token-2022のMintアカウントで有効にできる拡張機能です。

- `confidential transfers`: 転送中に量を隠します。

  | アセット | Fungible | Non-Fungible                                           |
  | -------- | -------- | ------------------------------------------------------ |
  | 許可     | ✅       | ❌                                                     |
  | 詳細     | --       | non-fungibleは供給量が`1`であるため適用されません       |

---

- `transfer fees`: 転送される量から派生する転送手数料を設定できます。

  | アセット | Fungible | Non-Fungible                                           |
  | -------- | -------- | ------------------------------------------------------ |
  | 許可     | ✅       | ❌                                                     |
  | 詳細     | --       | non-fungibleは供給量が`1`であるため適用されません       |

---

- `closing mint`: 供給量が`0`に達したときにMintアカウントを閉じることができます。

| アセット | Fungible                                              | Non-Fungible                                                         |
| -------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| 許可     | ✅                                                    | ❌                                                                   |
| 詳細     | 閉じる権限として`Metadata`アカウントを指定する必要があります | 作成者が同じMintとMetadataアカウントのグループを再作成する可能性があります |

---

- `interest-bearing tokens`: トークンのUI量の表示方法を変更できます。

  | アセット | Fungible | Non-Fungible                                           |
  | -------- | -------- | ------------------------------------------------------ |
  | 許可     | ✅       | ❌                                                     |
  | 詳細     | --       | non-fungibleは供給量が`1`であるため適用されません       |

---

- `non-transferable tokens`: 他のアドレスに移動できない「ソウルバウンド」トークンを許可します。

  | アセット | Fungible | Non-Fungible |
  | -------- | -------- | ------------ |
  | 許可     | ✅       | ✅           |
  | 詳細     | --       | --           |

---

- `permanent delegate`: Mintの任意のTokenアカウントに永続的なアカウント委任を指定できます。

  | アセット | Fungible | Non-Fungible                  |
  | -------- | -------- | ----------------------------- |
  | 許可     | ✅       | ❌                            |
  | 詳細     | --       | これは所有権の概念を変えます   |

---

- `transfer hook`: 転送中にサードパーティプログラムを呼び出すことができます。

  | アセット | Fungible | Non-Fungible                                |
  | -------- | -------- | ------------------------------------------- |
  | 許可     | ✅       | ❌                                          |
  | 詳細     | --       | Token Metadataが転送のロジックを指定します   |

---

- `metadata pointer`: 正規のメタデータを記述するアドレスを追加できます。

  | アセット | Fungible                         | Non-Fungible                     |
  | -------- | -------------------------------- | -------------------------------- |
  | 許可     | ✅                               | ✅                               |
  | 詳細     | `Metadata`アドレスを指す必要があります | `Metadata`アドレスを指す必要があります |

---

- `metadata`: Mintアカウントに直接メタデータを追加できます。

  | アセット | Fungible                                     | Non-Fungible                                 |
  | -------- | -------------------------------------------- | -------------------------------------------- |
  | 許可     | ❌                                           | ❌                                           |
  | 詳細     | メタデータ情報はToken Metadataによって追加されます | メタデータ情報はToken Metadataによって追加されます |

---

### Tokenアカウント拡張機能

これらはSPL Token-2022のTokenアカウントで有効にできる拡張機能です。

- `memo required`: 転送時にメモを要求します。

  | アセット | Fungible | Non-Fungible |
  | -------- | -------- | ------------ |
  | 許可     | ✅       | ❌           |
  | 詳細     | --       | 適用されません |

---

- `immutable ownership`: Tokenアカウントの所有権を変更する機能を無効にします。

  | アセット | Fungible | Non-Fungible |
  | -------- | -------- | ------------ |
  | 許可     | ✅       | ✅           |
  | 詳細     | --       | --           |

---

- `default account state`: デフォルトのTokenアカウント状態を設定できます。

  | アセット | Fungible | Non-Fungible                            |
  | -------- | -------- | --------------------------------------- |
  | 許可     | ✅       | ❌                                      |
  | 詳細     | --       | Token Metadataがアカウント状態を検証します |

---

- `CPI guard`: クロスプログラム呼び出し内での特定のアクション（例：転送）を防止します。

  | アセット | Fungible | Non-Fungible                                |
  | -------- | -------- | ------------------------------------------- |
  | 許可     | ✅       | ❌                                          |
  | 詳細     | --       | Token Metadataが転送のロジックを指定します   |

---

{% callout %}
各拡張機能の包括的な概要は、SPL Token-2022プログラムの[ドキュメント](https://spl.solana.com/token-2022)で確認できます。
{% /callout %}

### デフォルト拡張機能

Mintアカウントが存在しない場合、`Create`命令が1つを初期化します。使用されているトークンプログラムがSPL Token-2022の場合、Mintは`closing mint`と`metadata pointer`の両方の拡張機能で初期化されます。

Associated Token Accounts（ATA）はデフォルトで常に`immutable ownership`拡張機能で初期化されます。
