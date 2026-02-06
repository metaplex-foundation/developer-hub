---
title: 安装
metaTitle: Sugar CLI 安装指南 | Metaplex Candy Machine
description: Sugar 安装指南。
---

安装 Sugar 最快捷、最简单的方法是通过运行安装脚本下载预构建的二进制文件，适用于 macOS、Linux 和 WSL（Windows 子系统 Linux）。对于 Windows 系统，请参见下面的 📌。

在终端中运行以下命令：

```bash
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

{% callout %}

系统会询问您要使用哪个版本。V1.x 用于 Candy Machine v2，V2.x 用于 Candy Machine v3。**我们建议使用最新版本**。

该脚本将把二进制文件安装到您的机器上，并将其添加到您的 `PATH`。对 `PATH` 变量的修改可能在重启终端之前不会生效。按照安装脚本的说明查看是否需要重启终端。

{% /callout %}

{% totem %}
{% totem-accordion title="📌 Windows 系统说明" %}

如果您使用的是 Windows，请按照以下步骤操作：

1. 从[此处](https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe)下载 Winstaller 可执行文件。

2. 尝试双击运行二进制文件。如果您收到关于不受信任的二进制文件的弹出消息警告，请尝试点击 `更多信息`，然后选择 `仍然运行`。如果您没有此选项，请按照步骤 3 - 6 操作。

3. 右键单击可执行文件并转到 `属性`。

   ![Properties.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Properties.png)

4. 如果您信任 Metaplex 开发团队，请勾选如下图所示的 `解除锁定` 按钮。这将允许您在计算机上运行此二进制文件，因为 Microsoft 不会自动信任它。

   ![Unblock.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Unblock.png)

5. 点击 `应用` 和 `确定`。

6. 双击可执行文件，它将打开终端并开始安装 Sugar。

7. 如果一切成功完成，您将收到一条相应的消息。

   ![windows installed](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/installed.png)

8. 尝试在终端中运行 `sugar`，看看它是否打印出可以使用的命令列表。如果是，您就可以开始了！

9. 向 [Metaplex Discord](https://discord.gg/metaplex) 的 `#candy-machine` 论坛报告任何错误。

{% callout %}

此安装程序二进制文件下载最新的 Sugar 二进制版本，解压缩它并将其复制到您的 `PATH` 环境中的文件夹。如果您有 Rust，二进制文件将被复制到 `~/.cargo/bin`，否则它会在您的 `%LOCALAPPDATA%` 目录中创建一个 `SugarCLI` 文件夹。一旦二进制文件在该位置，Windows 将自动找到它，您将能够从文件系统中的任何目录作为普通命令行应用程序运行 sugar 二进制文件。

{% /callout %}

{% /totem-accordion %}
{% /totem %}

## 二进制文件

支持的操作系统的二进制文件可以在以下位置找到：

- [Sugar 发布页面](https://github.com/metaplex-foundation/sugar/releases)

## 其他安装方法

{% callout %}

从 crates.io 安装或在 Ubuntu 或 WSL（Windows 子系统 Linux）上从源代码安装时，您可能需要安装一些额外的依赖项：

```bash
sudo apt install libudev-dev pkg-config unzip
```

{% /callout %}

### Crates.io

要从 Crates.io 安装 sugar，您需要在系统上安装 [Rust](https://www.rust-lang.org/tools/install)。建议使用 `rustup` 安装 Rust：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后，运行：

```bash
rustc --version
```

应该打印出 Rust 编译器的版本。如果命令失败，请检查 `~/.cargo/bin` 目录是否在您的 `PATH` 环境变量中。

下一步是从 Crates.io 安装 Sugar：

```bash
cargo install sugar-cli
```

这将从 Crates.io 下载 Sugar 代码并自动为您安装。

### 从源代码构建

要从源代码构建 Sugar，您需要在系统上安装 [Rust](https://www.rust-lang.org/tools/install)。建议使用 `rustup` 安装 Rust：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后，运行：

```bash
rustc --version
```

应该打印出 Rust 编译器的版本。如果命令失败，请检查 `~/.cargo/bin` 目录是否在您的 `PATH` 环境变量中。

下一步是克隆 Sugar 仓库：

```bash
git clone https://github.com/metaplex-foundation/sugar.git
```

这将创建一个包含仓库最新代码的 `sugar` 目录。切换到新创建的目录：

```bash
cd sugar
```

然后，您可以构建并将二进制文件安装到 `~/.cargo/bin`：

```bash
cargo install --path ./
```

只要 `./cargo/bin` 在您的 `PATH` 环境变量中，您就能够从文件系统中的任何目录执行 `sugar`。

{% callout %}

您需要从 Sugar 源代码根目录——即 `Cargo.toml` 所在的目录——执行 `cargo install`。

{% /callout %}
