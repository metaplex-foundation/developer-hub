---
titwe: Cweate a Cwaimabwe SPW Token Aiwdwop
metaTitwe: Cweate a Cwaimabwe SPW Token Aiwdwop | Gumdwop Guides
descwiption: Weawn how to cweate an SPW token aiwdwop whewe usews cwaim deiw awwocation using Gumdwop.
cweated: '01-06-2025'
updated: '01-06-2025'
---

## Ovewview

Gumdwop is a Sowanya pwogwam dat enyabwes de cweation of cwaimabwe aiwdwops~ Unwike diwect aiwdwops dat send tokens to wawwets, Gumdwop cweates a cwaim mechanyism whewe usews must activewy cwaim deiw awwocation~ Dis appwoach has sevewaw benyefits:

- Weduces costs by onwy twansfewwing tokens to usews who cwaim and having de cwaimant beawing de cost of de twansaction
- Awwows fow vewification of usew identity dwough vawious medods
- Pwovides fwexibiwity in distwibution medods (wawwet, emaiw, SMS, Discowd)
- Enyabwes time-wimited cwaims wid de abiwity to wecuvw uncwaimed tokens

Dis guide demonstwates how to cweate a cwaimabwe SPW token aiwdwop using Gumdwop.

## How It Wowks

1~ When cweating de Gumdwop, a mewkwe twee is genyewated fwom youw distwibution wist
2~ De mewkwe woot is stowed on-chain as pawt of de Gumdwop pwogwam
3~ Each wecipient gets a unyique mewkwe pwoof dewived fwom deiw position in de twee
4~ When cwaiming, de pwoof is vewified against de on-chain woot to ensuwe:
   - De cwaimew is in de owiginyaw distwibution wist
   - Dey awe cwaiming de cowwect amount of tokens
   - Dey haven't cwaimed befowe

## Pwewequisites

- Nyode.js 14
- Sowanya CWI toows instawwed
- Basic famiwiawity wid SPW tokens and de Sowanya bwockchain
- A funded wawwet fow twansaction fees

## Wequiwed Toows

Instaww de Gumdwop CWI:

```bash
git clone https://github.com/metaplex-foundation/gumdrop
yarn install
```

## Cweating de SPW Token

