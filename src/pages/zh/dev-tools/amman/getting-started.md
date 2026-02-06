---
title: 开始使用
metaTitle: 开始使用 | Amman
description: Metaplex Amman 本地验证器工具包的安装和设置。
---

## 前置条件

在运行 Amman 之前,您的系统需要安装一些东西。

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solanalabs.com/cli/install)
- [NodeJs](https://nodejs.org/en/download)

## 安装

在初始化新项目或打开现有项目后,您可以通过包管理器安装 Amman。

```js
npm i @metaplex-foundation/amman
```

## 添加到脚本(可选)

为了便于使用,您可能希望将 Amman 的执行添加到您的 package.json 脚本中。

{% dialect-switcher title="package.json" %}
{% dialect title="JavaScript" id="js" %}

```js
"scripts": {
    ...
    "amman:start": "npx amman start"
  },
```

{% /dialect %}
{% /dialect-switcher %}
