---
title: 시작하기
metaTitle: 시작하기 | Fusion
description: Metaplex Fusion 사용 방법.
---

## Fusion이란 무엇인가요?

Fusion은 합성 가능한 NFT에 대한 Metaplex의 해답입니다. Fusion은 프로젝트, 아티스트, 또는 컬렉터가 완전히 동적인 NFT를 생성할 수 있게 해주는 여러 Metaplex 프로그램의 구성체입니다. 계약 수준에서 Fusion은 NFT의 온체인 추적 및 규칙 기반 합성/분해 작업을 관리하는 Trifle에 의해 구동됩니다.

## 설정 단계

### 부모 NFT 생성

Fusion은 구성되는 모든 속성을 소유하는 단일 NFT(Fusion Parent)로 구조화됩니다. Fusion Parent는 온체인 Trifle 계정에서 추적되는 모든 속성 토큰의 레이어링을 반영하여 동적으로 메타데이터와 이미지를 다시 렌더링합니다. 메타데이터의 원활한 재구성을 가능하게 하기 위해 결정론적 형식을 사용하여 정적 URI가 생성됩니다.

`https://shdw-drive.genesysgo.net/<METAPLEX_BUCKET>/<TRIFLE_ADDRESS>`

동적 메타데이터와 이미지는 GenesysGo의 Shadow Drive 기술에 호스팅되어 분산형 데이터 호스팅과 업데이트 가능한 스토리지 형식의 장점을 활용합니다. 이 정적 URI는 NFT의 메타데이터 계정에 대한 실제 업데이트 없이 백엔드에서 모든 데이터를 업데이트할 수 있게 해줍니다. 메타데이터 계정은 업데이트 권한자만 업데이트할 수 있도록 권한이 부여됩니다. 이를 통해 Fusion 사용자는 개인 키를 공유하지 않고도 동적 메타데이터를 가질 수 있습니다. Fusion Parent 생성의 예시는 아래에 설명되어 있습니다:

```tsx
const findTriflePda = async (mint: PublicKey, authority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('trifle'), mint.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ADDRESS)
  )
}

const METAPLEX_BUCKET = 'Jf27xwhv6bH1aaPYtvJxvHvKRHoDe3DyQVqe4CJyxsP'
let nftMint = Keypair.generate()
let trifleAddress = await findTriflePda(nftMint.publicKey, updateAuthority)
let result
result = await metaplex!.nfts().create({
  uri:
    'https://shdw-drive.genesysgo.net/' +
    METAPLEX_BUCKET +
    '/' +
    trifleAddress[0].toString() +
    '.json',
  name: 'Fusion NFT',
  sellerFeeBasisPoints: 0,
  useNewMint: nftMint,
})
```

### 렌더 스키마 작성

Fusion은 Constraint Model 계정의 `schema` 필드를 활용하여 속성을 렌더링할 레이어 순서를 결정합니다.

```json
{
  "type": "layering",
  "layers": ["base", "neck", "mouth", "nose"],
  "defaults": {
    "metadata": "https://shdw-drive.genesysgo.net/G6yhKwkApJr1YCCmrusFibbsvrXZa4Q3GRThSHFiRJQW/default.json"
  }
}
```

`type`: 이 스키마가 나타내는 유형을 정의하며, 따라서 백엔드 서버가 Fusion Parent의 이미지를 렌더링하는 방법을 결정합니다.
`layers`: Trifle 계정의 슬롯 이름 배열입니다. 배열의 순서는 레이어가 렌더링되어야 하는 순서를 정의합니다. 모든 레이어를 사용하는 것은 필수가 아니므로 보이지 않는 속성을 허용합니다.
`defaults`: Fusion Parent의 메타데이터를 결합할 때 기준선으로 사용할 기본 메타데이터입니다. `external_url`과 같은 메타데이터 필드는 이런 방식으로 메타데이터에 포함될 수 있습니다.

### Trifle 설정

마지막으로, Constraint Model과 Trifle 계정은 [이 지침들](/fusion/getting-started)에 따라 설정되어야 합니다.

위의 단계들 이후, Fusion Parent는 모든 `transfer_in` 또는 `transfer_out` 작업 후에 다시 렌더링되어야 합니다.