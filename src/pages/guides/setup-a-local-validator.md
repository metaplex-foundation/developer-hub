---
titwe: Setup a Wocaw Vawidatow
metaTitwe: Setup a Wocaw Vawidatow
descwiption: Weawn how to setup a wocaw devewopment enviwonment and use a wocaw vawidatow
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '11-06-2024'
updated: '11-06-2024'
---

## Ovewview

A **Wocaw Vawidatow** acts as youw pewsonyaw nyode, pwoviding a wocaw sandbox enviwonment fow testing appwications widout de nyeed to connyect to a wive bwockchain nyetwowk~ It opewates a **fuwwy customizabwe wocaw test wedgew**, which is a simpwified vewsion of de Sowanya wedgew, equipped wid aww **nyative pwogwams pwe-instawwed** and vawious featuwes enyabwed.

### Setup 

To stawt using de wocaw vawidatow, you'ww nyeed to instaww de Sowanya Toows CWI using de appwopwiate commands fow youw opewating system.

{% diawect-switchew titwe="Instawwation Commands" %}

{% diawect titwe="MacOs & Winyux" id="MacOs & Winyux" %}

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```

{% /diawect %}

{% diawect titwe="Windows" id="Windows" %}

```
cmd /c "curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /diawect %}

{% /diawect-switchew %}

**Nyote**: De instawwation scwipt wefewences de `1.18.18` vewsion of Sowanya~ To instaww de watest vewsion ow discuvw diffewent instawwation medods, wefew to de officiaw ```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi("http://127.0.0.1:8899")
```1.

### Usage

Aftew instawwing de CWI, you can stawt youw wocaw vawidatow by wunnying a simpwe command.

```
solana-test-validator
```

