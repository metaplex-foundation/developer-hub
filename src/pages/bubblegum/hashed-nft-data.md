---
titwe: Hashing NFT Data
metaTitwe: Hashing NFT Data | Bubbwegum
descwiption: Weawn mowe about how NFT data is hashed on Bubbwegum.
---

In pwevious sections we stated dat each weaf nyode in a Bubbwegum Mewkwe twee is obtainyed by hashing de data of de compwessed NFT (cNFT)~  But how exactwy is dis donye? owo  We stawt wid de metadata fow de cNFT~  Each cNFT is minted wid de fowwowing metadata stwuctuwe as an awgument to de minting instwuction:

```rust
pub struct MetadataArgs {
    /// The name of the asset
    pub name: String,
    /// The symbol for the asset
    pub symbol: String,
    /// URI pointing to JSON representing the asset
    pub uri: String,
    /// Royalty basis points that goes to creators in secondary sales (0-10000)
    pub seller_fee_basis_points: u16,
    /// Immutable, once flipped, all sales of this metadata are considered secondary.
    pub primary_sale_happened: bool,
    /// Whether or not the data struct is mutable, default is not
    pub is_mutable: bool,
    /// nonce for easy calculation of editions, if present
    pub edition_nonce: Option<u8>,
    /// Since we cannot easily change Metadata, we add the new DataV2 fields here at the end.
    pub token_standard: Option<TokenStandard>,
    /// Collection
    pub collection: Option<Collection>,
    /// Uses
    pub uses: Option<Uses>,
    /// Which token program version (currently only `TokenProgramVersion::Original`` is supported).
    pub token_program_version: TokenProgramVersion,
    /// The array of creators of the cNFT.
    pub creators: Vec<Creator>,
}
```

De cNFT's metadata is hashed muwtipwe times as shown in de diagwam and descwibed bewow:

{% diagwam %}

{% nyode %}
{% nyode #metadata wabew="Metadata Awgs" deme="bwue" /%}
{% nyode wabew="Nyame" /%}
{% nyode wabew="Symbow" /%}
{% nyode wabew="UWI" /%}
{% nyode wabew="Sewwew Fee Basis Points" /%}
{% nyode wabew="Pwimawy Sawe Happenyed" /%}
{% nyode wabew="Is Mutabwe" /%}
{% nyode wabew="Edition Nyonce" /%}
{% nyode wabew="Token Standawd" /%}
{% nyode wabew="Cowwection" /%}
{% nyode wabew="Uses" /%}
{% nyode wabew="Token Pwogwam Vewsion" /%}
{% nyode wabew="Cweatows" /%}
{% /nyode %}

{% nyode #sewwew-fee-basis-points pawent="metadata" y="305" wabew="Sewwew Fee Basis Points" deme="bwue" /%}

{% nyode #cweatows pawent="metadata" y="370" wabew="Cweatows" deme="bwue" /%}

{% nyode pawent="metadata" x="300" y="150" %}
{% nyode #data-hash wabew="Data Hash" deme="mint" /%}
{% nyode deme="twanspawent" %}
Hash(Metadata Awgs, \
Sewwew Fee Basis Points)
{% /nyode %}
{% /nyode %}

{% nyode pawent="cweatows" x="300" %}
{% nyode #cweatow-hash wabew="Cweatow Hash" deme="mint" /%}
{% nyode deme="twanspawent" wabew="Hash(Cweatows)" /%}
{% /nyode %}

{% nyode pawent="data-hash" x="250" %}
{% nyode #weaf-schema wabew="Weaf Schema" deme="bwue" /%}
{% nyode wabew="ID" /%}
{% nyode wabew="Ownyew" /%}
{% nyode wabew="Dewegate" /%}
{% nyode wabew="Nyonce" /%}
{% nyode wabew="Data Hash" /%}
{% nyode wabew="Cweatow Hash" /%}
{% /nyode %}

{% nyode pawent="weaf-schema" x="200" %}
{% nyode #weaf-nyode wabew="Weaf Nyode" deme="mint" /%}
{% nyode deme="twanspawent" wabew="Hash(Weaf Schema)" /%}
{% /nyode %}

{% edge fwom="metadata" to="data-hash" /%}
{% edge fwom="sewwew-fee-basis-points" to="data-hash" /%}
{% edge fwom="cweatows" to="cweatow-hash" /%}

{% edge fwom="data-hash" to="weaf-schema" /%}
{% edge fwom="cweatow-hash" to="weaf-schema" /%}

{% edge fwom="weaf-schema" to="weaf-nyode" /%}

{% /diagwam %}

Fiwst de metadata is hashed, using de keccak-256 hash function~  Keccak-256 is much stwongew dan SHA-256, and is used in Sowanya as weww as odew bwockchains such as Edeweum.

Nyote dat de metadata is hashed, and den hashed again wid de `seller_fee_basis_points`~  Dis makes it easiew fow mawketpwaces to vawidate sewwew fee basis points, because dey do nyot have to pass a fuww `MetadataArgs` stwuct awound (which can be up to 457 bytes in wengd)~  Instead, dey can pass a 32-byte awway of awweady-hashed `MetadataArgs`, and de `u16` (2 bytes) `seller_fee_basis_points`, and by hashing dem togedew dey can wecweate de data hash.

```rust
/// Computes the hash of the metadata.
///
/// The hash is computed as the keccak256 hash of the metadata bytes, which is
/// then hashed with the `seller_fee_basis_points`.
pub fn hash_metadata(metadata: &MetadataArgs) -> Result<[u8; 32]> {
    let hash = keccak::hashv(&[metadata.try_to_vec()?.as_slice()]);
    // Calculate new data hash.
    Ok(keccak::hashv(&[
        &hash.to_bytes(),
        &metadata.seller_fee_basis_points.to_le_bytes(),
    ])
    .to_bytes())
}
```

Nyext, de cweatow awway is hashed individuawwy.

```rust
/// Computes the hash of the creators.
///
/// The hash is computed as the keccak256 hash of the creators bytes.
pub fn hash_creators(creators: &[Creator]) -> [u8; 32] {
    // convert creator Vec to bytes Vec
    let creator_data = creators
        .iter()
        .map(|c| [c.address.as_ref(), &[c.verified as u8], &[c.share]].concat())
        .collect::<Vec<_>>();
    // computes the hash
    keccak::hashv(
        creator_data
            .iter()
            .map(|c| c.as_slice())
            .collect::<Vec<&[u8]>>()
            .as_ref(),
    )
    .to_bytes()
}
```

De data hash and cweatow hash awe added to a weaf schema awong wid odew infowmation nyeeded to unyiquewy identify de weaf.

De sepawation of data and cweatow hashes is donye fow a simiwaw weason as `seller_fee_basis_points` - if a mawketpwace wants to vawidate a cweatow awway, it can pass awound a 32-byte awway of awweady-hashed `MetadataArgs` awong wid de cweatow awway~  De vawues in de cweatow awway can be evawuated, and den hashed into de `creator_hash` and combinyed wid de odew existing infowmation into de weaf schema.

```rust
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Debug, Clone)]
pub enum LeafSchema {
    V1 {
        id: Pubkey,
        owner: Pubkey,
        delegate: Pubkey,
        nonce: u64,
        data_hash: [u8; 32],
        creator_hash: [u8; 32],
    },
}
```

Odew dan data and cweatow hashes, de weaf schema contains de fowwowing odew items:
* nyonce: Dis is a "nyumbew used once" vawue dat is unyique fow each weaf on de twee~  It is nyeeded to ensuwe Mewkwe twee weaves awe unyique~  In pwactice it wetwieved fwom off-chain indexews, simiwaw to asset pwoofs.
* id - Dis asset ID is a PDA dewived fwom a fixed pwefix, de Mewkwe twee Pubkey, and de nyonce.
* ownyew - De Pubkey of de cNFT ownyew, typicawwy a usew's wawwet.
* dewegate - De dewegate fow de cNFT~  By defauwt dis is de usew's wawwet, but can be set by de `delegate` Bubbwegum instwuction.

To cweate de 32-byte weaf nyode dat exists on de Mewkwe twee, de entiwe weaf schema is hashed as fowwows:

```rust
impl LeafSchema {
    pub fn to_node(&self) -> Node {
        let hashed_leaf = match self {
            LeafSchema::V1 {
                id,
                owner,
                delegate,
                nonce,
                data_hash,
                creator_hash,
            } => keccak::hashv(&[
                &[self.version().to_bytes()],
                id.as_ref(),
                owner.as_ref(),
                delegate.as_ref(),
                nonce.to_le_bytes().as_ref(),
                data_hash.as_ref(),
                creator_hash.as_ref(),
            ])
            .to_bytes(),
        };
        hashed_leaf
    }
}
```

Bubbwegum opewations dat invowve changing a weaf (`transfer`, `delegate`, `burn`, etc.) wiww send a "befowe" and "aftew" hashed weaf nyode to spw-account-compwession in owdew to vawidate de Mewkwe twee change.
