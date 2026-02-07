---
title: upload
metaTitle: upload | Sugar
description: upload 命令。
---

`upload` 命令将资产上传到指定的存储并为 Candy Machine 创建缓存文件。

您可以使用以下命令使用默认资产文件夹位置（例如当前目录中的 `assets` 文件夹）上传所有资产：

```
sugar upload
```

或者，您可以指定不同的文件夹：

```
sugar upload <ASSETS DIR>
```

{% callout %}

`upload` 命令可以在上传未成功完成的任何时候恢复（重新运行）——只处理尚未上传的文件。它还会自动检测媒体/元数据文件内容何时更改并重新上传它们，相应地更新缓存文件。换句话说，如果您需要更改文件，只需将新（修改后的）文件复制到资产文件夹并重新运行 upload 命令即可。无需手动编辑缓存文件。

{% /callout %}

## 示例图像和元数据

要获取 Candy Machine 的示例图像和元数据，请访问我们的 GitHub 仓库，点击绿色的 `code` 按钮并选择 `Download ZIP` 来下载 zip 文件。

[Example Candy Machine Assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

如果您安装了 Git，也可以将仓库克隆到您的系统或使用以下命令下载 zip 副本：

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```
