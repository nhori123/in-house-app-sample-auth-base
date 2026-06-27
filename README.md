# in-house-app-sample-auth-base

Astro + Hono + Supabase + Cloudflare Workers で構築する業務アプリのテンプレートです。

このリポジトリは、まず Supabase Auth でログインできるところまでを土台として用意しています。ここから業務ごとの画面、API、権限制御、データ処理を追加していくことを想定しています。

## できること

- Astro で UI を構築できます
- Hono で業務 API をまとめて実装できます
- Supabase Auth でメールアドレス・パスワード認証を使えます
- Cloudflare Workers へ 1 つのアプリとしてデプロイできます
- Pico CSS を使った軽量な画面で始められます

## 含まれているもの

- `/login` のログイン画面
- `/dashboard` のログイン後画面
- `/api/login` の認証 API
- `/api/logout` のログアウト API
- `/api/me` の保護 API サンプル

`/dashboard` と `/api/me` は、ログイン済みユーザーだけが使える前提で実装されています。

## 必要な環境

- Node.js 22.12.0 以上
- Cloudflare アカウント
- Supabase アカウント

## まずやること

1. Supabase でプロジェクトを作成します
2. 認証で使うメールアドレス・パスワードを有効にします
3. `.dev.vars` を作成して環境変数を設定します
4. ローカルで起動して `/login` から動作確認します

### 環境変数

`.dev.vars` に次の 2 つを設定します。

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-publishable-key
```

`service_role` は使いません。ブラウザ側もサーバー側も、基本は公開キー前提です。

## 開発コマンド

```bash
npx astro build && npx wrangler dev
```

## 認証フロー

1. `/login` でメールアドレスとパスワードを入力します
2. フォームは `/api/login` に送信されます
3. `/api/login` で Supabase の `signInWithPassword()` を呼びます
4. 成功したら `/dashboard` に移動します
5. `/api/logout` でセッションを破棄して `/login` に戻します

保護ページでは `getUser()` を使ってログイン状態を確認します。`getSession()` ではなく `getUser()` を使う前提です。

## ルート構成

- `/` は案内用のトップページです
- `/login` はログイン画面です
- `/dashboard` はログイン後の画面です
- `/me` は認証済みユーザー情報の確認ページです
- `/api/login` はログイン処理です
- `/api/logout` はログアウト処理です
- `/api/me` は認証済み API のサンプルです

## 実装方針

### `/login`

- Supabase Auth のメールアドレス・パスワード認証を使います
- ログイン画面は Astro のページとして実装します
- 認証後は `/dashboard` に遷移します
- セッション管理は cookie ベースで扱います
- 可能な処理は SDK を優先して使い、独自実装は最小限にします

### 認証の実装メモ

- ログインフォームは Astro のページで作り、送信先は `/api/login` にします
- `/api/login` で `@supabase/ssr` を使って `signInWithPassword()` を呼びます
- ログアウトは `/api/logout` で `signOut({ scope: 'local' })` を呼びます
- 保護ページは `createSupabaseServerClient(Astro)` で `getUser()` を確認し、未ログインなら `/login` に戻します
- ページを追加するときは、同じ確認処理を入れるか、共通ヘルパーに切り出します

### 保護ページの基本形

```astro
---
import { createSupabaseServerClient } from "../lib/supabase";

const supabase = createSupabaseServerClient(Astro);
const { data, error } = await supabase.auth.getUser();

