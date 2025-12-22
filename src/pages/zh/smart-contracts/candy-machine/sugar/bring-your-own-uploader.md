---
title: 自定义上传器
metaTitle: 自定义上传器 | Sugar
description: 如何在 Sugar 中使用自定义上传器。
---

Sugar 具有可扩展的架构，可以轻松实现新的上传方法，只需最少的工作量。上传逻辑与 `upload` 命令解耦，新方法可以通过实现 Rust trait 插入上传流程，支持*自由形式*和并行上传方法：

- `Uploader`：此 trait 应由需要完全控制上传执行方式的上传方法直接实现。
- `ParallelUploader`：此 trait 抽象了线程逻辑，允许方法专注于上传单个资产（文件）的逻辑。

不同 trait 的使用在下面的上传架构概述中说明：

![Uploader architecture](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/UploaderOverview.png)

要实现您的上传器，第一步是决定您是否需要完全控制上传过程，或者您的方法是否支持并行上传。这将决定要实现哪个 trait。无论您实现哪个 trait，需要上传的资产（文件）都由 `AssetInfo` 结构表示：

```rust
pub struct AssetInfo {
    /// 缓存中资产的 Id。
    pub asset_id: String,
    /// 资产的名称（文件名）。
    pub name: String,
    /// 资产的内容 - 文件路径或其内容的字符串表示。
    pub content: String,
    /// 资产的类型。
    pub data_type: DataType,
    /// MIME 内容类型。
    pub content_type: String,
}
```

`AssetInfo` 可以表示物理文件，在这种情况下 `content` 将对应于文件名；或内存中的资产，在这种情况下 `content` 将对应于资产的内容。

例如，对于图像文件，`content` 包含文件系统上文件的路径。对于 json 元数据文件，`content` 包含 json 元数据的字符串表示。

## Traits

> 有关 trait 实现的更多详细信息，请参阅 Sugar 的[源代码](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs)。

### Uploader

`Uploader` trait 让您完全控制资产（文件）的上传方式。它定义了一个函数：

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

其中：

* `sugar_config` - 当前 sugar 配置
* `cache` - 资产缓存对象（可变）
* `data_type` - 正在上传的资产类型
* `assets` - 要上传的资产向量（可变）
* `progress` - 进度条的引用，用于向控制台提供反馈
* `interrupted` - 共享中断处理程序标志的引用，用于接收通知

此函数将被调用以分别上传每种类型的资产——例如，一次用于您的图像，一次用于您的元数据，如果存在的话，一次用于您的动画资产。上传资产后，需要在 `cache` 对象中更新其信息，并使用 `sync_file` 函数将缓存保存到文件系统。将缓存同步到文件系统对于大型集合可能很慢，因此应该尽可能频繁地进行，以避免减慢上传过程，同时最大限度地减少用户中止上传时信息丢失的可能性。

实现应使用 `interrupted` 参数来控制用户何时通过按 `Ctrl+C` 中止上传过程——这对于大型上传很有用。保存在缓存中的任何信息都不会被重新上传。`upload` 命令将过滤掉已上传的资产，它们不会包含在资产向量中。`progress` 是控制台上显示的进度条的引用，应该用于通过调用其 `progress.inc(1)` 函数来提供上传进度的视觉反馈，以指示已上传 `1` 个资产。

当所有文件成功上传时，`upload` 方法将返回一个空的 `Vec`；如果出错，`Vec` 将包含一个 `UploadError` 列表，将显示给用户。

### ParallelUploader

`ParallelUpload` 提供了 `Uploader` trait 的 `upload` 函数的线程启用实现，以支持并发上传，抽象线程逻辑以专注于上传单个资产（文件）的逻辑。因此，可以并行上传资产的方法需要实现一个简化的 `upload_asset` 函数：

```rust
fn upload_asset(
    &self,
    asset: AssetInfo
) -> JoinHandle<Result<(String, String)>>;
```

`upload_asset` 函数必须返回一个 `JoinHandle` 对象。在大多数情况下，该函数将返回 `tokio::spawn` 的值。此函数应该只包含上传资产的逻辑——中断控制和缓存同步由 `ParallelUpload` trait 自动完成。

### Prepare

所有上传方法都需要实现额外的 `Prepare` trait。其基本原理是为上传指定的媒体/元数据文件准备方法，例如：
- 检查是否有文件超过大小限制；
- 检查是否有足够的存储空间进行上传；
- 检查/添加上传资金。

该 trait 定义了一个函数：

```rust
async fn prepare(
    &self,
    sugar_config: &SugarConfig,
    asset_pairs: &HashMap<isize, AssetPair>,
    asset_indices: Vec<(DataType, &[isize])>,
) -> Result<()>;
```
其中：
* `sugar_config` - 当前 sugar 配置
* `asset_pairs` - `index` 到 `AssetPair` 的映射
* `asset_indices` - 包含将要上传的资产对索引信息的向量，按类型分组。

`asset_pairs` 包含资产的完整信息，但只有 `asset_indices` 中指定的资产才会被上传——例如，如果索引 `1` 仅出现在 `DataType::Image` 索引数组中，则只会上传资产 `1` 的图像。

## 配置

在实现上传方法的逻辑后，您需要将您的方法集成到 Sugar 的配置文件中。首先，您需要向 `UploadMethod` [枚举](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L220-L231)添加一个新值来标识您的上传方法。其次，您需要修改 `initialize` [工厂方法](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs#L274-L296)，以在配置文件中指定时创建 `Uploader` 对象。

如果您的上传方法需要额外的参数，您需要修改 `ConfigData` [结构](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L30-L86)。例如，`aws` 上传方法要求用户指定上传的存储桶名称。在 `ConfigData` 结构中，您会找到一个 `aws_s3_bucket` 字段，它对应于配置文件中的 `awsS3Bucket` 属性。

完成上传方法 trait 实现并将其详细信息添加到 Sugar 的配置文件后，就可以使用它来上传资产了。

{% callout %}

不要忘记向 Sugar 的仓库提交 PR，以将您的实现添加到 Sugar 的代码库中。

{% /callout %}

## 后续步骤

Sugar 目前有六种[上传方法](https://github.com/metaplex-foundation/sugar/tree/main/src/upload/methods)可用——查看它们的源代码以了解有关资产上传如何工作的更多详细信息，以及实现您自己的上传方法的设计思路。
