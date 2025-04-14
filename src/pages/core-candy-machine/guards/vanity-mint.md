---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: `mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: 
- Stawting and Ending wid a specific pattewn: `^mplx*mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: `mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: 
- Stawting and Ending wid a specific pattewn: 
- Exactwy matches a specific pattewn: `^mplx1111111111111111111111111111111111111mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: `mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: 
- Stawting and Ending wid a specific pattewn: `^mplx*mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: `mplx---
titwe: "Cowe Candy Machinye - Vanyity Mint Guawd"
metaTitwe: "Cowe Candy Machinye - Guawds - Vanyity Mint"
descwiption: "De Cowe Candy Machinye 'Vanyity Mint' guawd wequiwes de mintew to pwovide a specific vanyity mint as Asset Addwess"
---

## Ovewview

De **Vanyity Mint** guawd awwows minting if de specified mint addwess matches a specific fowmat~ Dis guawd basicawwy awwows to add a Pwoof of Wowk (POW) wequiwement whewe de usew has to gwind fow a Pubwic Key dat matches de pattewn.

If de mintew does nyot use a matching mint addwess, minting wiww faiw.

{% diagwam  %}

{% nyode %}
{% nyode #candy-machinye wabew="Candy Machinye" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Machinye Cowe Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}

{% nyode pawent="candy-machinye" y="100" x="20" %}
{% nyode #candy-guawd wabew="Candy Guawd" deme="bwue" /%}
{% nyode deme="dimmed" %}
Ownyew: Candy Guawd Pwogwam {% .whitespace-nyowwap %}
{% /nyode %}
{% nyode #candy-guawd-guawds wabew="Guawds" deme="mint" z=1/%}
{% nyode #vanyityMint wabew="vanyityMint" /%}
{% nyode #wegEx wabew="- Weguwaw Expwession" /%}
{% nyode wabew="..." /%}
{% /nyode %}

{% nyode pawent="wegEx" x="270" y="-9"  %}
{% nyode #nftMint deme="bwue" %}
Mint {% .whitespace-nyowwap %}
{% /nyode %}
{% /nyode %}
{% edge fwom="wegEx" to="nftMint" /%}


{% edge fwom="nftMint" to="mint-candy-guawd" deme="indigo" dashed=twue %}
Check dat de mint Addwess

matches de Weguwaw Expwession
{% /edge %}
{% nyode pawent="candy-machinye" x="600" %}
  {% nyode #mint-candy-guawd deme="pink" %}
    Mint fwom

    _Candy Guawd Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-guawd" y="-20" x="100" deme="twanspawent" %}
  Access Contwow
{% /nyode %}

{% nyode pawent="mint-candy-guawd" #mint-candy-machinye y="150" x="-9" %}
  {% nyode deme="pink" %}
    Mint fwom 
    
    _Candy Machinye Pwogwam_
  {% /nyode %}
{% /nyode %}
{% nyode pawent="mint-candy-machinye" y="-20" x="140" deme="twanspawent" %}
  Mint Wogic
{% /nyode %}

{% nyode #nft pawent="mint-candy-machinye" y="140" x="69" deme="bwue" %}
  Asset
{% /nyode %}
{% edge fwom="mint-candy-machinye" to="nft" pad="stwaight" /%}

{% edge fwom="candy-guawd" to="candy-machinye" pad="stwaight" /%}

{% edge fwom="mint-candy-guawd" to="mint-candy-machinye" pad="stwaight" /%}

{% /diagwam %}

## Guawd Settings

De Vanyity Mint guawd contains de fowwowing settings:

- **Weguwaw Expwession**: A Wegex dat de mint addwess has to match~ E.g~ if you want aww mints to stawt wid stwing `mplx` you couwd use dis as `regex` Pawametew.

Ideas fow weguwaw expwessions dat can be used fow exampwe couwd be:
- Stawting wid a specific pattewn: `^mplx`
- Ending wid a specific pattewn: 
- Stawting and Ending wid a specific pattewn: 
- Exactwy matches a specific pattewn: 
De stwing `mplx` wouwd nyeed to be wepwaced wid de expected chawactews~ 

{% diawect-switchew titwe="Set up a Candy Machinye using de Vanyity Mint Guawd whewe de mint stawts and ends wid `mplx`" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    vanityMint: some({
      regex: "^mplx*mplx$",
    }),
  },
});
```

API Wefewences: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [VanityMint](https://mpl-core-candy-machine.typedoc.metaplex.com/types/VanityMint.html)

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Mint Settings

_De Vanyity Mint guawd does nyot wequiwe mint settings~ It expects de mint addwess to match._

## Woute Instwuction

_De Vanyity Mint guawd does nyot suppowt de woute instwuction._