if (error || !data.user) {
	return Astro.redirect("/login");
}
---
```

## Supabase 周辺の運用方針

- ブラウザ・サーバーともに Supabase の公開キーを使います
- cookie ベースの SSR 認証を前提にします
- `getSession()` は server-side の認証判定には使わず、`getUser()` を優先します
- RLS は使わず、業務データのアクセス制御は Hono 側で行います
- Supabase のサービスロールは Hono のサーバー側のみで使い、ブラウザや Astro 側には置きません
- ロールや権限を増やす場合は、まず `user_metadata` か専用テーブルのどちらを正にするか決めます

## `/api/*`

- Hono で実装する業務 API を配置します
- UI からは同一 Workers 内の API として呼び出します
- 認証済みユーザーのみが利用できる前提で設計します
- 重いビジネスロジックはルートに直書きせず、サービス層に分けます
- 認証やクライアント生成など、SDK で置き換えられる処理は積極的に SDK を使います
- 現時点の公開 API は `/api/login` と `/api/logout` のみです
- `/api/me` は動作確認用の保護 API です。今後追加する API も、同じく Hono の共通ガードと `src/server/` 側の処理分離で実装します

## フォルダ構成

Hono で業務 API を実装しつつ、ログイン/ログアウトの認証 endpoint は Astro 側で置く前提なので、その役割が分かるように記載しています。

```text
.
├── AGENTS.md                 # 開発時のルールや手順
├── astro.config.mjs          # Astro の設定
├── package.json              # 依存関係とスクリプト
├── README.md                 # プロジェクト説明
├── public/                   # 静的ファイルの置き場
│   ├── favicon.ico           # ブラウザ用アイコン
│   ├── favicon.svg           # SVG 版アイコン
│   ├── sample200.png         # サンプル画像
│   └── style/                # 外部公開する CSS
│       └── pico.jade.min.css # Pico CSS の配布ファイル
├── src/                      # アプリ本体
│   ├── consts.ts             # 共通定数
│   ├── components/           # 共通 UI コンポーネント
│   │   ├── AnnouncementList.astro # お知らせ一覧
│   │   ├── Footer.astro      # フッター
│   │   └── Header.astro      # ヘッダー
│   ├── layouts/              # ページ共通レイアウト
│   │   └── BaseLayout.astro  # ログイン後ページ用レイアウト
│   └── pages/                # Astro のページと API 入口
│       ├── api/              # 認証 endpoint と Hono の API 入口
│       │   ├── login.ts      # Supabase Auth のログイン endpoint
│       │   ├── logout.ts     # Supabase Auth のログアウト endpoint
│       │   └── [...path].ts  # /api/* を受ける Hono のルーティング
│       ├── dashboard.astro   # ログイン後の画面
│       ├── index.astro       # ダミーのトップページ
│       └── login.astro       # ログインページ
├── tsconfig.json             # TypeScript 設定
└── wrangler.jsonc            # Cloudflare Workers 設定

```

## API 内のフォルダ構成

Hono のルート定義と業務ロジックは、ここに集約します。認証 endpoint は `src/pages/api/login.ts` と `src/pages/api/logout.ts` に置きます。`/api/me` は動作確認用の例で、今後追加する API も同じパターンで、共通ガードを通しつつ処理本体は `src/server/` に置きます。

```text
src/
├── pages/
│   └── api/
│       ├── login.ts          # Supabase Auth のログイン endpoint
│       ├── logout.ts         # Supabase Auth のログアウト endpoint
│       └── [...path].ts      # Hono の起点
└── server/                   # API の内部実装
		├── auth/                 # Hono の共有型定義
		├── middleware/           # 共通ガード
		└── services/             # 業務ロジック
```

## 実装の置き場

- UI は `src/pages/` と `src/components/` に置きます
- ログイン後ページの共通レイアウトは `src/layouts/` に置きます
- Supabase クライアントは `src/lib/supabase.ts` にまとめています
- Hono の API は `src/pages/api/[...path].ts` から起動します
- API の共通ガードや業務ロジックは `src/server/` に分けています

## ひな形として使うときの考え方

このテンプレートは、認証だけを共通基盤として持ち、業務固有の実装は追加していく前提です。

- 画面を増やすときは、ログイン確認を忘れずに入れます
- 業務 API は Hono 側に集約します
- 重いロジックはルート直書きにせず、`src/server/services/` に分けます
- 権限が増える場合は、まずどこを正にするかを決めてから実装します

## デプロイ

Cloudflare Workers 前提で動く構成です。公開前には以下を確認してください。

- `SUPABASE_URL` と `SUPABASE_KEY` が本番環境にも設定されていること
- ログイン後に必要なページが保護されていること
- `npm run build` が通ること

## 次に追加しやすいもの

- 業務一覧ページ
- CRUD API
- 権限制御
- マスタ管理画面
- 監査ログ

## 補足

このリポジトリは、実際の業務アプリに合わせて差し替えやすいように、認証と画面の骨組みだけを先に揃えています。必要に応じて `src/server/` を中心に業務実装を増やしてください。
