---
title: 入门指南
metaTitle: 入门指南 | Sugar
description: Sugar 入门指南。
---

首先，检查您的系统上是否安装了 Sugar：

```bash
sugar --version
```

上述命令应该打印 Sugar 版本——例如 `sugar-cli 2.5.0`。

默认情况下，Sugar 使用 `solana-cli` 的密钥对和 RPC 设置。您可以通过运行以下命令检查当前设置：

```bash
solana config get
```

您可以通过运行以下命令设置不同的设置：

```bash
solana config set --url <rpc url> --keypair <path to keypair file>
```

{% callout %}

Sugar 不需要在系统上安装 `solana-cli`。Sugar 中的每个命令都接受 `-k`（密钥对）和 `-r`（RPC）标志来配置要使用的值。

{% /callout %}

## 准备您的文件

为您的项目创建一个文件夹，并在其中创建一个名为 `assets` 的文件夹来存储您的 json 元数据和图像文件对，命名约定为 `0.json`、`0.png`、`1.json`、`1.png`，依此类推。元数据扩展名为 `.json`，图像文件可以是 `.png`、`.gif`、`.jpg` 和 `.jpeg`。此外，您还需要 `collection.json` 和 `collection.png` 文件，包含您的 collection NFT 的信息。

您的项目目录将如下所示：
{% diagram %}
{% node %}
{% node #my-project label="my-project/" theme="blue" /%}
{% /node %}

{% node parent="my-project" y="50" x="100" %}
{% node #assets label="assets/" theme="indigo" /%}
{% /node %}

{% node #0-json parent="assets" y="50" x="100" label="0.json" theme="mint" /%}
{% node #0-png parent="assets" y="95" x="100" label="0.png" theme="mint" /%}
{% node #1-json parent="assets" y="140" x="100" label="1.json" theme="orange" /%}
{% node #1-png parent="assets" y="185" x="100" label="1.png" theme="orange" /%}
{% node #2-json parent="assets" y="230" x="100" label="2.json" theme="mint" /%}
{% node #2-png parent="assets" y="275" x="100" label="2.png" theme="mint" /%}
{% node #more parent="assets" y="320" x="100" label=". . ." theme="orange" /%}
{% node #collection-json parent="assets" y="365" x="100" label="collection.json" theme="purple" /%}
{% node #collection-png parent="assets" y="410" x="100" label="collection.png" theme="purple" /%}

{% edge from="my-project" to="assets" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="0-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="1-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="2-png" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="more" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-json" fromPosition="bottom" toPosition="left" /%}
{% edge from="assets" to="collection-png" fromPosition="bottom" toPosition="left" /%}
{% /diagram %}

## 运行 Sugar

在您的项目目录中，使用 `launch` 命令启动创建配置文件和将 Candy Machine 部署到 Solana 的交互式流程：

```bash
sugar launch
```

在 launch 命令执行结束时，Candy Machine 将被部署到链上。您可以使用 `mint` 命令铸造 NFT：

```bash
sugar mint
```

当所有 NFT 都被铸造后，您可以关闭 Candy Machine 并收回账户租金：

```bash
sugar withdraw
```

{% callout %}

即使 Candy Machine 不为空，`withdraw` 命令也会关闭它，因此请谨慎使用。

{% /callout %}
