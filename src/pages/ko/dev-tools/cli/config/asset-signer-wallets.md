---
title: 에셋 서명자 지갑
metaTitle: 에셋 서명자 지갑 | Metaplex CLI
description: MPL Core 에셋의 서명자 PDA를 활성 CLI 지갑으로 사용합니다. 모든 명령어가 자동으로 execute로 래핑되어 커스텀 스크립트 없이 PDA에서 SOL, 토큰, 에셋을 전송할 수 있습니다.
keywords:
  - mplx cli
  - asset-signer wallet
  - PDA wallet
  - MPL Core execute
  - signer PDA
  - metaplex cli asset signer
  - core execute
about:
  - MPL Core Asset-signer wallets
  - PDA wallet management
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
faqs:
  - q: 각 작업마다 별도의 execute 명령어가 필요한가요?
    a: 아닙니다. 에셋 서명자 지갑이 활성화되면 모든 CLI 명령어가 전송 시 자동으로 execute 인스트럭션으로 래핑됩니다. `mplx toolbox sol transfer`나 `mplx core asset create`와 같은 표준 명령어를 사용하세요. 이러한 작업을 위한 별도의 execute 하위 명령어는 존재하지 않습니다.
  - q: 에셋 소유자가 저장된 지갑에 없으면 어떻게 되나요?
    a: CLI가 먼저 소유자 지갑을 추가하라는 오류를 반환합니다. 에셋 서명자 지갑을 등록하기 전에 에셋 소유자의 키페어로 `mplx config wallets add <name> <keypair-path>`를 실행하세요.
  - q: PDA가 서명하는 동안 다른 지갑이 트랜잭션 수수료를 지불할 수 있나요?
    a: 네. 모든 명령어에 `-p /path/to/fee-payer.json`을 전달하세요. 에셋 소유자는 여전히 execute 인스트럭션에 서명하지만, -p 지갑이 Solana 트랜잭션 수수료를 지불합니다.
  - q: execute로 래핑할 수 없는 작업은 무엇인가요?
    a: 대규모 계정 생성(Merkle 트리, Candy Machine)과 네이티브 SOL 래핑은 Solana CPI 크기 제한으로 인해 실패합니다. 먼저 일반 지갑으로 이 인프라를 생성한 다음, 후속 작업에서 에셋 서명자 지갑으로 전환하세요.
  - q: PDA가 해결하는 주소를 어떻게 확인하나요?
    a: "`mplx core asset execute info <assetId>`를 실행하세요. 이것은 결정론적 서명자 PDA 주소와 현재 SOL 잔액을 보여줍니다."
created: '03-19-2026'
updated: '03-19-2026'
---

## 요약

에셋 서명자 지갑을 사용하면 [MPL Core 에셋](/core)의 서명자 PDA를 활성 CLI 지갑으로 사용할 수 있습니다. 활성화되면 모든 CLI 명령어가 온체인 [`execute`](/dev-tools/cli/core/execute) 인스트럭션으로 인스트럭션을 자동으로 래핑합니다. 커스텀 스크립팅이 필요 없습니다.

- `mplx config wallets add <name> --asset <assetId>`로 모든 Core 에셋을 지갑으로 등록
- 에셋 서명자 지갑이 활성화되면 모든 CLI 명령어가 PDA를 통해 투명하게 작동
- 에셋 소유자가 `execute` 인스트럭션에 서명하며, `-p`로 별도의 수수료 지불자 지정 가능
- 일부 작업은 Solana CPI 제약으로 인해 제한됨 (대규모 계정 생성, 네이티브 SOL 래핑)

## 빠른 시작

```bash {% title="Asset-signer wallet setup" %}
# 1. 에셋 생성 (또는 소유한 기존 에셋 사용)
mplx core asset create --name "My Vault" --uri "https://example.com/vault"

# 2. 지갑으로 등록 (온체인 데이터에서 소유자 자동 감지)
mplx config wallets add vault --asset <assetId>

# 3. PDA 정보 확인
mplx core asset execute info <assetId>

# 4. PDA에 자금 전송
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 5. 에셋 서명자 지갑으로 전환
mplx config wallets set vault

# 6. PDA로 모든 명령어 사용
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <destination>
mplx core asset create --name "PDA Created NFT" --uri "https://example.com/nft"
```

## 에셋 서명자 지갑 작동 방식

CLI는 noop-signer 패턴을 사용하여 PDA 작업을 투명하게 만듭니다. 에셋 서명자 지갑이 활성화되면:

1. **`umi.identity`** 가 PDA의 공개 키를 가진 noop 서명자로 설정 — 명령어가 PDA를 권한으로 자연스럽게 인스트럭션 구성
2. **`umi.payer`** 도 PDA noop 서명자로 설정 — 파생 주소(ATA, 토큰 계정)가 올바르게 해결
3. **전송 시**, 트랜잭션이 [MPL Core의 `execute` 인스트럭션](/dev-tools/cli/core/execute)으로 래핑되어 온체인에서 PDA를 대신하여 서명
4. **실제 지갑** (에셋 소유자)이 외부 트랜잭션에 서명하고 `setFeePayer`를 통해 수수료 지불

