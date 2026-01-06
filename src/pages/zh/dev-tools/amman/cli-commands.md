---
title: CLI 命令
metaTitle: CLI 命令 | Amman
description: Metaplex Amman 本地验证器工具包的 CLI 命令。
---

```sh
amman [command]

Commands:
  amman start    启动 solana-test-validator 以及 amman 中继和/或
                 模拟存储(如果已配置)
  amman stop     停止中继和存储,并终止正在运行的 solana
                 测试验证器
  amman logs     启动 'solana logs' 并通过美化器传输它们
  amman airdrop  向支付者空投提供的 Sol
  amman label    为帐户或交易添加标签到 amman
  amman account  检索 PublicKey 或标签的帐户信息,或
                 显示所有标记的帐户
  amman run      在扩展所有地址标签后执行提供的命令

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

## 运行命令

```sh
npx amman start <config.js>
```

如果没有提供 `config.js`,_amman_ 将在当前目录中查找 `.ammanrc.js` 文件。
如果也找不到,它将使用默认配置。

如果您已将 Amman 添加到您的 package.json 脚本中,您可以使用您选择的包安装器运行 Amman。

```sh
// npm
npm run amman:start

// yarn
yarn amman:start

// pnpm
pnpm run amman:start
```
