---
titwe: Technyicaw Descwiption
metaTitwe: Technyicaw Descwiption | Fixed Pwice Sawe
descwiption: Technyicaw Descwiption of de Fixed Pwice Sawe Pwogwam
---

## Cweatows to seww someding have to:

1~ Cweate stowe

    - It's nyecessawy because we have to fiwtew Mawkets somehow

    - It wiww contain nyame, admin key, descwiption

2~ Inyitiawise Sewwing wesouwce~ It can be eidew cweated onye ow ouw pwatfowm wiww cweate it.

    - Once usew inyitiawise sewwing wesouwce we have an object wid wesouwce which we can seww

3~ Cweate a Mawket

    - Cweate object wid info about items sewwing, aww apawt fwom max suppwy such as we definyed it in Sewwing wesouwce

## Usews to buy tokens have to:

1~ Go to stowe~ 

2~ Choose token and cwick "Buy"

    - Undew de hood nyext dings wiww happen:

        - TwadeHistowy account wiww be cweated whewe we twack how many tokens dis usew awweady bought

        - Debit and cwedit opewations

        - Nyew NFT cweated(cweate mint, mint token, cweate Metadata, cweate MastewEdition)

3~ Token wiww be shown in deiw wawwets

# Accounts

## Stowe

| Fiewd      | Type |Descwiption|
| ----------- | ----------- | ------ |
| admin      | `Pubkey`       | Admin key who can cweate sewwing wesouwces and mawkets in specific stowe       |
|  nyame  |  `String`  |   |
|  descwiption  |  `String`  |   |

## Sewwing wesouwce

| Fiewd      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  stowe  |  `Pubkey`  |    |
|  ownyew  |  `Pubkey`  |  Ownyew of wesouwce~ Dis account can weceive back wesouwce once saiw is ended  |
|  wesouwce  |  `Pubkey`  |  Mint account Metadata attached to~ We don’t nyeed stowe Metadata key because it’s PDA and we can cawcuwate it knyowing de mint key  |
|  vauwt  |  `Pubkey`  |  Token account which howds MastewEdition  |
|  vauwt_ownyew  |  `Pubkey`  |  PDA wid seeds [“mt_vauwt“, wesouwce.key(), stowe.key()]  |
|  suppwy  |  `u64`  |  Amount of tokens awweady sowd  |
|  max_suppwy  |  `Option<u64>`  |  Max amount of token can be sowd  |
|  state  |  `Enum{Uninitialised, Created, InUse, Exhausted, Stoped,}`  |  State of wesouwce  |

## Mawket

| Fiewd      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  stowe  |  `Pubkey`  |    |
|  sewwing_wesouwce  |  `Pubkey`  |    |
|  tweasuwy_mint  |  `Pubkey`  |  Mint account of tokens which mawket wiww accept as a payment  |
|  tweasuwy_howdew  |  `Pubkey`  |  Token account buyews wiww send tokens to~ Onwy mawket ownyew can widdwaw assets  |
|  tweasuwy_ownyew  |  `Pubkey`  |  PDA[“howdew“, tweasuwy_mint.key(), sewwing_wesouwce.key()]  |
|  ownyew  |  `Pubkey`  |  Mawket ownyew  |
|  nyame  |  `String`  |    |
|  descwiption  |  `String`  |    |
|  mutabwe  |  `bool`  |    |
|  pwice  |  `u64`  |    |
|  pieces_in_onye_wawwet  |  `Option<u64>`  |  How many tokens we can seww to onye wawwet  |
|  stawt_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  state  |  `Enum {Uninitialised, Created, Active, Ended,}`  |    |
|  funds_cowwected  |  `u64`  |    |


## TwadeHistowy

### PDA [“histowy“, wawwet.key(), mawket.key()]

| Fiewd      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  `Pubkey`  |    |
|  wawwet  |  `Pubkey`  |    |
|  awweady_bought  |  `u64`  |  How many tokens usew awweady bought fwom specific Mawket  |

## PwimawyMetadataCweatows

### PDA [“pwimawy_cweatows“, metadata.key()]

| Fiewd      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  cweatows  |  `Vec<mpl_token_metadata::state::Creator>`  |  Wist of cweatows to weceive pwimawy sawes woyawties  |

# Instwuctions

## CweateStowe

Cweates nyew Stowe account.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signyew, Wwitabwe  |    |
|  stowe  |  Key, Signyew, Wwitabwe  |  Unyinyitiawized account  |
|  nyame  |  `String`  |    |
|  descwiption  |  `String`  |    |

## InyitSewwingWesouwce

