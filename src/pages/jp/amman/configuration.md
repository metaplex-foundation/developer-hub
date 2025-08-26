---
title: 設定
metaTitle: 設定 | Amman
description: Ammanローカルバリデータツールキットの設定。
---

実行時、Ammanはプロジェクトルートで設定ファイル`.ammanrc.js`を探します。このファイルが存在しない場合、Ammanはデフォルト設定でロードします。

設定は、以下のプロパティのいずれかを持つ'validator'をエクスポートするJavaScriptモジュールである必要があります：

- **killRunningValidators**: trueの場合、システム上で現在実行中のsolana-test-validatorを終了します。
- **programs**: テストバリデータにロードする必要があるBPFプログラム
- **accountsCluster**: リモートアカウントをクローンするデフォルトクラスター
- **accounts**: テストバリデータにロードするリモートアカウントの配列
- **jsonRpcUrl**: テストバリデータがJSON RPCリクエストをリッスンするURL
- **websocketUrl**: RPC WebSocket用
- **ledgerDir**: solanaテストバリデータが台帳を書き込む場所
- **resetLedger**: trueの場合、台帳は起動時にジェネシスにリセットされます
- **verifyFees**: trueの場合、バリデータはトランザクション手数料を請求するまで完全に起動されたとはみなされません

## 設定例

### デフォルトを含むバリデータ/リレー/ストレージ設定

以下は、追加されたプログラムと`relay`および`storage`設定を除いて、すべての値をデフォルトに設定した設定例です。

_amman-explorerリレー_は、_CI_環境で実行されていない限り、バリデータと共に自動的に起動され、既知の_リレーポート_でリレーが既に実行中の場合は、まず終了されます。

_モックストレージ_は、`storage`設定が提供された場合にのみ起動されます。既知の_ストレージポート_でストレージサーバーが既に実行中の場合は、まず終了されます。

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

### リモートアカウントとプログラムを含む設定

Ammanは、お好みのクラスターからローカル使用とテスト用にアカウントとプログラムの両方を取得できます。

```js
module.exports = {
  validator: {
    // デフォルトでは、Ammanはaccounts Clusterからアカウントデータを取得します（アカウント単位で上書き可能）
    accountsCluster: 'https://api.metaplex.solana.com',
    accounts: [
      {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        // executableをtrueとしてマークすると、Ammanは実行可能なデータアカウントも自動的に取得します
        executable: true,
      },
      {
        label: 'Random other account',
        accountId: '4VLgNs1jXgdciSidxcaLKfrR9WjATkj6vmTm5yCwNwui',
        // デフォルトでexecutableはfalseで、設定に含める必要はありません
        // executable: false,

        // ここでクラスターを提供すると、accountsClusterフィールドを上書きします
        cluster: 'https://metaplex.devnet.rpcpool.com',
      },
    ],
  },
}
```

### テストバリデータ機能の非アクティブ化

_devnet_のような異なるクラスターでは、一部の機能が無効になっています。デフォルトでは、ローカルで実行されるsolana-test-validatorは機能を無効にしないため、提供されるクラスターとは異なる動作をします。

特定のクラスターに対して実行される方法により近いシナリオでテストを実行するために、_matchFeatures_設定プロパティを介してその機能を一致させることができます：

```js
module.exports = {
  validator: {
    ...
    // 以下は`mainnet-beta`クラスターに対して非アクティブ化された機能を無効にします
    matchFeatures: 'mainnet-beta',
  }
}
```

機能のセットを明示的に無効にしたい場合は、_deactivateFeatures_プロパティを使用できます：

```js
module.exports = {
  validator: {
    ...
   deactivateFeatures: ['21AWDosvp3pBamFW91KB35pNoaoZVTM7ess8nr2nt53B'],
  }
}
```

**注意**: 上記のプロパティのうち1つのみを設定できます

#### リソース

- [テストバリデータランタイム機能](https://docs.solana.com/developing/test-validator#appendix-ii-runtime-features)
- [ランタイム新機能](https://docs.solana.com/developing/programming-model/runtime#new-features)