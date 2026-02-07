---
title: インストール
metaTitle: インストール | Sugar
description: Sugarインストールガイド。
---

Sugarをインストールする最も迅速で簡単な方法は、macOS、Linux、WSL（Windows Subsystem for Linux）用のインストールスクリプトを実行してプリビルドバイナリをダウンロードすることです。Windowsシステムについては、下記の📌をご覧ください。

ターミナルで以下を実行してください：
```bash
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

{% callout %}

どのバージョンを使用するかを聞かれます。V1.xはCandy Machine v2用、V2.xはCandy Machine v3用です。**最新バージョンの使用を推奨します**。

スクリプトはバイナリをマシンにインストールし、`PATH`に追加します。`PATH`変数への変更は、ターミナルを再起動するまで有効にならない場合があります。ターミナルを再起動する必要があるかどうかは、インストールスクリプトの指示に従ってください。

{% /callout %}

{% totem %}
{% totem-accordion title="📌 Windowsシステム用の手順" %}

Windowsを使用している場合は、以下の手順に従ってください：

1. [こちら](https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe)からWinstallerの実行ファイルをダウンロードしてください。

2. ダブルクリックしてバイナリを実行してみてください。信頼できないバイナリに関する警告のポップアップメッセージが表示された場合は、`詳細情報`をクリックしてから`実行`をクリックしてください。このオプションがない場合は、手順3〜6に従ってください。

3. 実行ファイルを右クリックして、`プロパティ`に移動します。

   ![Properties.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Properties.png)

4. Metaplex開発チームを信頼する場合は、下の画像に示されている`ブロックの解除`ボタンをチェックしてください。これにより、Microsoftが自動的に信頼していないため、このバイナリをコンピューター上で実行できるようになります。

   ![Unblock.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Unblock.png)

5. `適用`と`OK`をクリックします。

6. 実行ファイルをダブルクリックすると、ターミナルが開いてSugarのインストールが開始されます。

7. すべてが正常に完了すると、そのことを示すメッセージが表示されます。

   ![windows installed](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/installed.png)

8. ターミナルで`sugar`を実行して、使用できるコマンドのリストが印刷されるかどうかを確認してください。表示される場合は、準備完了です！

9. エラーがあれば、[Metaplex Discord](https://discord.gg/metaplex)の`#candy-machine`フォーラムに報告してください。

{% callout %}

このインストーラーバイナリは最新のSugarバイナリバージョンをダウンロードし、解凍して`PATH`環境のフォルダにコピーします。Rustがある場合、バイナリは`~/.cargo/bin`にコピーされ、そうでなければ`%LOCALAPPDATA%`ディレクトリに`SugarCLI`フォルダを作成します。バイナリがその場所にあれば、Windowsが自動的に見つけ、通常のコマンドラインアプリケーションとしてファイルシステムの任意のディレクトリからsugarバイナリを実行できるようになります。

{% /callout %}

{% /totem-accordion %}
{% /totem %}

## バイナリ

サポートされているOSのバイナリは以下で見つけることができます：

- [Sugar Releases](https://github.com/metaplex-foundation/sugar/releases)

## その他のインストール方法

{% callout %}

crates.ioからまたはソースからUbuntuやWSL（Windows Subsystem for Linux）にインストールする場合、追加の依存関係をインストールする必要がある場合があります：
```bash
sudo apt install libudev-dev pkg-config unzip
```

{% /callout %}

### Crates.io

Crates.ioからsugarをインストールするには、システムに[Rust](https://www.rust-lang.org/tools/install)がインストールされている必要があります。`rustup`を使用してRustをインストールすることをお勧めします：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

インストールが完了した後、以下を実行します：

```bash
rustc --version
```

Rustコンパイラのバージョンが印刷されるはずです。コマンドが失敗した場合は、`~/.cargo/bin`ディレクトリが`PATH`環境変数にあるかを確認してください。

次のステップは、Crates.ioからSugarをインストールすることです：

```bash
cargo install sugar-cli
```
これにより、Crates.ioからSugarコードがダウンロードされ、自動的にインストールされます。

### ソースからビルド

ソースコードからSugarをビルドするには、システムに[Rust](https://www.rust-lang.org/tools/install)がインストールされている必要があります。`rustup`を使用してRustをインストールすることをお勧めします：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

インストールが完了した後、以下を実行します：

```bash
rustc --version
```

Rustコンパイラのバージョンが印刷されるはずです。コマンドが失敗した場合は、`~/.cargo/bin`ディレクトリが`PATH`環境変数にあるかを確認してください。

次のステップは、Sugarリポジトリをクローンすることです：

```bash
git clone https://github.com/metaplex-foundation/sugar.git
```

これにより、リポジトリの最新コードを含む`sugar`ディレクトリが作成されます。新しく作成されたディレクトリに移動します：

```bash
cd sugar
```

その後、バイナリをビルドして`~/.cargo/bin`にインストールできます：

```bash
cargo install --path ./
```

`./cargo/bin`が`PATH`環境変数にある限り、ファイルシステムの任意のディレクトリから`sugar`を実行できるようになります。

{% callout %}

`cargo install`は、Sugarソースコードのルートディレクトリ &mdash; `Cargo.toml`が配置されているディレクトリから実行する必要があります。

{% /callout %}