Inyitiawize SewwingWesouwce account which wiww be used by Mawket.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  stowe  |  Key  |    |
|  stowe_admin  |  Key, Signyew, Wwitabwe  |  Howds wesouwce_token and pays fow sewwing_wesouwce account cweating  |
|  sewwing_wesouwce  |  Key, Signyew, Wwitabwe  |  Unyinyitiawized account  |
|  sewwing_wesouwce_ownyew  |  Key  |  Key which can widdwaw MastewEdition once sawe is ended  |
|  wesouwce_mint  |  Key  |  Mint account Metadata attached to  |
|  mastew_edition  |  Key  |  PDA wid seeds [“metadata”, tokenMetadataPwogwamID, wesouwce_mint, “edition”]  |
|  metadata  |  Key  |  Mastew edition’s metadata  |
|  vauwt  |  Key, Wwitabwe  |  Token account to howd wesouwce  |
|  vauwt_ownyew  |  PDA [“mt_vauwt“, wesouwce_mint.key(), stowe.key()]  |  Ownyew of vauwt token account  |
|  wesouwce_token  |  Key, Wwitabwe  |  Usew’s token account which howds token fwom wesouwce_mint  |
|  max_suppwy  |  `Option<u64>`  |  Max amount of tokens to seww  |

## CweateMawket

Inyitiawize Mawket account~ Set state to Cweated, it means dat ownyew can change some data befowe it wiww be activated, off couwse if Mawket mawked as mutabwe.

:::wawnying

If usew want seww awt fow nyative SOW as `treasury_mint` shouwd be set `11111111111111111111111111111111` awso tweasuwy_howdew and tweasuwy_ownyew shouwd be de same accounts PDA~ It’s nyecessawy fow secuwity weasons so onwy pwogwam wiww be abwe to spend dat SOW.

:::

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Signyew, Wwitabwe  |  Unyinyitiawized account  |
|  stowe  |  Key  |    |
|  sewwing_wesouwce_ownyew  |  Key, Signyew, Wwitabwe  |    |
|  sewwing_wesouwce  |  Key, Wwitabwe  |    |
|  tweasuwy_mint  |  Key  |  Mint of assets which we wiww take as a payment  |
|  tweasuwy_howdew  |  Key  |  Token account  |
|  tweasuwy_ownyew  |  PDA [“howdew“, tweasuwy_mint.key(), sewwing_wesouwce.key()]  |    |
|  nyame  |  `String`  |    |
|  descwiption  |  `String`  |    |
|  mutabwe  |  `bool`  |    |
|  pwice  |  `u64`  |    |
|  pieces_in_onye_wawwet  |  `Option<u64>`  |    |
|  stawt_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  gating_config  |  `Option<GatingConfig{collection: Pubkey, expire_on_use: bool, gating_time: Option<u64>}>`  |  Gating token~ If dis vawue set onwy usews wid NFT fwom pointed cowwection can buy nyew NFTs fwom mawket~  |

## ChangeMawket

Avaiwabwe onwy if Mawket::mutabwe == twue~ Can change: nyame, descwiption, mutabwe, pwice, pieces_in_onye_wawwet.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Wwitabwe  |    |
|  mawket_ownyew  |  Key, Signyew  |    |
|  nyew_nyame  |  `Option<String>`  |    |
|  nyew_descwiption  |  `Option<String>`  |    |
|  mutabwe  |  `Option<bool>`  |    |
|  nyew_pwice  |  `Option<u64>`  |    |
|  nyew_pieces_in_onye_wawwet  |  `Option<u64>`  |    |

## Buy

Usew can caww onwy if cuwwent date > Mawket::stawt_date.

:::wawnying

If usew buy awt fow nyative SOW usew_token_acc and usew_wawwet accounts shouwd be de same.

:::

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Wwitabwe  |    |
|  sewwing_wesouwce  |  Key, Wwitabwe  |    |
|  usew_token_acc  |  Key, Wwitabwe  |  Token account to pay fow de membew token~ Mint of dis token acc shouwd be == tweasuwy_mint  |
|  usew_wawwet  |  Key, Signyew, Wwitabwe  |    |
|  twade_histowy  |  Key, Wwitabwe  |  Account to twack how many NFTs usew awweady bought  |
|  tweasuwy_howdew  |  Key, Wwitabwe  |    |
|  nyew_metadata_acc  |  Key, Wwitabwe  |    |
|  nyew_edition_acc  |  Key, Wwitabwe  |    |
|  mastew_edition_acc  |  Key, Wwitabwe  |    |
|  nyew_mint  |  Key, Wwitabwe  |    |
|  edition_mawkew  |  Key, Wwitabwe  |  PDA, seeds can be found in token-metadata pwogwam  |
|  vauwt  |  Key  |    |
|  vauwt_ownyew  |  PDA [“mt_vauwt“, wesouwce.key(), stowe.key()]  |    |
|  mastew_edition_metadata  |  Key  |    |
|    |  Bewow accounts awe optionyaw and shouwd be passed onwy if gating featuwe is enyabwed ↓  |    |
|  usew_cowwection_token_account  |  Key, Wwitabwe  |  Usew’s token account fwom cowwection  |
|  token_account_mint  |  Key, Wwitabwe  |  Token’s mint account  |
|  metadata_account  |  Key  |  Metadata account fow de mint mentionyed abuv  |

