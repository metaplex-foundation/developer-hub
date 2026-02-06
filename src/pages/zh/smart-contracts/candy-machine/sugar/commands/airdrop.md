---
title: airdrop
metaTitle: airdrop | Sugar
description: 使用 Sugar 空投 (p)NFT 的命令。
---

## 使用方法

`airdrop` 命令从命令行将 NFT 从 Candy Machine 铸造到钱包列表。

它需要一个文件，默认名为 `airdrop_list.json`，其中包含钱包公钥以及每个钱包应收到的 NFT 数量。在以下示例中，`address1` 将收到 2 个 NFT，`address2` 将收到 7 个。文件格式应如下：

```json
{
"address1": 2,
"address2": 7
}
```

完成后，您将找到一个 `airdrop_results.json` 文件，其中包含空投结果和可能的问题。

{% callout %}

如果启用了守卫，则无法使用 airdrop 命令。

{% /callout %}

使用默认的 `cache.json` 和 `airdrop_list.json` 时，可以使用以下命令启动空投：

```
sugar airdrop
```

否则，使用 `--airdrop-list` 指定您的 airdrop_list 文件：

```
sugar airdrop --airdrop-list <AIRDROP_LIST>
```

默认情况下，sugar 将使用默认缓存文件 `cache.json`。您也可以使用 `--cache` 覆盖缓存文件名：

```
sugar mint --cache <CACHE>
```

您还可以使用 `--candy-machine` 告诉 sugar 使用特定的 candy machine：

```
sugar mint --candy-machine <CANDY_MACHINE>
```

## 重新运行命令

在某些情况下，铸造会失败，例如因为找不到区块哈希或类似的 RPC/网络相关原因。空投结果将保存在 `airdrop_results.json` 中。重新运行命令时，将比较空投列表和空投结果。

注意：在某些情况下，您会看到交易在超时前无法确认。在这些情况下，您应该在浏览器等工具上确认 NFT 是否已铸造。
