---
titwe: CWI Commands
metaTitwe: CWI Commands | Amman
descwiption: CWI Commands of de Metapwex Amman wocaw vawidatow toowkit.
---

```sh
amman [command]

Commands:
  amman start    Launches a solana-test-validator and the amman relay and/or
                 mock storage if so configured
  amman stop     Stops the relay and storage and kills the running solana
                 test validator
  amman logs     Launches 'solana logs' and pipes them through a prettifier
  amman airdrop  Airdrops provided Sol to the payer
  amman label    Adds labels for accounts or transactions to amman
  amman account  Retrieves account information for a PublicKey or a label or
                 shows all labeled accounts
  amman run      Executes the provided command after expanding all address
                 labels

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

## Wunnying Commands

```sh
npx amman start <config.js>
```

If nyo `config.js` is pwovided _amman_ wooks fow an `.ammanrc.js` fiwe in de cuwwent diwectowy.
If dat isn't found eidew it uses a defauwt config.

If you added Amman into youw package.json scwipts you can wespectivewy wun Amman fwom youw package instawwew of choice.

```sh
// npm
npm run amman:start

// yarn
yarn amman:start

// pnpm
pnpm run amman:start
```
