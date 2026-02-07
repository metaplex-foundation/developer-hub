---
title: 独自アップローダーの持ち込み
metaTitle: 独自アップローダーの持ち込み | Sugar
description: Sugarに独自のアップローダーを持ち込む方法。
---

Sugarは拡張可能なアーキテクチャを持ち、最小限の労力で新しいアップロード方法の実装を簡単に可能にします。アップロードロジックは`upload`コマンドから分離されており、Rustトレイトを実装することで新しい方法をアップロードフローにプラグインでき、*自由形式*と並列アップロード方法の両方をサポートします：

- `Uploader`: このトレイトは、アップロードの実行方法を完全に制御する必要があるアップロード方法によって直接実装される必要があります。
- `ParallelUploader`: このトレイトはスレッドロジックを抽象化し、方法が単一アセット（ファイル）のアップロードロジックに集中できるようにします。

異なるトレイトの使用は、以下のアップロードアーキテクチャの概要で説明されています：

![Uploader architecture](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/UploaderOverview.png)

アップローダーを実装するために、最初のステップはアップロードプロセスの完全な制御が必要か、あなたの方法が並列アップロードをサポートするかを決定することです。これにより、実装するトレイトが決まります。実装するトレイトに関係なく、アップロードが必要なアセット（ファイル）は`AssetInfo`構造体で表現されます：

```rust
pub struct AssetInfo {
    /// Id of the asset in the cache.
    pub asset_id: String,
    /// Name (file name) of the asset.
    pub name: String,
    /// Content of the asset - either a file path or the string
    /// representation of its content.
    pub content: String,
    /// Type of the asset.
    pub data_type: DataType,
    /// MIME content type.
    pub content_type: String,
}
```

`AssetInfo`は物理ファイルを表現でき、その場合`content`はファイルの名前に対応します；またはメモリ内アセットを表現でき、その場合`content`はアセットの内容に対応します。

例えば、画像ファイルの場合、`content`はファイルシステム上のファイルのパスを含みます。jsonメタデータファイルの場合、`content`にはjsonメタデータの文字列表現が含まれます。

## トレイト

> トレイト実装の詳細は、Sugarの[ソースコード](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs)で見つけることができます。

### Uploader

`Uploader`トレイトは、アセット（ファイル）のアップロード方法を完全に制御できます。単一の関数を定義します：

```rust
async fn upload(
    &self,
    sugar_config: &SugarConfig,
    cache: &mut Cache,
    data_type: DataType,
    assets: &mut Vec<AssetInfo>,
    progress: &ProgressBar,
    interrupted: Arc<AtomicBool>,
) -> Result<Vec<UploadError>>;
```

ここで：

* `sugar_config` - 現在のSugar設定
* `cache` - アセットキャッシュオブジェクト（変更可能）
* `data_type` - アップロードされるアセットのタイプ
* `assets` - アップロードするアセットのベクター（変更可能）
* `progress` - コンソールにフィードバックを提供するプログレスバーへの参照
* `interrupted` - 通知を受信するための共有中断ハンドラーフラグへの参照

この関数は、各タイプのアセットを個別にアップロードするために呼び出されます&mdash;例：画像用に一度、メタデータ用に一度、存在する場合はアニメーションアセット用に一度。アセットをアップロードした後、その情報は`cache`オブジェクトで更新され、`sync_file`関数を使用してキャッシュをファイルシステムに保存する必要があります。大きなコレクションの場合、キャッシュをファイルシステムに同期するのは遅くなる可能性があるため、アップロードプロセスの遅延を避けるために実用的な頻度で行い、同時にユーザーがアップロードを中止した場合の情報損失の可能性を最小限に抑える必要があります。