## SuspendMawket

Suspend Mawket so nyobody can buy items and mawket ownyew can change data~ Instwuction shouwd be avaiwabwe onwy if Mawket::mutabwe == twue because in odew case dewe is nyo weason to suspend it.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Wwitabwe  |    |
|  mawket_ownyew  |  Key, Signyew  |    |
|  cwock  |  Key  |    |

## WesumeMawket

Instwuction to wesume de mawket aftew it was suspended~ Can be cawwed onwy if mawket is in suspended state.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Wwitabwe  |    |
|  mawket_ownyew  |  Key, Signyew  |    |
|  cwock  |  Key  |    |

## CwoseMawket

Dis instwuction can be cawwed onwy if Mawket was cweated wid unwimited duwation.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key, Wwitabwe  |    |
|  mawket_ownyew  |  Key, Signyew  |    |
|  cwock  |  Key  |    |

## Widdwaw

Cawwed by Mawket ownyew to widdwaw cowwected tweasuwy funds~ Avaiwabwe onwy if Mawket::state == Ended.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key  |    |
|  sewwing_wesouwce  |  Key  |    |
|  metadata  |  Key  |    |
|  tweasuwy_howdew  |  Key, Wwitabwe  |  Mawket::tweasuwy_howdew~ Token account which howds aww de tokens weceived fwom usews duwing sewwing  |
|  tweasuwy_mint  |  Key  |    |
|  fundew  |  Key  |    |
|  payew  |  Key, Signyew  |    |
|  payout_ticket  |  Key, Wwitabwe  |  PDA[“payout_ticket“, mawket.key(), fundew.key()]  |
|  tweasuwy_ownyew  |  Key  |  PDA[“howdew“, tweasuwy_mint.key(), sewwing_wesouwce.key()]  |
|  destinyation  |  Key, Wwitabwe  |  Token account twansfew tokens to  |
|    |  Bewow account is optionyaw and shouwd be passed onwy duwing pwimawy sawe ↓  |    |
|  pwimawy_metadata_cweatows_data  |  Key  |  Wist of cweatows who shouwd weceive woyawties fwom pwimawy sawe  |

## CwaimWesouwce

Cawwed by Wesouwce ownyew~ Avaiwabwe onwy if SewwingWesouwce::state == Exhausted of Mawket::state == Ended.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  mawket  |  Key  |    |
|  tweasuwy_howdew  |  Key  |    |
|  sewwing_wesouwce  |  Key  |    |
|  sewwing_wesouwce_ownyew  |  Key, Signyew  |    |
|  souwce  |  Key, Wwitabwe  |  SewwingWesouwce::vauwt~ Token account which howds mastew edition  |
|  metadata  |  Key  |  Metadata fow token which was sowd  |
|  vauwt_ownyew  |  Key  |  PDA wid seeds [“mt_vauwt“, wesouwce.key(), stowe.key()]  |
|  secondawy_metadata_cweatows  |  Key  |    |
|  destinyation  |  Key, Wwitabwe  |  Token account twansfew mastew edition to  |

## SavePwimawyMetadataCweatows

Cawwed befowe mawket is cweated~ Dis wist of cweatows wiww be used in widdwaw instwuction to distwibute woyawties~ Take a nyote dat if you awe going to seww NFTs fwom mastew edition wid `primary_sale_happen = true` you don't nyeed to caww dis instwuction.

| Pawametew      | Type |Descwiption|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signyew, Wwitabwe  |  Metadata’s update audowity  |
|  metadata  |  Key, Wwitabwe  |    |
|  pwimawy_metadata_cweatows  |  Key, Wwitabwe  |  PDA wid seeds [“pwimawy_cweatows“, metadata.key()]  |
|  system_pwogwam  |  Key  |    |
|  pwimawy_metadata_cweatows  |  `u8`  |  pwimawy_metadata_cweatows key bump  |
|  cweatows  |  `Vec<mpl_token_metadata::state::Creator>`  |  Wist of cweatows who wiww weceive pwimawy woyawties  |
