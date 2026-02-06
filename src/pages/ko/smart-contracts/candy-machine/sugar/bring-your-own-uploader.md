---
title: 자체 업로더 가져오기
metaTitle: 자체 업로더 가져오기 | Sugar
description: Sugar에 자체 업로더를 가져오는 방법.
---

Sugar는 최소한의 노력으로 새로운 업로드 방법을 쉽게 구현할 수 있는 확장 가능한 아키텍처를 가지고 있습니다. 업로드 로직은 `upload` 명령어와 분리되어 있으며, Rust trait을 구현하여 새로운 방법을 업로드 플로우에 플러그인할 수 있습니다. *자유 형식* 및 병렬 업로드 방법을 모두 지원합니다:

- `Uploader`: 이 trait은 업로드 수행 방법에 대한 완전한 제어가 필요한 업로드 방법에서 직접 구현해야 합니다.
- `ParallelUploader`: 이 trait은 스레딩 로직을 추상화하여 단일 자산(파일) 업로드 로직에 집중할 수 있도록 합니다.

다양한 trait의 사용은 아래의 업로드 아키텍처 개요에 설명되어 있습니다:

![Uploader architecture](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/UploaderOverview.png)

업로더를 구현하려면, 먼저 업로드 프로세스에 대한 완전한 제어가 필요한지 또는 방법이 병렬 업로드를 지원하는지 결정해야 합니다. 이것이 구현할 trait을 결정합니다. 구현하는 trait과 관계없이 업로드가 필요한 자산(파일)은 `AssetInfo` 구조체로 표현됩니다:

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

`AssetInfo`는 물리적 파일을 나타낼 수 있으며, 이 경우 `content`는 파일 이름에 해당합니다. 또는 메모리 내 자산을 나타낼 수 있으며, 이 경우 `content`는 자산의 콘텐츠에 해당합니다.

예를 들어, 이미지 파일의 경우 `content`에는 파일 시스템의 파일 경로가 포함됩니다. json 메타데이터 파일의 경우 `content`에는 json 메타데이터의 문자열 표현이 포함됩니다.

## Traits

> trait 구현에 대한 자세한 내용은 Sugar의 [소스 코드](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs)에서 확인할 수 있습니다.

### Uploader

`Uploader` trait은 자산(파일)이 업로드되는 방법에 대한 완전한 제어권을 제공합니다. 단일 함수를 정의합니다:

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

여기서:

- `sugar_config` - 현재 sugar 구성
- `cache` - 자산 캐시 객체 (변경 가능)
- `data_type` - 업로드되는 자산의 유형
- `assets` - 업로드할 자산의 벡터 (변경 가능)
- `progress` - 콘솔에 피드백을 제공하기 위한 진행률 표시줄 참조
- `interrupted` - 알림을 받기 위한 공유 중단 핸들러 플래그 참조

이 함수는 각 유형의 자산을 개별적으로 업로드하기 위해 호출됩니다&mdash;예: 이미지에 대해 한 번, 메타데이터에 대해 한 번, 애니메이션 자산이 있는 경우 한 번. 자산을 업로드한 후 해당 정보를 `cache` 객체에 업데이트하고 `sync_file` 함수를 사용하여 캐시를 파일 시스템에 저장해야 합니다. 대규모 컬렉션의 경우 캐시를 파일 시스템에 동기화하는 것이 느릴 수 있으므로, 업로드 프로세스의 속도를 늦추지 않으면서 사용자가 업로드를 중단할 경우 정보 손실 가능성을 최소화하기 위해 실용적으로 자주 수행해야 합니다.

구현은 `interrupted` 매개변수를 사용하여 사용자가 `Ctrl+C`를 눌러 업로드 프로세스를 중단할 때를 제어해야 합니다&mdash;이는 대규모 업로드에 유용합니다. 캐시에 저장된 정보는 다시 업로드되지 않습니다. `upload` 명령은 이미 업로드된 자산을 필터링하며, 이들은 자산 벡터에 포함되지 않습니다. `progress`는 콘솔에 표시되는 진행률 표시줄에 대한 참조이며, `progress.inc(1)` 함수를 호출하여 `1`개의 자산이 업로드되었음을 나타내어 업로드 진행 상황에 대한 시각적 피드백을 제공하는 데 사용해야 합니다.

