---
# remember to update dates also in /components/guides/index.js
title: ローカルバリデータのセットアップ
metaTitle: ローカルバリデータのセットアップ | Metaplex Guides
description: ローカル開発環境の設定とローカルバリデータの使用方法を学習します。
created: '04-19-2025'
updated: '04-19-2025'
keywords:
  - local validator
  - Solana testing
  - solana-test-validator
  - local development
  - Metaplex local validator
about:
  - Solana local validator
  - local development environment
  - program testing
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
  - Bash
howToSteps:
  - Install the Solana Tools CLI for your operating system
  - Start the local validator with solana-test-validator
  - Connect your application to the local validator at localhost port 8899
  - Download required programs and accounts from mainnet using the Solana CLI
  - Load programs and accounts into the local validator
  - Create a custom Metaplex validator script with pre-loaded programs
howToTools:
  - Solana CLI
  - solana-test-validator
  - Metaplex Umi
---

## 概要

**ローカルバリデータ**は、あなた個人のノードとして機能し、ライブブロックチェーンネットワークに接続する必要なしにアプリケーションをテストするためのローカルサンドボックス環境を提供します。**完全にカスタマイズ可能なローカルテスト台帳**を運用し、これはSolana台帳の簡略版で、**すべてのネイティブプログラムがプリインストール**されており、様々な機能が有効になっています。

### セットアップ

ローカルバリデータの使用を開始するには、お使いのオペレーティングシステムに適したコマンドを使用してSolana Tools CLIをインストールする必要があります。

{% dialect-switcher title="インストールコマンド" %}

{% dialect title="MacOs & Linux" id="MacOs & Linux" %}

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```

{% /dialect %}

{% dialect title="Windows" id="Windows" %}

```
cmd /c "curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /dialect %}

{% /dialect-switcher %}

