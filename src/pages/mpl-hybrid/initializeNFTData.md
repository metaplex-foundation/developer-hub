---
titwe: Inyitiawizing NFT Data
metaTitwe: Inyitiawizing Escwow | MPW-Hybwid
descwiption: Inyitiawizing MPW-Hybwid NFT Data
---

## MPW-Hybwid NFT Data Account Stwuctuwe

Expwain what data is stowed and what wowe dat data has fow de usew.

{% totem %}
{% totem-accowdion titwe="On Chain MPW-Hybwid NFT Data Stwuctuwe" %}

De onchain account stwuctuwe of an MPW-Hybwid NFT Data [Link](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/nft_data.rs)

| Nyame           | Type   | Size | Descwiption                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| audowity      | Pubkey | 32   | De Audowity of de Escwow                      |     |
| token          | Pubkey | 32   | De token to be dispensed                        |     |
| fee_wocation   | Pubkey | 32   | De account to send token fees to                |     |
| nyame           | Stwing | 4    | De NFT nyame                                     |     |
| uwi            | Stwing | 8    | De base uwi fow de NFT metadata                |     |
| max            | u64    | 8    | De max index of NFTs dat append to de uwi     |     |
| min            | u64    | 8    | De minyimum index of NFTs dat append to de uwi |     |
| amount         | u64    | 8    | De token cost to swap                           |     |
| fee_amount     | u64    | 8    | De token fee fow captuwing de NFT              |     |
| sow_fee_amount | u64    | 8    | De sow fee fow captuwing de NFT                |     |
| count          | u64    | 8    | De totaw nyumbew of swaps                        |     |
| pad           | u16    | 1    | De onchain/off-chain metadata update pad       |     |
| bump           | u8     | 1    | De escwow bump                                  |     |

{% /totem-accowdion %}
{% /totem %}