모든 파일이 성공적으로 업로드되면 `upload` 메서드는 빈 `Vec`를 반환합니다. 오류가 발생한 경우 `Vec`에는 사용자에게 표시될 `UploadError` 목록이 포함됩니다.

### ParallelUploader

`ParallelUpload`는 동시 업로드를 지원하기 위해 `Uploader` trait의 `upload` 함수의 스레드 지원 구현을 제공하며, 스레딩 로직을 추상화하여 단일 자산(파일) 업로드 로직에 집중합니다. 따라서 자산을 병렬로 업로드할 수 있는 방법은 간소화된 `upload_asset` 함수를 구현해야 합니다:

```rust
fn upload_asset(
    &self,
    asset: AssetInfo
) -> JoinHandle<Result<(String, String)>>;
```

`upload_asset` 함수는 `JoinHandle` 객체를 반환해야 합니다. 대부분의 경우 함수는 `tokio::spawn`의 값을 반환합니다. 이 함수는 자산을 업로드하는 로직만 포함해야 합니다&mdash;중단 제어 및 캐시 동기화는 `ParallelUpload` trait에 의해 자동으로 수행됩니다.

### Prepare

모든 업로드 방법은 추가 trait `Prepare`를 구현해야 합니다. 그 이유는 지정된 미디어/메타데이터 파일의 업로드를 위해 방법을 준비하기 위함입니다. 예:

- 파일이 크기 제한을 초과하는지 확인;
- 업로드를 위한 저장 공간이 있는지 확인;
- 업로드를 위한 자금을 확인/추가.

trait은 단일 함수를 정의합니다:

```rust
async fn prepare(
    &self,
    sugar_config: &SugarConfig,
    asset_pairs: &HashMap<isize, AssetPair>,
    asset_indices: Vec<(DataType, &[isize])>,
) -> Result<()>;
```

여기서:
- `sugar_config` - 현재 sugar 구성
- `asset_pairs` - `index`에서 `AssetPair`로의 매핑
- `asset_indices` - 유형별로 그룹화된 업로드될 자산 쌍 인덱스 정보가 포함된 벡터.

`asset_pairs`에는 자산의 전체 정보가 포함되지만, `asset_indices`에 지정된 자산만 업로드됩니다&mdash;예: 인덱스 `1`이 `DataType::Image` 인덱스 배열에만 있는 경우 자산 `1`의 이미지만 업로드됩니다.

## 구성

업로드 방법의 로직을 구현한 후에는 Sugar의 구성 파일에 해당 방법을 통합해야 합니다. 먼저, 업로드 방법을 식별하기 위해 `UploadMethod` [enum](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L220-L231)에 새 값을 추가해야 합니다. 둘째, 구성 파일에 지정된 경우 `Uploader` 객체를 생성하도록 `initialize` [팩토리 메서드](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs#L274-L296)를 수정해야 합니다.

업로드 방법에 추가 매개변수가 필요한 경우 `ConfigData` [구조체](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L30-L86)를 수정해야 합니다. 예를 들어, `aws` 업로드 방법은 사용자가 업로드를 위한 버킷 이름을 지정해야 합니다. `ConfigData` 구조체에서 구성 파일의 `awsS3Bucket` 속성에 해당하는 `aws_s3_bucket` 필드를 찾을 수 있습니다.

업로드 방법 trait 구현을 완료하고 Sugar의 구성 파일에 세부 정보를 추가하면 자산을 업로드하는 데 사용할 준비가 된 것입니다.

{% callout %}

Sugar의 저장소에 PR을 제출하여 구현을 Sugar의 코드베이스에 추가하는 것을 잊지 마세요.

{% /callout %}

## 다음 단계

Sugar는 현재 6개의 [업로드 방법](https://github.com/metaplex-foundation/sugar/tree/main/src/upload/methods)을 사용할 수 있습니다&mdash;자산 업로드 작동 방식 및 자체 업로드 방법을 구현하기 위한 디자인 아이디어에 대한 자세한 내용은 소스 코드를 확인하세요.
