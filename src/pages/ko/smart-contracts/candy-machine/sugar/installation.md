---
title: 설치
metaTitle: 설치 | Sugar
description: Sugar 설치 가이드.
---

Sugar를 설치하는 가장 빠르고 쉬운 방법은 macOS, Linux 및 WSL(Windows Subsystem for Linux)에서 사용할 수 있는 설치 스크립트를 실행하여 사전 빌드된 바이너리를 다운로드하는 것입니다. Windows 시스템의 경우 아래 📌를 참조하세요.

터미널에서 다음을 실행하세요:
```bash
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

{% callout %}

사용할 버전을 선택하라는 메시지가 표시됩니다. V1.x는 Candy Machine v2용이고 V2.x는 Candy Machine v3용입니다. **최신 버전을 사용하는 것을 권장합니다**.

스크립트는 바이너리를 컴퓨터에 설치하고 `PATH`에 추가합니다. `PATH` 변수에 대한 수정 사항은 터미널을 다시 시작할 때까지 적용되지 않을 수 있습니다. 터미널을 다시 시작해야 하는지 확인하려면 설치 스크립트의 지침을 따르세요.

{% /callout %}

{% totem %}
{% totem-accordion title="📌 Windows 시스템 지침" %}

Windows를 사용하는 경우 아래 단계를 따르세요:

1. [여기](https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe)에서 Winstaller 실행 파일을 다운로드하세요.

2. 바이너리를 두 번 클릭하여 실행해 보세요. 신뢰할 수 없는 바이너리에 대한 경고 팝업 메시지가 표시되면 `More Info`를 클릭한 다음 `Run Anyway`를 클릭해 보세요. 이 옵션이 없는 경우 3-6단계를 따르세요.

3. 실행 파일을 마우스 오른쪽 버튼으로 클릭하고 `Properties`로 이동하세요.

   ![Properties.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Properties.png)

4. Metaplex 개발자 팀을 신뢰하는 경우 아래 이미지와 같이 `Unblock` 버튼을 선택하세요. 이렇게 하면 Microsoft가 자동으로 신뢰하지 않으므로 컴퓨터에서 이 바이너리를 실행할 수 있습니다.

   ![Unblock.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Unblock.png)

5. `Apply`와 `Ok`를 클릭하세요.

6. 실행 파일을 두 번 클릭하면 터미널이 열리고 Sugar 설치가 시작됩니다.

7. 모든 것이 성공적으로 완료되면 이를 알리는 메시지가 표시됩니다.

   ![windows installed](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/installed.png)

8. 터미널에서 `sugar`를 실행하여 사용할 수 있는 명령 목록이 출력되는지 확인하세요. 그렇다면 준비가 완료된 것입니다!

9. [Metaplex Discord](https://discord.gg/metaplex)의 `#candy-machine` 포럼에 오류를 보고하세요.

{% callout %}

이 설치 프로그램 바이너리는 최신 Sugar 바이너리 버전을 다운로드하고 압축을 풀고 `PATH`의 폴더에 복사합니다. Rust가 있는 경우 바이너리는 `~/.cargo/bin`에 복사되고, 그렇지 않으면 `%LOCALAPPDATA%` 디렉토리에 `SugarCLI` 폴더를 생성합니다. 바이너리가 해당 위치에 있으면 Windows가 자동으로 찾으며 일반 명령줄 애플리케이션으로 파일 시스템의 모든 디렉토리에서 sugar 바이너리를 실행할 수 있습니다.

{% /callout %}

{% /totem-accordion %}
{% /totem %}

## 바이너리

지원되는 OS용 바이너리는 다음에서 찾을 수 있습니다:

- [Sugar Releases](https://github.com/metaplex-foundation/sugar/releases)

## 기타 설치 방법

{% callout %}

Ubuntu 또는 WSL(Windows Subsystem for Linux)에서 crates.io 또는 소스로부터 설치할 때 일부 추가 종속성을 설치해야 할 수 있습니다:
```bash
sudo apt install libudev-dev pkg-config unzip
```

{% /callout %}

### Crates.io

Crates.io에서 sugar를 설치하려면 시스템에 [Rust](https://www.rust-lang.org/tools/install)가 설치되어 있어야 합니다. `rustup`을 사용하여 Rust를 설치하는 것이 좋습니다:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

설치가 완료된 후 다음을 실행:

```bash
rustc --version
```

하면 Rust 컴파일러의 버전이 출력되어야 합니다. 명령이 실패하면 `~/.cargo/bin` 디렉토리가 `PATH` 환경 변수에 있는지 확인하세요.

다음 단계는 Crates.io에서 Sugar를 설치하는 것입니다:

```bash
cargo install sugar-cli
```
이렇게 하면 Crates.io에서 Sugar 코드를 다운로드하고 자동으로 설치합니다.

### 소스에서 빌드

소스 코드에서 Sugar를 빌드하려면 시스템에 [Rust](https://www.rust-lang.org/tools/install)가 설치되어 있어야 합니다. `rustup`을 사용하여 Rust를 설치하는 것이 좋습니다:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

설치가 완료된 후 다음을 실행:

```bash
rustc --version
```

하면 Rust 컴파일러의 버전이 출력되어야 합니다. 명령이 실패하면 `~/.cargo/bin` 디렉토리가 `PATH` 환경 변수에 있는지 확인하세요.

다음 단계는 Sugar 저장소를 복제하는 것입니다:

```bash
git clone https://github.com/metaplex-foundation/sugar.git
```

이렇게 하면 저장소의 최신 코드가 포함된 `sugar` 디렉토리가 생성됩니다. 새로 생성된 디렉토리로 전환:

```bash
cd sugar
```

그런 다음 바이너리를 빌드하고 `~/.cargo/bin`에 설치할 수 있습니다:

```bash
cargo install --path ./
```

`./cargo/bin`이 `PATH` 환경 변수에 있는 한 파일 시스템의 모든 디렉토리에서 `sugar`를 실행할 수 있습니다.

{% callout %}

Sugar 소스 코드 루트 디렉토리 &mdash; `Cargo.toml`이 있는 디렉토리에서 `cargo install`을 실행해야 합니다.

{% /callout %}
