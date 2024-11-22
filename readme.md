# Cloud Messagingサーバー - API 仕様書

このドキュメントでは、Firebase Cloud Messagingを使用したメッセージングAPIのエンドポイントと、Firebase認証について説明します。

---

## 認証

このAPIを利用するには、すべてのリクエストにFirebase認証によるBearerトークンを含める必要があります。

### 認証方法

- **ヘッダー**

  ```
  Authorization: Bearer {Firebase IDトークン}
  ```

- **Firebase IDトークンの取得方法**

  クライアントアプリ（モバイルアプリやウェブアプリ）でユーザーが認証後に取得できるFirebase IDトークンを使用します。

- **注意事項**

  - トークンが無効または期限切れの場合、`403 Forbidden` エラーが返されます。

---

## エンドポイント一覧

- POST /send
- POST /multicast
- POST /topic
- POST /subscribe
- POST /unsubscribe

---

## POST /send

指定したデバイス（FCMトークン）に通知メッセージを送信します。

### 認証

このエンドポイントは認証が必要です。

### リクエスト

- **ヘッダー**

  ```
  Content-Type: application/json
  Authorization: Bearer {Firebase IDトークン}
  ```

- **ボディ**

  ```json
  {
    "title": "string",
    "body": "string",
    "token": "string"
  }
  ```

  - `title`: メッセージのタイトル。
  - `body`: メッセージの本文。
  - `token`: 送信先デバイスのFCMトークン。

### レスポンス

- **成功時（200 OK）**

  ```json
  {
    "name": "string"
  }
  ```

  - 

name

: メッセージの一意識別子。

- **エラー時**

  - `400 Bad Request`: 無効なリクエストデータ（例：トークンが未指定）。
  - `403 Forbidden`: 認証に失敗した場合（無効なまたは欠落したトークン）。
  - `500 Internal Server Error`: サーバー内部でエラーが発生した場合。

---

## POST /multicast

複数のデバイス（複数のFCMトークン）に通知メッセージを送信します。

### 認証

このエンドポイントは認証が必要です。

### リクエスト

- **ヘッダー**

  ```
  Content-Type: application/json
  Authorization: Bearer {Firebase IDトークン}
  ```

- **ボディ**

  ```json
  {
    "title": "string",
    "body": "string",
    "tokens": ["string"]
  }
  ```

  - `title`: メッセージのタイトル。
  - `body`: メッセージの本文。
  - `tokens`: 送信先デバイスのFCMトークンの配列。

### レスポンス

- **成功時（200 OK）**

  ```json
  {
    "responses": [
      {
        "success": true,
        "messageId": "string"
      },
      {
        "success": false,
        "error": {
          "code": "string",
          "message": "string"
        }
      }
    ],
    "successCount": number,
    "failureCount": number
  }
  ```

  - `responses`: 各トークンへのメッセージ送信結果の配列。
    - `success`: メッセージの送信が成功したかどうか。
    - `messageId`: メッセージの一意識別子（成功時）。
    - 

error

: エラー情報（失敗時）。
      - `code`: エラーコード。
      - `message`: エラーメッセージ。
  - `successCount`: 送信に成功したトークンの数。
  - `failureCount`: 送信に失敗したトークンの数。

- **エラー時**

  - `400 Bad Request`: 無効なリクエストデータ（例：トークンが未指定）。
  - `403 Forbidden`: 認証に失敗した場合。
  - `500 Internal Server Error`: サーバー内部でエラーが発生した場合。

---

## POST /topic

指定したトピックに通知メッセージを送信します。

### 認証

このエンドポイントは認証が必要です。

### リクエスト

- **ヘッダー**

  ```
  Content-Type: application/json
  Authorization: Bearer {Firebase IDトークン}
  ```

- **ボディ**

  ```json
  {
    "title": "string",
    "body": "string",
    "topic": "string"
  }
  ```

  - `title`: メッセージのタイトル。
  - `body`: メッセージの本文。
  - `topic`: メッセージを送信するトピック名。

