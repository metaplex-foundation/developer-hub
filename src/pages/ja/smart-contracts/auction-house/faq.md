---
title: FAQ
metaTitle: FAQ | Auction House
description: "Auction HouseのFAQ"
---

## 自分のAuction HouseでNFTが販売されたときに手数料を受け取れますか？
はい、Auction Houseは`seller fee basis points`を取得するように設定できます。これは、createおよびupdateコマンドの一部です。CLIの使用例を参照してください。

手数料はクリエイターに支払われ、次にAuction House、そして販売者が販売の残りを受け取ります。これは、NFTロイヤリティ、販売価格、Auction House手数料を取得し、バイヤーに総利益を表示することで、UI上で簡単に計算できます。

## Auction Houseは、ユーザーが別の非Auction Houseマーケットプレイスで自分のNFTを販売することを制限しますか？
いいえ、Auction Houseは、販売中のリスティングがあっても、ユーザーがNFTを送信することを止めることはできません。これが発生した場合、`execute_sale`操作は失敗し、バイヤーは入札をキャンセルすることで資金を取り戻すことができます。
Auction Houseエクスペリエンスを作成するマーケットプレイスは、Buy/Sell trade stateアカウントを追跡し、販売者のTokenAccountsを監視する必要があります。これにより、元の販売者から転送されたNFTのリスティングと入札を自動的にキャンセルできます。

具体的には、マーケットプレイスは現在、以下を保存する必要があります：

1. Trade Stade Account Keys
2. Trade Stateのシードの一部であるToken SizeとPrice
3. trade stateに保存されているToken Account Keys
4. Auction House Receipts (Listing Receipts、Bid Receipts、Purchase Receipts)

具体的には、マーケットプレイスはToken Accountsでこれら2つのイベントを追跡する必要があります：

1. 所有権がNFTの元の販売者から変更された
2. Token Account Amountが0に変更された

これらのイベントが発生した場合、Auction House Authorityは、販売者またはバイヤーが立ち会う必要なく、入札とリスティングをキャンセルする指示を呼び出すことができます。

## 人々は自分のAuction Houseの設定を見ることができますか？
はい、誰でもあなたのAuction Houseの設定、特に`Can Change Sale Price`パラメータを確認できますし、確認すべきです。
これは、CLIの`show`コマンドで実行できます。

## Auction Houseは自分のNFTの販売価格を変更できますか？
はい、ただし特定のシナリオに限ります。Auction Houseがこの機能を使用できるようにするには、以下の条件が必要です：

1. Auction Houseインスタンスで`Can Change Sale Price`が`true`に設定されている必要があります
2. NFT販売者は、NFTを価格0で販売リストする必要があります。

{% callout type="warning" %}
Auction Houseは、あなたがキーでトランザクションに署名した場合のみ0で販売できますが、現在、任意に低い価格、例えば1 lamportで販売できます。信頼できるAuction Houseでのみリストすることが重要です。
{% /callout %}

3. Auction Houseは、#2で作成した`0`価格のtrade stateを使用して、異なる価格で新しい`sale`リスティングを作成できます。

## パブリック入札とプライベート入札の違いは何ですか？
標準入札は、プライベート入札とも呼ばれ、オークション固有の入札を指します。オークションが完了すると、入札はキャンセルされ、エスクローの資金は入札者に返金されます。ただし、Auction Houseは、特定のオークションではなくトークン自体に固有のパブリック入札もサポートしています。つまり、入札はオークションの終了を超えてアクティブなままで、そのトークンの後続のオークションの基準を満たせば解決できます。

例：
1. AliceがToken Aに1 SOLのパブリック入札を行います。
2. BobもToken Aに2 SOLで入札します。
3. Bobがオークションに勝ち、Token Aの新しい所有者になります。
4. 1週間後、BobはToken Aをオークションに出品しますが、新しい入札者はいません。
5. Aliceはパブリック入札をキャンセルしなかったため、彼女の入札がToken Aの新しいオークションで唯一の入札となり、彼女がオークションに勝ちます。