実装は、ユーザーが`Ctrl+C`を押してアップロードプロセスを中止するタイミングを制御するために`interrupted`パラメータを使用することが期待されています&mdash;これは大きなアップロードに有用です。キャッシュに保存された情報は再アップロードされません。`upload`コマンドは既にアップロードされたアセットをフィルターアウトし、アセットのベクターには含まれません。`progress`はコンソールに表示されるプログレスバーへの参照であり、`1`つのアセットがアップロードされたことを示すために`progress.inc(1)`関数を呼び出してアップロードの進行状況の視覚的フィードバックを提供するために使用される必要があります。

すべてのファイルが正常にアップロードされると、`upload`メソッドは空の`Vec`を返します；エラーの場合、`Vec`にはユーザーに表示される`UploadError`のリストが含まれます。

### ParallelUploader

`ParallelUpload`は、同時アップロードをサポートするために`Uploader`トレイトの`upload`関数のスレッド対応実装を提供し、スレッドロジックを抽象化して単一アセット（ファイル）のアップロードロジックに集中します。したがって、アセットを並列にアップロードできる方法は、簡略化された`upload_asset`関数を実装する必要があります：

```rust
fn upload_asset(
    &self,
    asset: AssetInfo
) -> JoinHandle<Result<(String, String)>>;
```

`upload_asset`関数は`JoinHandle`オブジェクトを返す必要があります。ほとんどの場合、この関数は`tokio::spawn`からの値を返します。この関数にはアセットをアップロードするロジックのみを含める必要があります&mdash;中断制御とキャッシュ同期は`ParallelUpload`トレイトによって自動的に行われます。

### Prepare

すべてのアップロード方法は、追加のトレイト`Prepare`を実装する必要があります。その理由は、指定されたメディア/メタデータファイルのアップロード用にメソッドを準備することです。例：
- ファイルがサイズ制限を超えていないかチェック；
- アップロード用のストレージ容量があるかチェック；
- アップロード用の資金をチェック/追加。

このトレイトは単一の関数を定義します：

```rust
async fn prepare(
    &self,
    sugar_config: &SugarConfig,
    asset_pairs: &HashMap<isize, AssetPair>,
    asset_indices: Vec<(DataType, &[isize])>,
) -> Result<()>;
```
ここで：
* `sugar_config` - 現在のSugar設定
* `asset_pairs` - `index`から`AssetPair`へのマッピング
* `asset_indices` - アップロードされるアセットペアインデックスの情報を含むベクター、タイプ別にグループ化

`asset_pairs`にはアセットの完全な情報が含まれていますが、`asset_indices`で指定されたアセットのみがアップロードされます&mdash;例：インデックス`1`が`DataType::Image`インデックス配列にのみ存在する場合、アセット`1`の画像のみがアップロードされます。

## 設定

アップロード方法のロジックを実装した後、あなたの方法をSugarの設定ファイルに統合する必要があります。まず、アップロード方法を識別するために`UploadMethod` [enum](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L220-L231)に新しい値を追加する必要があります。次に、設定ファイルで指定されたときに`Uploader`オブジェクトを作成するために`initialize` [ファクトリーメソッド](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs#L274-L296)を変更する必要があります。

アップロード方法が追加のパラメータを必要とする場合、`ConfigData` [struct](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L30-L86)を変更する必要があります。例えば、`aws`アップロード方法では、ユーザーがアップロード用のバケット名を指定する必要があります。`ConfigData`構造体には`aws_s3_bucket`フィールドがあり、これは設定ファイルの`awsS3Bucket`プロパティに対応します。

アップロード方法トレイト実装を完了し、その詳細をSugarの設定ファイルに追加すると、アセットのアップロードに使用する準備が整います。

{% callout %}

実装をSugarのコードベースに追加するために、SugarのリポジトリにPRを提出することを忘れないでください。

{% /callout %}

## 次のステップ

Sugarには現在6つの[アップロード方法](https://github.com/metaplex-foundation/sugar/tree/main/src/upload/methods)があります&mdash;アセットのアップロードの動作方法と独自のアップロード方法を実装するためのデザインアイデアの詳細については、そのソースコードを確認してください。