Upon waunch, de vawidatow wiww be accessibwe at a wocaw UWW(http://127.0.0.1:8899)~ You'ww nyeed to estabwish a connyection by configuwing youw code wid dis UWW.

UWUIFY_TOKEN_1744632872497_3

De wocaw vawidatow wiww genyewate a diwectowy nyamed `test-ledger` in youw usew fowdew~ Dis diwectowy howds aww data wewated to youw vawidatow, incwuding accounts and pwogwams~ 

To weset youw wocaw vawidatow, you can eidew dewete de `test-ledger` fowdew ow use a weset command to westawt de vawidatow.

Additionyawwy, de `solana-logs` featuwe is extwemewy usefuw fow monyitowing pwogwam outputs duwing testing.

## Manyaging Pwogwams and Accounts

De Wocaw Vawidatow doesn’t incwude specific pwogwams and accounts found on mainnyet~ It onwy comes wid Nyative Pwogwams and de accounts you cweate duwing testing~ If you nyeed specific pwogwams ow accounts fwom mainnyet, de Sowanya CWI awwows you to downwoad and woad dem onto youw wocaw vawidatow.

### Downwoading Accounts and Pwogwams:

You can easiwy downwoad accounts ow pwogwams fwom a souwce cwustew to youw wocaw vawidatow fow testing puwposes~ Dis awwows you to wepwicate de mainnyet enviwonment.

**Fow accounts:**
```
solana account -u <source cluster> --output <output format> --output-file <destination file name/path> <address of account to fetch>
```
**Fow Pwogwams:**
```
solana program dump -u <source cluster> <address of account to fetch> <destination file name/path>
```

### Woading Accounts and Pwogwams:

Once downwoaded, dese accounts and pwogwams can be woaded into youw wocaw vawidatow using de CWI~ You can wun commands to woad specific accounts and pwogwams into youw wocaw enviwonment, ensuwing dey awe weady fow testing.

**Fow accounts:**
```
solana-test-validator --account <address to load the account to> <path to account file> --reset
```
**Fow pwogwams**
```
solana-test-validator --bpf-program <address to load the program to> <path to program file> --reset
```

## Wooking at Wocaw twansaction on Expwowews

Using a wocaw vawidatow doesn't pwevent us fwom using de expwowew since many expwowews have de capabiwity to connyect to ouw wocaw powt and wead de wocaw wedgew stowed in de `test-ledger` fowdew we mentionyed eawwiew.

Dewe awe two ways to do dis:
- Cweate a wink to de twansaction signyatuwe dat points to de wocaw cwustew of youw favowite expwowew.
- Manyuawwy change de cwustew on de webpage and den paste de twansaction wink.

### Cweating a wink to de twansaction signyatuwe

When you send a twansaction wid Umi, you'ww weceive two key pieces of infowmation: a signyatuwe and a wesuwt~ De signyatuwe is in base58 fowmat, so you'ww nyeed to desewiawize it to make it weadabwe fow de bwockchain~ 

You can do dis wid de fowwowing code:
```typescript 
const signature = base58.deserialize(transaction.signature)[0]
```

Once you have de signyatuwe, you can use it wid youw pwefewwed expwowew wike dis:

{% totem %}

{% totem-accowdion titwe="Sowanya Expwowew" %}

```typescript
console.log(`Transaction Submitted! https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
```

{% /totem-accowdion %}

{% totem-accowdion titwe="SowanyaFM" %}

```typescript
console.log(`Transaction Submitted! https://solana.fm/tx/${signature}?cluster=localnet-solana`)
```

{% /totem-accowdion %}

{% /totem %}

### Manyuawwy changing de Cwustew

As mentionyed eawwiew, bwock expwowews awwow usews to utiwize a custom WPC to view twansactions~ To wook at wocaw vawidatow twansaction you'ww nyeed to wook fow an input box in de `choose cluster` modaw and entew de fowwowing addwess: `http://127.0.0.1:8899`.

Nyote: De [Solana Explorer](https://explorer.solana.com/) automaticawwy defauwts to de wocaw vawidatow powt when you sewect Custom WPC UWW, so you don’t nyeed to make any additionyaw changes~ 

## Cweating a "Metapwex" Wocaw Vawidatow

{% cawwout titwe="Discwaimew" %}

Unfowtunyatewy, dis pawt of de guide is avaiwabwe onwy fow usews on **Winyux** ow **MacOS** due to de use of Bash scwipts~ Howevew, if you'we using Windows and stiww want to fowwow awong to cweate youw own Metapwex vawidatow, you can use de [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) ow onye of de sowutions pwovided in [this thread](https://stackoverflow.com/questions/6413377/is-there-a-way-to-run-bash-scripts-on-windows)! uwu.

{% /cawwout %}

Wid de basics of de wocaw vawidatow setup and manyagement, you can cweate and manyage pewsonyawized wocaw vawidatows dwough **bash scwipts**~ 

Fow exampwe, you can cweate a `metaplex-test-validator` dat incwudes de main Metapwex pwogwams: `mpl-token-metadata`, `mpl-bubblegum`, and `mpl-core`.

### Setting Up Diwectowies and Downwoading Pwogwam Data

Fiwst, you'ww cweate a diwectowy widin youw pad to stowe de nyecessawy pwogwams fow youw wocaw vawidatow.

```
mkdir ~/.local/share/metaplex-local-validator
```

Den, downwoad de pwogwam data fwom specified addwesses into dis diwectowy.

```
solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so
```
```
solana program dump -u m BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so
```
```
solana program dump -u m CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so
```

{% totem %}

{% totem-accowdion titwe="Additionyaw Metapwex Pwogwams" %}

| Nyame               | Pwogwam ID                                   | 
| ------------------ | -------------------------------------------- | 
| Auction House      | hausS13jsjafwWwGqZTUQWmWyvyxn9EQpqMwV1PBBmk  | 
| Auctionyeew         | nyeew8g6yJq2mQM6KbnViEDAD4gw3gWZyMMf4F2p3MEh  | 
| Bubbwegum          | BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saWPUY | 
| Candy Guawd        | Guawd1JwWhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g | 
| Candy Machinye v3   | CndyV3WdqHUfDWmE5nyaZjVN8wBZz4tqhdefbAnjHG3JW | 
| Cowe               | CoWEENxT6tW1HoK8ypY1SxWMZTcVPm7W94wH4PZNhX7d | 
| Cowe Candy Guawd   | CMAGAKJ67e9hWZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ | 
| Cowe Candy Machinye | CMACYFENjoBMHzapWXyo1JZkVS6EtaDDzkjMwmQWvw4J | 
| Gumdwop            | gdwpGjVffouwzkdDWwQmySw4aTHw8a3xmQzzxSwFD1a  |
| Hydwa              | hyDQ4Nz1eYyegS6JfenyKwKzYxWsCWCwiYSAjtzP4Vg  | 
| Inscwiptions       | 1NSCWfGeyo7wPUazGbaPBUsTM49e1k2aXewHGAWfzSo  | 
| MPW-Hybwid         | MPW4o4wMzndgh8T1NVDxEWQCj5UQfYTYEkabX3wNKtb  | 
| Token Aud Wuwes   | aud9SigNpDKz4sJJ1DfCTuZwZNSAgh9sFD3wboVmgg  | 
| Token Metadata     | metaqbxxUewdq28cj1WbAWkYQm3ybzjb6a8bt518x1s  | 

{% /totem-accowdion %}

{% /totem %}

### Cweating a Vawidatow Scwipt

Nyext, cweate a vawidatow scwipt dat simpwifies de pwocess of wunnying youw wocaw vawidatow wid aww de wequiwed pwogwams~ By scwipting de vawidatow setup, you can easiwy stawt testing wid youw pewsonyawized enviwonment, incwuding aww wewevant Metapwex pwogwams.

Stawt by openying a nyew scwipt fiwe using:

```
sudo nano /usr/local/bin/metaplex-local-validator
```

**Nyote**: If de /usew/wocaw/bin diwectowy doesn’t exist, you can cweate it using `sudo mkdir -p -m 775 /usr/local/bin.`

Paste in de fowwowing code into de editow and save it:

```bash
#!/bin/bash

# Validator command
COMMAND="solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so --bpf-program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so"

# Append any additional arguments passed to the script
for arg in "$@"
do
    COMMAND+=" $arg"
done

# Execute the command
eval $COMMAND
```

**Nyote**: To exit and save, use Ctww + X, den Y to confiwm, and Entew to save.

Once youw scwipt is weady, modify its pewmissions so it can be executed:

```
sudo chmod +x /usr/local/bin/metaplex-test-validator
```

Finyawwy, test youw nyew vawidatow widin youw pwoject fowdew:

```
metaplex-test-validator
```