{% callout type="note" %}
별도의 `execute transfer-sol`이나 `execute transfer-token` 명령어는 없습니다. `mplx toolbox sol transfer`나 `mplx core asset transfer`와 같은 표준 명령어는 에셋 서명자 지갑이 활성화되면 자동으로 래핑됩니다.
{% /callout %}

## 에셋 서명자 지갑 등록

```bash {% title="Add asset-signer wallet" %}
mplx config wallets add <name> --asset <assetId>
```

`--asset` 플래그가 일반 지갑과의 차이점입니다. CLI는 에셋을 온체인에서 조회하고 소유자를 확인한 후 저장된 [지갑](/dev-tools/cli/config/wallets)과 매칭합니다. 소유자가 지갑 목록에 없으면 먼저 소유자 지갑을 추가해야 합니다.

등록 후에는 표준 [지갑 명령어](/dev-tools/cli/config/wallets)(`list`, `set`, `remove`)로 다른 지갑과 동일하게 관리할 수 있습니다. 에셋 서명자 지갑은 지갑 목록에서 `asset-signer` 유형으로 표시됩니다.

{% callout type="note" %}
`-k` 플래그는 에셋 서명자 지갑을 포함한 활성 지갑을 단일 명령어에서 우회합니다.
{% /callout %}

## 별도의 수수료 지불자

온체인 `execute` 인스트럭션은 별도의 권한과 수수료 지불자 계정을 지원합니다. `-p`를 사용하여 에셋 소유자가 execute에 서명하는 동안 다른 지갑이 트랜잭션 수수료를 지불하게 할 수 있습니다:

```bash {% title="Separate fee payer" %}
mplx toolbox sol transfer 0.01 <destination> -p /path/to/fee-payer.json
```

에셋 소유자는 여전히 `execute` 인스트럭션에 서명합니다. `-p` 지갑은 Solana 트랜잭션 수수료만 지불합니다.

## 지원되는 명령어

모든 CLI 명령어가 에셋 서명자 지갑에서 작동합니다. 트랜잭션 래핑은 전송 레이어에서 투명하게 이루어집니다.

| 카테고리 | 명령어 |
|----------|--------|
| **Core** | `asset create`, `asset transfer`, `asset burn`, `asset update`, `collection create` |
| **Toolbox SOL** | `balance`, `transfer`, `wrap`, `unwrap` |
| **Toolbox Token** | `transfer`, `create`, `mint` |
| **Toolbox Raw** | `raw --instruction <base64>` |
| **Token Metadata** | `transfer`, `create`, `update` |
| **Bubblegum** | `nft create`, `nft transfer`, `nft burn`, `collection create` |
| **Genesis** | `create`, `bucket add-*`, `deposit`, `withdraw`, `claim`, `finalize`, `revoke` |
| **Distribution** | `create`, `deposit`, `withdraw` |
| **Candy Machine** | `insert`, `withdraw` |

## CPI 제한 사항

Solana CPI 제약으로 인해 일부 작업은 `execute()`로 래핑할 수 없습니다:

- **대규모 계정 생성** — Merkle 트리와 Candy Machine은 CPI 계정 할당 제한 초과
- **네이티브 SOL 래핑** — 토큰 계정으로의 `transferSol`은 CPI 컨텍스트에서 실패

{% callout type="warning" %}
이러한 작업에는 일반 [지갑](/dev-tools/cli/config/wallets)을 사용하거나 먼저 인프라를 생성한 다음, 후속 작업에서 에셋 서명자 지갑으로 전환하세요.
{% /callout %}

## Toolbox Raw를 사용한 원시 인스트럭션

`mplx toolbox raw` 명령어는 임의의 base64 인코딩된 인스트럭션을 실행합니다. 에셋 서명자 지갑이 활성화되면 자동으로 `execute()`로 래핑됩니다.

```bash {% title="Execute raw instructions" %}
# 단일 인스트럭션
mplx toolbox raw --instruction <base64>

# 다중 인스트럭션
mplx toolbox raw --instruction <ix1> --instruction <ix2>

# stdin에서 읽기
echo "<base64>" | mplx toolbox raw --stdin
```

### 원시 인스트럭션 구성

CLI에는 base64 인코딩된 인스트럭션을 구성하기 위한 직렬화 헬퍼가 포함되어 있습니다:

