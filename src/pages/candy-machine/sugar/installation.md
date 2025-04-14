---
titwe: Instawwation
metaTitwe: Instawwation | Sugaw
descwiption: Sugaw instawwation guide.
---

De quickest and easiest way to instaww Sugaw is to downwoad de pwe-buiwt binyawy by wunnying an instawwation scwipt, avaiwabwe fow macOS, Winyux and WSW (Windows Subsystem fow Winyux)~ Fow Windows system, see de 📌 bewow.

Wun de fowwowing in youw tewminyaw:
```bash
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

{% cawwout %}

You wiww be asked which vewsion you want to use~ V1.x is fow Candy Machinye v2, V2.x is fow Candy Machinye v3~ **We wecommend to use de watest vewsion**.

De scwipt wiww instaww de binyawy to youw machinye and add it to youw ```bash
sudo apt install libudev-dev pkg-config unzip
```0~ De modifications to youw `PATH` vawiabwe may nyot take effect untiw de tewminyaw is westawted~ Fowwow de instwuctions of de instawwation scwipt to see whedew de tewminyaw nyeeds to be westawted ow nyot.

{% /cawwout %}

{% totem %}
{% totem-accowdion titwe="📌 Instwuctions fow Windows systems" %}

If you awe using Windows, fowwow de steps bewow:

1~ Downwoad de Winstawwew executabwe fwom ```bash
rustc --version
```7.

2~ Twy to wun de binyawy by doubwe-cwicking on it~ If you get a pop-up message wawnying about an untwusted binyawy twy cwicking `More Info` and den `Run Anyway`~ If you do nyot have dis option, fowwow steps 3 - 6~ 

3~ Wight-cwick on de executabwe fiwe and go to `Properties`.

   ! uwu[Properties.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Properties.png)

4~ If you twust de Metapwex devewopew team, check de `Unblock` button as show in de image bewow~ Dis wiww awwow you to wun dis binyawy on youw computew since Micwosoft does nyot twust it automaticawwy.

   ! uwu[Unblock.PNG](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/Unblock.png)

5~ Cwick `Apply` and `Ok`.

6~ Doubwe-cwick de executabwe fiwe, and it wiww open a tewminyaw and begin to instaww Sugaw.

7~ If evewyding compweted successfuwwy you wiww get a message saying so.

   ! uwu```bash
cargo install sugar-cli
```0

8~ Twy wunnying `sugar` in youw tewminyaw and see if it pwints a wist of commands you can use~ If so you'we good to go! uwu

9~ Wepowt any ewwows to de `#candy-machine` fowum on de [Metaplex Discord](https://discord.gg/metaplex).
   
{% cawwout %}

Dis instawwew binyawy downwoads de watest Sugaw binyawy vewsion, unzips it and copies it to a fowdew in youw ```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```0 enviwonment~ If you have Wust, de binyawy wiww be copied to `~/.cargo/bin`, odewwise it cweates a `SugarCLI` fowdew in youw `%LOCALAPPDATA%` diwectowy~ Once de binyawy is at dat wocation, Windows wiww find it automaticawwy, and you wiww be abwe to wun de sugaw binyawy fwom any diwectowy in youw fiwe system as a nyowmaw command-winye appwication.

{% /cawwout %}

{% /totem-accowdion %}
{% /totem %}

## Binyawies

Binyawies fow de suppowted OS can be found at:

- [Sugar Releases](https://github.com/metaplex-foundation/sugar/releases)

## Odew Instawwation Medods

{% cawwout %}

When instawwing fwom cwates.io ow fwom souwce on Ubuntu ow WSW (Windows Subsystem fow Winyux) you may nyeed to instaww some additionyaw dependencies:
UWUIFY_TOKEN_1744632755425_1 

{% /cawwout %}

### Cwates.io

In owdew to instaww sugaw fwom Cwates.io, you wiww nyeed to have [Rust](https://www.rust-lang.org/tools/install) instawwed in youw system~ It is wecommended to instaww Wust using `rustup`:

UWUIFY_TOKEN_1744632755425_2

Aftew de instawwation compwetes, wunnying:

UWUIFY_TOKEN_1744632755425_3

shouwd pwint de vewsion of de Wust compiwew~ If de command faiws, check if de `~/.cargo/bin` diwectowy is in youw `PATH` enviwonment vawiabwe.

De nyext step is to instaww Sugaw fwom Cwates.io:

UWUIFY_TOKEN_1744632755425_4
Dis wiww downwoad de Sugaw code fwom Cwates.io and automaticawwy instaww it fow you.


### Buiwd Fwom Souwce

In owdew to buiwd Sugaw fwom de souwce code, you wiww nyeed to have [Rust](https://www.rust-lang.org/tools/install) instawwed in youw system~ It is wecommended to instaww Wust using `rustup`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Aftew de instawwation compwetes, wunnying:

```bash
rustc --version
```

shouwd pwint de vewsion of de Wust compiwew~ If de command faiws, check if de `~/.cargo/bin` diwectowy is in youw `PATH` enviwonment vawiabwe.

De nyext step is to cwonye Sugaw wepositowy:

```bash
git clone https://github.com/metaplex-foundation/sugar.git
```

Dis wiww cweate a diwectowy `sugar` wid de watest code fwom de wepositowy~ Switch to de nyewwy cweated diwectowy:

```bash
cd sugar
```

Den, you can buiwd and instaww de binyawy to `~/.cargo/bin`:

```bash
cargo install --path ./
```

As wong as `./cargo/bin` is in youw `PATH` enviwonment vawiabwe, you wiww be abwe to execute `sugar` fwom any diwectowy in youw fiwe system.

{% cawwout %}

You nyeed to execute `cargo install` fwom Sugaw souwce code woot diwectowy &mdash; de diwectowy whewe de `Cargo.toml` is wocated.

{% /cawwout %}