**注意**: インストールスクリプトはSolanaの`1.18.18`バージョンを参照しています。最新バージョンをインストールしたり、異なるインストール方法を発見するには、公式の[Solanaドキュメント](https://docs.solanalabs.com/cli/install)を参照してください。

### 使用方法

CLIをインストール後、簡単なコマンドを実行してローカルバリデータを開始できます。

```
solana-test-validator
```

起動すると、バリデータはローカルURL（http://127.0.0.1:8899）でアクセス可能になります。このURLでコードを設定して接続を確立する必要があります。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi("http://127.0.0.1:8899")
```

ローカルバリデータは、ユーザーフォルダに`test-ledger`という名前のディレクトリを生成します。このディレクトリには、アカウントやプログラムを含むバリデータに関連するすべてのデータが保持されます。

ローカルバリデータをリセットするには、`test-ledger`フォルダを削除するか、リセットコマンドを使用してバリデータを再起動できます。

さらに、`solana-logs`機能は、テスト中にプログラム出力を監視するのに非常に役立ちます。

## プログラムとアカウントの管理

ローカルバリデータには、メインネットで見つかる特定のプログラムやアカウントは含まれていません。ネイティブプログラムとテスト中に作成したアカウントのみが含まれています。メインネットから特定のプログラムやアカウントが必要な場合、Solana CLIを使用してそれらをダウンロードしてローカルバリデータに読み込むことができます。

### アカウントとプログラムのダウンロード：

テスト目的で、ソースクラスターからローカルバリデータにアカウントやプログラムを簡単にダウンロードできます。これにより、メインネット環境を複製できます。

**アカウントの場合：**
```
solana account -u <ソースクラスター> --output <出力形式> --output-file <宛先ファイル名/パス> <取得するアカウントのアドレス>
```
**プログラムの場合：**
```
solana program dump -u <ソースクラスター> <取得するアカウントのアドレス> <宛先ファイル名/パス>
```

### アカウントとプログラムの読み込み：

ダウンロード後、これらのアカウントとプログラムはCLIを使用してローカルバリデータに読み込むことができます。特定のアカウントとプログラムをローカル環境に読み込むコマンドを実行して、テスト準備を整えることができます。

**アカウントの場合：**
```
solana-test-validator --account <アカウントを読み込むアドレス> <アカウントファイルへのパス> --reset
```
**プログラムの場合：**
```
solana-test-validator --bpf-program <プログラムを読み込むアドレス> <プログラムファイルへのパス> --reset
```

## エクスプローラでのローカルトランザクションの確認

ローカルバリデータを使用することは、多くのエクスプローラがローカルポートに接続し、前述の`test-ledger`フォルダに保存されたローカル台帳を読み取る機能を持っているため、エクスプローラの使用を妨げません。

これを行う方法は2つあります：
- お気に入りのエクスプローラのローカルクラスターを指すトランザクション署名へのリンクを作成する。
- Webページのクラスターを手動で変更し、トランザクションリンクを貼り付ける。

### トランザクション署名へのリンク作成

Umiでトランザクションを送信すると、署名と結果という2つの重要な情報を受け取ります。署名はbase58形式なので、ブロックチェーンで読み取り可能にするためにデシリアライズする必要があります。

以下のコードでこれを行えます：
```typescript
const signature = base58.deserialize(transaction.signature)[0]
```

署名を取得したら、お好みのエクスプローラで次のように使用できます：

{% totem %}

{% totem-accordion title="Solana Explorer" %}

```typescript
console.log(`Transaction Submitted! https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
```

{% /totem-accordion %}

{% totem-accordion title="SolanaFM" %}

```typescript
console.log(`Transaction Submitted! https://solana.fm/tx/${signature}?cluster=localnet-solana`)
```

{% /totem-accordion %}

{% /totem %}

### クラスターの手動変更

前述のとおり、ブロックエクスプローラではユーザーがカスタムRPCを利用してトランザクションを表示できます。ローカルバリデータトランザクションを確認するには、`クラスター選択`モーダルで入力ボックスを探し、次のアドレスを入力する必要があります：`http://127.0.0.1:8899`。

注意：[Solana Explorer](https://explorer.solana.com/)は、カスタムRPC URLを選択すると自動的にローカルバリデータポートにデフォルト設定されるため、追加の変更は必要ありません。

## 「Metaplex」ローカルバリデータの作成

{% callout title="免責事項" %}

残念ながら、このガイドの部分はBashスクリプトの使用により、**Linux**または**MacOS**のユーザーのみが利用可能です。ただし、Windowsを使用していて、独自のMetaplexバリデータを作成するためにこのガイドに従いたい場合は、[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)または[このスレッド](https://stackoverflow.com/questions/6413377/is-there-a-way-to-run-bash-scripts-on-windows)で提供されているソリューションの一つを使用できます！

{% /callout %}

ローカルバリデータのセットアップと管理の基本を理解したら、**bashスクリプト**を通じてパーソナライズされたローカルバリデータを作成・管理できます。

例えば、主要なMetaplexプログラム（`mpl-token-metadata`、`mpl-bubblegum`、`mpl-core`）を含む`metaplex-local-validator`を作成できます。

### ディレクトリの設定とプログラムデータのダウンロード

まず、ローカルバリデータに必要なプログラムを保存するためのディレクトリをパス内に作成します。

```
mkdir ~/.local/share/metaplex-local-validator
```

次に、指定されたアドレスからこのディレクトリにプログラムデータをダウンロードします。

```
solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so
```
```
solana program dump -u m BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so
```
```
solana program dump -u m CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so
```

{% totem %}

{% totem-accordion title="追加のMetaplexプログラム" %}

| 名前               | プログラムID                                |
| ------------------ | -------------------------------------------- |
| Auction House      | hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk  |
| Auctioneer         | neer8g6yJq2mQM6KbnViEDAD4gr3gRZyMMf4F2p3MEh  |
| Bubblegum          | BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY |
| Candy Guard        | Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g |
| Candy Machine v3   | CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR |
| Core               | CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d |
| Core Candy Guard   | CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ |
| Core Candy Machine | CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J |
| Gumdrop            | gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a  |
| Hydra              | hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg  |
| Inscriptions       | 1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo  |
| MPL-Hybrid         | MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb  |
| Token Auth Rules   | auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg  |
| Token Metadata     | metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s  |

{% /totem-accordion %}

{% /totem %}

### バリデータスクリプトの作成

次に、必要なすべてのプログラムでローカルバリデータを実行するプロセスを簡略化するバリデータスクリプトを作成します。バリデータセットアップをスクリプト化することで、関連するすべてのMetaplexプログラムを含むパーソナライズされた環境でテストを簡単に開始できます。

次を使用して新しいスクリプトファイルを開くことから始めます：

```
sudo nano /usr/local/bin/metaplex-local-validator
```

**注意**: /usr/local/binディレクトリが存在しない場合、`sudo mkdir -p -m 775 /usr/local/bin`を使用して作成できます。

エディタに以下のコードを貼り付けて保存します：

```bash
#!/bin/bash

# バリデータコマンド
COMMAND="solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so --bpf-program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so"

# スクリプトに渡された追加引数を追加
for arg in "$@"
do
    COMMAND+=" $arg"
done

# コマンドを実行
eval $COMMAND
```

**注意**: 終了して保存するには、Ctrl + Xを使用し、Yで確認し、Enterで保存します。

スクリプトの準備ができたら、実行できるように権限を変更します：

```
sudo chmod +x /usr/local/bin/metaplex-local-validator
```

最後に、プロジェクトフォルダ内で新しいバリデータをテストします：

```
metaplex-local-validator
```