```typescript {% title="build-raw-instruction.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { serializeInstruction } from '@metaplex-foundation/cli/lib/execute/deserializeInstruction'

const signerPda = '<PDA address from execute info>'
const destination = '<destination address>'

// System Program SOL transfer
const data = new Uint8Array(12)
const view = new DataView(data.buffer)
view.setUint32(0, 2, true)             // Transfer discriminator
view.setBigUint64(4, 1_000_000n, true) // 0.001 SOL

const ix = {
  programId: publicKey('11111111111111111111111111111111'),
  keys: [
    { pubkey: publicKey(signerPda), isSigner: true, isWritable: true },
    { pubkey: publicKey(destination), isSigner: false, isWritable: true },
  ],
  data,
}

console.log(serializeInstruction(ix))
// Pass the output to: mplx toolbox raw --instruction <base64>
```

### 인스트럭션 바이너리 형식

| 바이트 | 필드 |
|--------|------|
| 32 | 프로그램 ID |
| 2 | 계정 수 (u16 리틀 엔디안) |
| 계정당 33 | 32바이트 공개 키 + 1바이트 플래그 (비트 0 = isSigner, 비트 1 = isWritable) |
| 나머지 | 인스트럭션 데이터 |

## 빠른 참조

| 항목 | 값 |
|------|-----|
| 지갑 추가 | `mplx config wallets add <name> --asset <assetId>` |
| 지갑 전환 | `mplx config wallets set <name>` |
| PDA 검사 | [`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute) |
| 오버라이드 | 모든 명령어에 `-k /path/to/keypair.json` |
| 수수료 지불자 | 모든 명령어에 `-p /path/to/payer.json` |
| PDA 파생 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| 설정 파일 | `~/.config/mplx/config.json` |
| 소스 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 용어집

| 용어 | 정의 |
|------|------|
| 서명자 PDA | [MPL Core 에셋](/core)에서 파생된 프로그램 파생 주소로, SOL, 토큰을 보유하고 다른 에셋을 소유 가능 |
| Execute 인스트럭션 | PDA가 에셋을 대신하여 인스트럭션에 서명할 수 있게 하는 [MPL Core](/core) 온체인 인스트럭션 |
| Noop 서명자 | 공개 키를 제공하지만 서명을 생성하지 않는 플레이스홀더 서명자 — 명령어가 PDA를 대상으로 인스트럭션을 구성하는 데 사용 |
| CPI | Cross-Program Invocation — 하나의 Solana 프로그램이 다른 프로그램을 호출하는 것; CPI 컨텍스트에서 크기 제한 있음 |

## FAQ

### 각 작업마다 별도의 execute 명령어가 필요한가요?

아닙니다. 에셋 서명자 지갑이 활성화되면 모든 CLI 명령어가 전송 시 자동으로 `execute` 인스트럭션으로 래핑됩니다. `mplx toolbox sol transfer`나 `mplx core asset create`와 같은 표준 명령어를 사용하세요. 이러한 작업을 위한 별도의 execute 하위 명령어는 존재하지 않습니다.

### 에셋 소유자가 저장된 지갑에 없으면 어떻게 되나요?

CLI가 먼저 소유자 지갑을 추가하라는 오류를 반환합니다. 에셋 서명자 지갑을 등록하기 전에 에셋 소유자의 키페어로 `mplx config wallets add <name> <keypair-path>`를 실행하세요.

### PDA가 서명하는 동안 다른 지갑이 트랜잭션 수수료를 지불할 수 있나요?

네. 모든 명령어에 `-p /path/to/fee-payer.json`을 전달하세요. 에셋 소유자는 여전히 [`execute`](/dev-tools/cli/core/execute) 인스트럭션에 서명하지만, `-p` 지갑이 Solana 트랜잭션 수수료를 지불합니다.

### execute로 래핑할 수 없는 작업은 무엇인가요?

대규모 계정 생성(Merkle 트리, Candy Machine)과 네이티브 SOL 래핑은 Solana CPI 크기 제한으로 인해 실패합니다. 먼저 일반 [지갑](/dev-tools/cli/config/wallets)으로 이 인프라를 생성한 다음, 후속 작업에서 에셋 서명자 지갑으로 전환하세요.

### PDA가 해결하는 주소를 어떻게 확인하나요?

[`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute)를 실행하세요. 이것은 결정론적 서명자 PDA 주소와 현재 SOL 잔액을 보여줍니다.

## 참고 사항

- 에셋 서명자 지갑은 에셋 소유자의 지갑이 [지갑 설정](/dev-tools/cli/config/wallets)에 저장되어 있어야 합니다 — 먼저 소유자 지갑을 추가하세요
- 에셋 서명자 지갑은 PDA 주소, 연결된 에셋 ID, 소유자 지갑에 대한 참조를 설정 파일에 저장합니다
- 에셋 서명자 지갑에서 전환하면 명령어가 일반 키페어 서명으로 되돌아갑니다
- `-k` 플래그는 에셋 서명자 지갑을 포함한 활성 지갑보다 항상 우선합니다
- `mplx toolbox raw`를 통한 원시 인스트럭션은 에셋 서명자 지갑이 활성화되면 다른 명령어와 마찬가지로 `execute()`로 래핑됩니다
