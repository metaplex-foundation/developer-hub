---
title: 使用Inscriptions CLI开始
metaTitle: CLI | Inscription
description: 使用Inscriptions CLI开始
---

## 设置您的工作空间

克隆[mpl-inscription仓库](https://github.com/metaplex-foundation/mpl-inscription/)。

```bash
git clone https://github.com/metaplex-foundation/mpl-inscription.git
```

CLI位于仓库的`clients/cli`子目录中。必须先安装依赖项才能运行。

```bash
pnpm install
```

之后可以使用以下命令调用批量铭刻。可选的命令会标明。

## 下载NFT

此命令用于初始化将要铭刻的资产。下载过程将在运行目录中创建缓存文件夹，并在其中存储与NFT关联的JSON（.json）和媒体（.png、.jpg、.jpeg）文件，以及一个.metadata文件，该文件存储其他CLI命令的数据。每个文件的名称将是正在铭刻的NFT的mint地址。

如果您希望手动覆盖要铭刻的任何JSON或媒体文件，请将缓存目录中的相关文件替换为您想要铭刻的文件。

{% dialect-switcher title="下载您的NFT资产。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli download hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 估算成本（可选）

可以使用此命令确定铭刻NFT的总成本。它根据账户开销和缓存目录中的文件大小计算铭刻NFT的SOL租金成本。

{% dialect-switcher title="估算NFT Inscription总成本。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli cost hashlist -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 修剪JSON字段（可选）

此命令可用于从与NFT关联的.json文件中修剪JSON字段。通常NFT JSON数据包含已弃用的字段，可以在铭刻过程中删除以节省成本。例如，'seller_fee_basis_points'、'creators'和'collection'字段都是JSON数据中已弃用的字段，可以删除以节省租金成本。此外，描述字段通常很长，创作者可能希望删除此字段以节省成本。如果未提供`--remove`选项，默认要删除的字段是'symbol'、'description'、'seller_fee_basis_points'和'collection'。

{% dialect-switcher title="修剪JSON字段。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress json --fields symbol
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 压缩图像（可选）

CLI还提供在铭刻前压缩图像的能力，以进一步节省租金成本。它们可以在三个指标上压缩：

- 质量（数字1-100，默认：80）（仅适用于jpeg）降低图像的整体清晰度和可用颜色。
- 大小（数字1-100，默认：100）- 减小总图像大小，数字越小图像越小。
- 扩展名（png或jpg，默认：jpg）- 将图像更改为指定的文件类型，jpeg通常比png更小（但有损）。

{% dialect-switcher title="压缩图像。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress images -q <QUALITY> -s <SIZE> -e <EXTENSION>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铭刻！

{% dialect-switcher title="下载您的NFT资产。" %}
{% dialect title="Bash (Hashlist)" id="bash" %}
{% totem %}

```bash
pnpm cli inscribe hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
