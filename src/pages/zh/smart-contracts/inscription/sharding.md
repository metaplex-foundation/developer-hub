---
title: Inscription分片
metaTitle: 分片 | Inscription
description: 解释用于防止Inscription铸造时写锁争用的方法。
---

## Solana写锁

## 分片计数器

此排名存储在32个分片中，以防止创建新inscriptions时的写锁。这种分片允许在同一时隙中铸造多达32个Inscriptions，防止资源争用并使Inscription交易更有可能成功。
