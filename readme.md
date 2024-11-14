# Unicorn Notification Server

Firebase Cloud Messagingを利用して、フロントエンドにプッシュ通知を提供するサーバーです。

## コンテナスペック

- Node.js v18.20.3
- TypeScript v5.6.3
- Express.js v4.21.1

## API仕様 

最終更新: 2024/11/14

### 共通Header
```
Content-Type:  application/json
Authorization: Bearer YOUR_ID_TOKEN
```
Authorizationに指定するTokenはFirebase認証を通過する必要があります。
認証を通過していないTokenには`403 Forbidden`を返却します。

---

### [POST] /send

**説明**

指定FCMTokenを持つ単体デバイスにメッセージを送信します。

**パラメータ**

body
```
token: <String> デバイスから発行されるFCMToken
title: <String> 通知タイトル
body:  <String> 通知本文
```

**レスポンス**

**200** : Success

**400** : Invalid token (トークン未設定)

**500** : Internal Server Error

---

### [POST] /multicast

**説明**

指定FCMTokenを持つ複数デバイスにメッセージを送信します。

**パラメータ**

body
```
tokens: <String[]> デバイスから発行されるFCMToken配列
title:  <String>   通知タイトル
body:   <String>   通知本文
```

**レスポンス**

**200** : Success

**400** : Invalid tokens (トークン未設定)

**500** : Internal Server Error

---

### [POST] /topic

**説明**

指定トピックを購読しているすべてのデバイスにメッセージを送信します。

**パラメータ**

body
```
topic: <String> トピック名
title: <String> 通知タイトル
body:  <String> 通知本文
```

**レスポンス**

**200** : Success

**400** : Invalid topic (未定義のトピック)

**500** : Internal Server Error

---

### [POST] /subscribe

**説明**

指定FCMTokenを持つデバイスに指定トピックを購読します。

**パラメータ**

body
```
tokens: <String[]> デバイスから発行されるFCMToken配列
topic:  <String>   トピック名
```

**レスポンス**

**200** : Success

**400** : Invalid tokens (トークン未設定)

**400** : Invalid topic (未定義のトピック)

**500** : Internal Server Error

---

### [POST] /unsubscribe

**説明**

指定FCMTokenを持つデバイスの指定トピック購読を解除します。

**パラメータ**

body
```
tokens: <String[]> デバイスから発行されるFCMToken配列
topic:  <String>   トピック名
```

**レスポンス**

**200** : Success

**400** : Invalid tokens (トークン未設定)

**400** : Invalid topic (未定義のトピック)

**500** : Internal Server Error
