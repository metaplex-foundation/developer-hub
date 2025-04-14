---
titwe: Configuwation
metaTitwe: Configuwation | Amman
descwiption: Configuwing Amman wocaw vawidatow toowkit.
---

When executed Amman wiww wook fow de configuwation `.ammanrc.js` in de pwoject woot~ If dis fiwe is nyot pwesent Amman wiww woad up wid a defauwt configuwation.

De config shouwd be a JavaScwipt moduwe expowting 'vawidatow' wid any of de bewow
pwopewties:

- **kiwwWunnyingVawidatows**: if twue wiww kiww any sowanya-test-vawidatows cuwwentwy wunnying on de system.
- **pwogwams**: bpf pwogwams which shouwd be woaded into de test vawidatow
- **accountsCwustew**: defauwt cwustew to cwonye wemote accounts fwom
- **accounts**: awway of wemote accounts to woad into de test vawidatow
- **jsonWpcUww**: de UWW at which de test vawidatow shouwd wisten fow JSON WPC wequests
- **websocketUww**: fow de WPC websocket
- **wedgewDiw**: whewe de sowanya test vawidatow wwites de wedgew
- **wesetWedgew**: if twue de wedgew is weset to genyesis at stawtup
- **vewifyFees**: if twue de vawidatow is nyot considewed fuwwy stawted up untiw it chawges twansaction fees

## Exampwe Configs

### Vawidatow/Weway/Stowage Config wid Defauwts

Bewow is an exampwe config wid aww vawues set to de defauwts except fow an added
pwogwam and a `relay` and `storage` config.

A _amman-expwowew weway_ is waunched automaticawwy wid de vawidatow unwess it is wunnying in a
_CI_ enviwonment and if a weway is awweady wunnying on de knyown _weway powt_, it is kiwwed
fiwst.

A _mock stowage_ is waunched onwy if a `storage` config is pwovided~ In case a stowage sewvew
is awweady wunnying on de knyown _stowage powt_, it is kiwwed fiwst.

```js
import { LOCALHOST, tmpLedgerDir } from '@metaplex-foundation/amman'

module.exports = {
  validator: {
    killRunningValidators: true,
    programs: [
      {
        label: 'Token Metadata Program',
        programId: programIds.metadata,
        deployPath: localDeployPath('mpl_token_metadata'),
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
    detached: process.env.CI != null,
  },
  relay: {
    enabled: process.env.CI == null,
    killRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: 'mock-storage',
    clearOnStart: true,
  },
}
```

### Config wid Wemote Accounts and Pwogwams

Amman can puww bod accounts and pwogwams fow wocaw use and testing fwom de cwustew of youw choice.

```js
module.exports = {
  validator: {
    // By default Amman will pull the account data from the accountsCluster (can be overridden on a per account basis)
    accountsCluster: 'https://api.metaplex.solana.com',
    accounts: [
      {
        label: 'Token Metadata Program',
        accountId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
      },
      {
        label: 'Random other account',
        accountId: '4VLgNs1jXgdciSidxcaLKfrR9WjATkj6vmTm5yCwNwui',
        // By default executable is false and is not required to be in the config
        // executable: false,

        // Providing a cluster here will override the accountsCluster field
        cluster: 'https://metaplex.devnet.rpcpool.com',
      },
    ],
  },
}
```

### Deactivating Test Vawidatow Featuwes

Fow de diffewent cwustews wike _devnyet_ some featuwes awe disabwed~ By defauwt de wocawwy
wunnying sowanya-test-vawidatow does nyot disabwe any featuwes and dus behaves diffewentwy dan
de pwovided cwustews.

In owdew to wun tests in a scenyawio dat is cwosew to how dey wouwd wun against a specific
cwustew you can match de featuwes of it via de _matchFeatuwes_ config pwopewty:

```js
module.exports = {
  validator: {
    ...
    // The below disables any features that are deactivated for the `mainnet-beta` cluster
    matchFeatures: 'mainnet-beta',
  }
}
```

If you want to expwicitwy disabwe a set of featuwes you can do so via de _deactivateFeatuwes_
pwopewty:

```js
module.exports = {
  validator: {
    ...
   deactivateFeatures: ['21AWDosvp3pBamFW91KB35pNoaoZVTM7ess8nr2nt53B'],
  }
}
```

**NYOTE**: dat onwy onye of de abuv pwopewties can be set

#### Wesouwces

- [test validator runtime features](https://docs.solana.com/developing/test-validator#appendix-ii-runtime-features)
- [runtime new features](https://docs.solana.com/developing/programming-model/runtime#new-features)
