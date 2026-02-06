---
title: sign
metaTitle: sign | Sugar
description: sign 명령어.
---

`sign` 명령을 사용하면 생성자의 키페어로 모든 NFT에 서명하여 NFT 메타데이터의 생성자 배열에서 해당 생성자를 확인할 수 있습니다. 각 생성자는 자신에 대해서만 서명할 수 있으며 이 명령으로 한 번에 한 명의 생성자만 서명할 수 있습니다. 생성자의 키페어는 `--keypair` 옵션으로 전달할 수 있으며, 그렇지 않으면 Solana CLI 구성에 지정된 기본 키페어를 사용하는 것이 기본값입니다.

기본 키페어로 명령 실행:

```
sugar sign
```

특정 키페어로 실행:

```
sugar sign -k creator-keypair.json
```

개발자는 명령과 함께 사용자 정의 RPC URL을 제공할 수 있습니다:

```
sugar sign -r <RPC_URL>
```

참고: `sugar sign`을 사용하면 Metaplex Token Metadata 프로그램(즉, `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`)에서 비효율적인 `getProgramAccounts` 호출에 의존합니다. 권장되는 솔루션은 다음 명령을 사용하여 NFT를 개별적으로 서명하는 것입니다:

```
sugar sign -m <MINT_ADDRESS>
```
