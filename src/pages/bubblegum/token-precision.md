---
title: Token Precision
metaTitle: Token Precision | Bakstag
description: Learn what token precision Bakstag uses.
---

We support tokens with varying decimal precisions, depending on the blockchain and token standard. {% .lead %}

Standard degree of divisibility:

| **Token** | **Decimals** |
|-----------|--------------|
| ERC20     | 18           |
| ETH       | 18           |
| TRC20     | 18           |
| TRX       | 6            |
| SOL       | 9            |
| SPL       | 6            |
| TON       | 9            |
| JETTON    | 9            |



**20** whole tokens are represented differently depending on the token's decimal precision. For example:
- ERC20: `20 * 10^18` (20,000,000,000,000,000,000)
- SOL: `20 * 10^9` (20,000,000,000)
- TRX: `20 * 10^6` (20,000,000)

## Shared Decimal System

When someone sells **20 ETH** for **10 SOL**, the difference in precision makes calculating the exact destination amount error-prone. To resolve this, we use a shared system based on **6** decimals, cleaning any excess precision, or "dust", that cannot be represented. Inspired by [LayerZero OFT Standard](https://docs.layerzero.network/v2/developers/evm/oft/quickstart#token-transfer-precision).


### Example

#### Create offer

An advertiser creates an offer selling **1.234567890123456789 ETH = 1,234,567,890,123,456,789** (Base) with an exchange rate of **1 ETH** to approx. **2 SOL**.

OTC Market will:

1. Get `srcDecimalConversionRate`:

```
decimalConversionRate = 10^(localDecimals − sharedDecimals) = 10^(18−6) = 10^12
```

This means the conversion rate is **10^12**, which indicates the smallest unit to sell is **10^-12** in terms of the token's local decimals.

{% dialect-switcher title="Decimal conversion rate" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function _getDecimalConversionRate(
  address _tokenAddress
) internal view virtual returns (uint256 decimalConversionRate) {
  decimalConversionRate = _tokenAddress == address(0)
    ? 10 ** 12 // native (1 for TRON)
    : 10 ** (ERC20(_tokenAddress).decimals() - SHARED_DECIMALS); // fungible token
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
pub fn get_decimal_conversion_rate(token_mint: Option<&InterfaceAccount<Mint>>) -> u64 {
  if let Some(token_mint) = token_mint {
      (10u64).pow((token_mint.decimals - Self::SHARED_DECIMALS) as u32)
  } else {
      (10u64).pow((9u8 - Self::SHARED_DECIMALS) as u32)
  }
}
```
{% /dialect %}
{% /dialect-switcher %}

2. Divide by `decimalConversionRate`:
```
1234567890123456789 / 10^12 = 1234567.890123456789 = 1234567
```

{% callout title="TIP" type="note" %}
Remember that solidity performs integer arithmetic. This means when you divide two integers, the result is also an integer with the fractional part discarded. If token decimals is lower than shared decimals, an underflow error is thrown.
{% /callout %}

This is equivalent to converting from local to shared decimals:

{% dialect-switcher title="To shared decimals" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
import { SafeCast } from "@openzeppelin/contracts/utils/math/SafeCast.sol";

function toSD(uint256 _amountLD, uint256 _decimalConversionRate) internal pure returns (uint64 amountSD) {
  amountSD = SafeCast.toUint64(_amountLD / _decimalConversionRate);
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
pub fn ld2sd(amount_ld: u64, decimal_conversion_rate: u64) -> u64 {
  amount_ld / decimal_conversion_rate
}
```
{% /dialect %}
{% /dialect-switcher %}

3. Multiply by `decimalConversionRate`:
```
1234567 * 10^12 = 1234567000000000000
```

This is equivalent to converting from shared to local decimals:

{% dialect-switcher title="To local decimals" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function toLD(uint64 _amountSD, uint256 _decimalConversionRate) internal pure returns (uint256 amountLD) {
  amountLD = _amountSD * _decimalConversionRate;
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
pub fn sd2ld(amount_sd: u64, decimal_conversion_rate: u64) -> u64 {
  amount_sd * decimal_conversion_rate
}
```
{% /dialect %}
{% /dialect-switcher %}

This process removes the last 12 digits from the original amount, effectively "cleaning" the amount from any "dust" that cannot be represented in a system with 6 decimal places.

{% dialect-switcher title="Dust removal" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function _removeDust(
  uint256 _amountLD,
  address _tokenAddress
) private view returns (uint64 amountSD, uint256 amountLD) {
  uint256 srcDecimalConversionRate = _getDecimalConversionRate(_tokenAddress);

  amountSD = _amountLD.toSD(srcDecimalConversionRate);
  amountLD = amountSD.toLD(srcDecimalConversionRate);
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
pub fn remove_dust(amount_ld: u64, decimal_conversion_rate: u64) -> (u64, u64) {
  let amount_sd = Self::ld2sd(amount_ld, decimal_conversion_rate);
  let amount_ld = Self::sd2ld(amount_sd, decimal_conversion_rate);

  (amount_sd, amount_ld)
}
```
{% /dialect %}
{% /dialect-switcher %}

4. Store **source amount** and **exchange rate** in shared decimals. Lock cleaned source amount in local decimals in the [Escrow](/).

#### Accept offer

Let's say buyer wants to accept the offer in whole, **source amount = 1.234567 SOL** (**= 1234567** in shared decimals).
They provide the desired source amount in shared decimals.

OTC Market will:

1. Get `dstDecimalConversionRate`:
```
decimalConversionRate = 10^(localDecimals − sharedDecimals) = 10^(9−6) = 10^3
```

2. Calculate destination amount to take from buyer in shared decimals:
```
dstAmountSD = (srcAmountSD * exchangeRateSD) / 10**SHARED_DECIMALS
```

3. Convert destination amount from shared to local decimals

{% callout title="TIP" type="note" %}
In reality, arithmetic operations happen in a different order to ensure minimal loss from the rounding.
{% /callout %}

{% dialect-switcher title="Destination amount calculation" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function _toDstAmount(
    uint64 _srcAmountSD,
    uint64 _exchangeRateSD,
    address _tokenAddress
) internal view virtual returns (AcceptOfferReceipt memory acceptOfferReceipt) {
  uint256 dstDecimalConversionRate = _getDecimalConversionRate(_tokenAddress);

  uint256 dstAmountLD = (uint256(_srcAmountSD) * uint256(_exchangeRateSD) * dstDecimalConversionRate) /
    (10 ** SHARED_DECIMALS);

  ...
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
pub fn to_dst_amount(
  src_amount_sd: u64,
  exchange_rate_sd: u64,
  dst_token_mint: Option<&InterfaceAccount<Mint>>,
) -> AcceptOfferReceipt {
  let dst_decimal_conversion_rate = Self::get_decimal_conversion_rate(dst_token_mint);

  let dst_amount_ld = (src_amount_sd * exchange_rate_sd * dst_decimal_conversion_rate)
      / (10u64).pow(Self::SHARED_DECIMALS as u32); // TODO: check for overflow

  ...
}
```
{% /dialect %}
{% /dialect-switcher %}