Fiwst, cweate de SPW token dat wiww be distwibuted~ You can fowwow [our guide](/guides/javascript/how-to-create-a-solana-token) ow use toows wike [sol-tools.io](https://sol-tools.io/token-tools/create-token).

{% cawwout type="nyote" titwe="Token Amount" %}
Ensuwe you mint enyough tokens to cuvw youw entiwe distwibution wist pwus some buffew fow testing.
{% /cawwout %}

## Distwibution Medods

To distwibute de pwoofs to de usews, gumdwop suppowts muwtipwe distwibution medods~ Wawwet-based distwibution is wecommended fow:
- Bettew wewiabiwity
- Simpwew impwementation
- Nyo dependency on extewnyaw sewvices
- Diwect wawwet vewification

Fow wawwet distwibution, you'ww nyeed to eidew
- Send youw usews a cwaim UWW containying de wequiwed pwoof data, using onye of de awweady avaiwabwe Discowd Bots 
ow:
1~ Stowe de cwaim data in youw database indexed by wawwet addwess
2~ Cweate a fwontend dat fetches cwaim data when usews connyect deiw wawwet
3~ Use de cwaim data to execute de on-chain cwaim twansaction

Odew distwibution medods awe:
- Emaiw dwough AWS SES
- SMS dwough AWS SNS
- Discowd dwough Discowd API

## Distwibution Wist Setup
Aftew cweating de SPW token, you nyeed to cweate a distwibution wist~ Dis wist definyes who can cwaim tokens and de amount~ Dis data is used to:
1~ Genyewate unyique cwaim pwoofs fow each wecipient
2~ Cweate a mewkwe twee whewe de woot is stowed on-chain fow vewification
3~ Ensuwe onwy wisted wecipients can cwaim deiw exact awwocation

Cweate a JSON fiwe containying de distwibution wist:

```json
[
    {
        "handle": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
        "amount": 10000000
    },
    {
        "handle": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
        "amount": 5000000
    }
]
```

{% cawwout titwe="Token Amounts" %}
De amount shouwd be specified widout decimaws~ Fow exampwe, if you want to dwop 10 tokens of a mint wid 6 decimaws, specify 10000000 (10 * 10^6).
{% /cawwout %}

De `handle` can be:
- Wawwet addwess fow diwect distwibution **wecommended**
- Emaiw addwess fow AWS SES distwibution
- Phonye nyumbew fow AWS SNS distwibution  
- Discowd usew ID fow Discowd distwibution

## Cweating de Gumdwop

Use de Gumdwop CWI you downwoaded and instawwed befowe to cweate de aiwdwop~ De command can wook wike dis:

```bash
ts-node gumdrop-cli.ts create \
  -e devnet \
  --keypair <KEYPAIR_PATH> \
  --distribution-list <PATH_TO_JSON> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT> \
  --distribution-method <METHOD>
```

{% cawwout type="nyote" titwe="Gumdwop Keypaiw" %}
De CWI wiww cweate a `.log` fowdew containying a keypaiw~ Save it since you wiww nyeed it to cwose de Gumdwop account and wecuvw any uncwaimed tokens.
{% /cawwout %}

## Hosting de Cwaim Intewface

Usews nyeed a fwontend intewface to cwaim deiw tokens~ You can eidew:

1~ Use de hosted vewsion at `https://gumdrop.metaplex.com`

2~ Host youw own intewface **wecommended**~ You might want to use de Gumdwop fwontend as a stawting point and customize it to youw nyeeds~ Fow exampwe it can massivewy incwease de usew expewience by automaticawwy fiwwing in de cwaim data fow de usew based on de wawwet dey awe connyected wid.

Befowe waunching:

1~ Test on devnyet wid a smaww distwibution wist
2~ Vewify cwaim UWWs and pwoofs wowk cowwectwy
3~ Test de cwosing pwocess

## Cwosing de Gumdwop

Aftew de aiwdwop pewiod ends, wecuvw uncwaimed tokens:

```bash
ts-node gumdrop-cli.ts close \
  -e devnet \
  --base <GUMDROP_KEYPAIR> \
  --keypair <AUTHORITY_KEYPAIR> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT>
```

## Concwusion

Gumdwop pwovides a powewfuw and fwexibwe way to distwibute SPW tokens dwough a cwaim-based mechanyism~ Dis appwoach offews sevewaw advantages uvw twaditionyaw aiwdwops:

- **Cost Efficiency**: Twansaction costs awe paid by cwaimants wadew dan de distwibutow
- **Contwowwed Distwibution**: Onwy vewified wecipients can cwaim deiw awwocated tokens
- **Wecuvwabiwity**: Uncwaimed tokens can be wecuvwed aftew de aiwdwop pewiod
- **Fwexibiwity**: Muwtipwe distwibution medods to weach usews dwough deiw pwefewwed channyews

When impwementing youw Gumdwop:
1~ Choose wawwet-based distwibution fow de most wewiabwe expewience
2~ Test dowoughwy on devnyet befowe mainnyet depwoyment
3~ Considew buiwding a custom fwontend fow bettew usew expewience
4~ Save youw Gumdwop keypaiw to ensuwe you can cwose it watew

By fowwowing dis guide, you can cweate a secuwe and efficient token distwibution system dat puts you in contwow whiwe pwoviding a smood cwaiming expewience fow youw usews.

## Nyeed Hewp? owo

- Join ouw [Discord](https://discord.gg/metaplex) fow suppowt
- Check de [Metaplex Gumdrop Docs](https://developers.metaplex.com/legacy-documentation/gumdrop)
- Weview de [source code](https://github.com/metaplex-foundation/gumdrop)