### レスポンス

- **成功時（200 OK）**

  ```json
  {
    "messageId": "string"
  }
  ```

  - `messageId`: メッセージの一意識別子。

- **エラー時**

  - `400 Bad Request`: 無効なトピックが指定された場合。
  - `403 Forbidden`: 認証に失敗した場合。
  - `500 Internal Server Error`: サーバー内部でエラーが発生した場合。

---

## POST /subscribe

デバイス（FCMトークン）を指定したトピックに登録します。

### 認証

このエンドポイントは認証が必要です。

### リクエスト

- **ヘッダー**

  ```
  Content-Type: application/json
  Authorization: Bearer {Firebase IDトークン}
  ```

- **ボディ**

  ```json
  {
    "tokens": ["string"],
    "topic": "string"
  }
  ```

  - `tokens`: 登録するデバイスのFCMトークンの配列。
  - `topic`: 登録するトピック名。

### レスポンス

- **成功時（200 OK）**

  ```json
  {
    "successCount": number,
    "failureCount": number,
    "errors": [
      {
        "index": number,
        "reason": "string",
        "message": "string"
      }
    ]
  }
  ```

  - `successCount`: 登録に成功したトークンの数。
  - `failureCount`: 登録に失敗したトークンの数。
  - `errors`: エラー情報の配列。
    - `index`: エラーが発生したトークンのインデックス。
    - `reason`: エラー理由。
    - `message`: エラーメッセージ。

- **エラー時**

  - `400 Bad Request`: 無効なトピックまたはトークンが指定された場合。
  - `403 Forbidden`: 認証に失敗した場合。
  - `500 Internal Server Error`: サーバー内部でエラーが発生した場合。

---

## POST /unsubscribe

デバイス（FCMトークン）を指定したトピックから解除します。

### 認証

このエンドポイントは認証が必要です。

### リクエスト

- **ヘッダー**

  ```
  Content-Type: application/json
  Authorization: Bearer {Firebase IDトークン}
  ```

- **ボディ**

  ```json
  {
    "tokens": ["string"],
    "topic": "string"
  }
  ```

  - `tokens`: 解除するデバイスのFCMトークンの配列。
  - `topic`: 解除するトピック名。

### レスポンス

- **成功時（200 OK）**

  ```json
  {
    "successCount": number,
    "failureCount": number,
    "errors": [
      {
        "index": number,
        "reason": "string",
        "message": "string"
      }
    ]
  }
  ```

  - `successCount`: 解除に成功したトークンの数。
  - `failureCount`: 解除に失敗したトークンの数。
  - `errors`: エラー情報の配列。
    - `index`: エラーが発生したトークンのインデックス。
    - `reason`: エラー理由。
    - `message`: エラーメッセージ。

- **エラー時**

  - `400 Bad Request`: 無効なトピックまたはトークンが指定された場合。
  - `403 Forbidden`: 認証に失敗した場合。
  - `500 Internal Server Error`: サーバー内部でエラーが発生した場合。

---

## 共通エラーレスポンス

- **400 Bad Request**

  ```json
  {
    "error": {
      "code": "invalid-argument",
      "message": "Invalid request data"
    }
  }
  ```

- **403 Forbidden**

  ```json
  {
    "error": {
      "code": "unauthorized",
      "message": "Authentication failed"
    }
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": {
      "code": "internal",
      "message": "Internal server error"
    }
  }
  ```

---

## 注意事項

- すべてのリクエストは `Content-Type: application/json` と `Authorization: Bearer {Firebase IDトークン}` ヘッダーを含める必要があります。
- トピック名には英数字とアンダースコアのみ使用可能です。
- Firebase IDトークンはFirebase Authenticationを使用してクライアント側で取得してください。
- レスポンスの詳細はFirebase Admin SDKのMessagingモジュールに準拠しています。

---