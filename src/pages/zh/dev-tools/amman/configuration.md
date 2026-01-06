---
title: 配置
metaTitle: Amman 配置指南 | Metaplex 开发者工具
description: 配置 Amman 本地验证器工具包。
---

执行时,Amman 将在项目根目录中查找配置文件 `.ammanrc.js`。如果此文件不存在,Amman 将使用默认配置加载。

配置应该是一个 JavaScript 模块,导出带有以下任何属性的 'validator':

- **killRunningValidators**: 如果为 true,将终止系统上当前运行的任何 solana-test-validators。
- **programs**: 应加载到测试验证器中的 bpf 程序
- **accountsCluster**: 克隆远程帐户的默认集群
- **accounts**: 要加载到测试验证器的远程帐户数组
- **jsonRpcUrl**: 测试验证器应监听 JSON RPC 请求的 URL
- **websocketUrl**: RPC websocket 的 URL
- **ledgerDir**: solana 测试验证器写入账本的位置
- **resetLedger**: 如果为 true,则在启动时将账本重置为创世状态
- **verifyFees**: 如果为 true,则在验证器收取交易费用之前,不认为验证器已完全启动

## 示例配置

### 使用默认值的验证器/中继/存储配置

下面是一个示例配置,所有值都设置为默认值,除了添加的程序以及 `relay` 和 `storage` 配置。

除非在 _CI_ 环境中运行,否则会自动使用验证器启动 _amman-explorer 中继_,如果中继已在已知的 _中继端口_ 上运行,它将首先被终止。

仅在提供 `storage` 配置时才会启动 _模拟存储_。如果存储服务器已在已知的 _存储端口_ 上运行,它将首先被终止。

```js
import { LOCALHOST, tmpLedgerDir } from '@metaplex-foundation/amman'

module.exports = {
  validator: {
    killRunningValidators: true,
    programs: [
      {
        label: 'Token Metadata Program',
        programId: programIds.metadata,
        deployPath: localDeployPath('mpl_token_metadata'),
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
    detached: process.env.CI != null,
  },
  relay: {
    enabled: process.env.CI == null,
    killRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: 'mock-storage',
    clearOnStart: true,
  },
}
```

### 使用远程帐户和程序的配置

Amman 可以从您选择的集群中拉取帐户和程序,用于本地使用和测试。

```js
module.exports = {
  validator: {
    // 默认情况下,Amman 将从 accountsCluster 拉取帐户数据(可以在每个帐户基础上覆盖)
    accountsCluster: 'https://api.metaplex.solana.com',
    accounts: [
      {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        // 将 executable 标记为 true 将导致 Amman 自动拉取可执行数据帐户
        executable: true,
      },
      {
        label: 'Random other account',
        accountId: '4VLgNs1jXgdciSidxcaLKfrR9WjATkj6vmTm5yCwNwui',
        // 默认情况下 executable 为 false,不需要在配置中
        // executable: false,

        // 在此处提供集群将覆盖 accountsCluster 字段
        cluster: 'https://metaplex.devnet.rpcpool.com',
      },
    ],
  },
}
```

### 停用测试验证器功能

对于像 _devnet_ 这样的不同集群,某些功能是禁用的。默认情况下,本地运行的 solana-test-validator 不会禁用任何功能,因此其行为与提供的集群不同。

为了在更接近特定集群运行方式的场景中运行测试,您可以通过 _matchFeatures_ 配置属性匹配其功能:

```js
module.exports = {
  validator: {
    ...
    // 下面禁用了为 `mainnet-beta` 集群停用的任何功能
    matchFeatures: 'mainnet-beta',
  }
}
```

如果您想显式禁用一组功能,可以通过 _deactivateFeatures_ 属性执行此操作:

```js
module.exports = {
  validator: {
    ...
   deactivateFeatures: ['21AWDosvp3pBamFW91KB35pNoaoZVTM7ess8nr2nt53B'],
  }
}
```

**注意**: 只能设置上述属性之一

#### 资源

- [测试验证器运行时功能](https://docs.solana.com/developing/test-validator#appendix-ii-runtime-features)
- [运行时新功能](https://docs.solana.com/developing/programming-model/runtime#new-features)
