---
title: 스토리지 제공자
metaTitle: 스토리지 제공자 | Developer Hub
description: Solana에서 사용 가능한 스토리지 제공자 목록.
---

NFT는 영원히 살아가며 구매, 판매, 보유 및 즐기도록 만들어졌습니다. 따라서 자산이 작성되는 스토리지는 _영구적_이어야 합니다. Metaplex를 통해 생성된 NFT는 기본적으로 확장 가능하고 내구성 있으며 영구적이고 검열에 강한 스토리지에 기록되지만 다른 옵션도 사용할 수 있습니다. 살펴보겠습니다.

## 스토리지 옵션

### Arweave

[Arweave][]는 데이터를 영구적으로 보존하도록 설계된 탈중앙화되고 신뢰 최소화된 검열 저항 데이터 스토리지 네트워크로 NFT에 적합합니다. 미디어를 영구적으로 저장하는 비용을 충당하기 위해 스토리지 및 마이닝 수수료는 업로드 시 지불되며 네트워크에 참여하는 스토리지 제공자에게 배포됩니다.

#### Arweave 스토리지 수수료

스토리지 수수료는 NFT 생성 중에 네트워크에 업로드하는 파일의 전체 크기를 기반으로 합니다. 각 NFT는 세 개의 파일로 구성됩니다:

1. 자산 자체 (이미지, 비디오, 오디오 등)
1. 동반 메타데이터 파일 (속성 등)
1. 파일 간의 논리적 그룹화 또는 관계를 생성하는 생성된 [매니페스트][arweave path manifest]

이러한 파일의 누적 크기(바이트)는 [Arweave 스토리지 비용 추정 서비스][arweave price service]에 제출되며, 이는 [winstons][]로 가격이 책정된 스토리지에 대한 실시간 추정 수수료를 반환합니다. 그런 다음 winstons를 SOL로 변환하여 지불합니다.

### AWS S3

[Amazon Web Services S3][S3]는 전 세계적이고 저렴하지만 중앙 집중식 스토리지 제공자입니다. S3는 중앙 집중식이므로 거기에 저장된 NFT는 검열에 저항하지 않습니다. AWS가 법적 위협을 받거나 더 이상 NFT를 지원하지 않기로 결정하거나 폐업하거나 지불을 중단하면 서비스에서 자산을 제거할 수 있으며 잠재적으로 NFT 보유자가 미디어를 없이 남을 수 있습니다. 검열 저항적이고 영구적이어야 하는 NFT의 경우 S3를 사용하는 것을 권장하지 않습니다. 그러나 저렴한 옵션이므로 필요에 따라 필요한 것일 수 있습니다.

#### S3 스토리지 수수료

자세한 내용은 [https://aws.amazon.com/s3/pricing/](https://aws.amazon.com/s3/pricing/)를 방문하십시오.

### IPFS

[InterPlanetary File System][IPFS] 또는 IPFS는 웹을 업그레이드 가능하고 탄력적이며 더 개방적으로 만들어 인류의 지식을 보존하고 키우도록 설계된 탈중앙화되고 신뢰 최소화된 검열 저항 P2P 하이퍼미디어 프로토콜입니다. P2P 디자인은 파일 중복 제거 및 기타 효율성을 가능하게 합니다. IPFS는 파일을 영구적으로 저장하도록 설계되지 않았으므로 기본 스토리지 옵션이 아닙니다.

#### IPFS 스토리지 수수료

자세한 내용은 [https://infura.io/docs/ipfs](https://infura.io/docs/ipfs)를 방문하십시오.

[Arweave]: https://arweave.org
[arweave price service]: https://node1.bundlr.network/price/0
[repo]: https://github.com/metaplex-foundation/metaplex
[IPFS]: https://ipfs.io/
[winstons]: https://docs.arweave.org/developers/server/http-api#ar-and-winston
[S3]: https://aws.amazon.com/s3/
[arweave path manifest]: https://github.com/ArweaveTeam/arweave/wiki/Path-Manifests
[nft.storage metaplex doc]: https://nft.storage/docs/how-to/mint-solana
