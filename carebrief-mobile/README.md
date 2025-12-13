# CareBrief Mobile - Expo Router版

介護記録アプリ CareBrief のモバイル版です。最新の **Expo SDK 52** と **Expo Router v4** を使用しています。

## 機能

1. **患者選択** - 担当患者を選択して記録画面へ
2. **ログ作成** - 音声入力またはテキストで介護記録を作成
3. **AI要約編集** - APIからの要約をTextInputで編集
4. **目標管理** - ケア目標の確認・完了ステータス更新

## 技術スタック

- **Expo SDK**: 52.0.0
- **Expo Router**: 4.0.11 (ファイルベースルーティング)
- **React Native**: 0.76.3
- **TypeScript**: 5.3.0

## デザインシステム

- **Aesthetic**: Warm Minimalism（北欧風ミニマリズム）
- **カラー**: Sage（#5D8A72ベース）
- **フォント**: システムフォント + カスタム可能
- **アイコン**: Feather Icons（@expo/vector-icons）

## セットアップ

### 1. Node.js のインストール
Node.js 18以上が必要です。

### 2. 依存関係のインストール

```bash
cd carebrief-mobile
npm install
```

### 3. Expo Go アプリのインストール
スマートフォンに Expo Go アプリをインストールしてください：
- iOS: App Store から「Expo Go」をダウンロード
- Android: Google Play から「Expo Go」をダウンロード

### 4. アプリの起動

```bash
npx expo start
```

QRコードが表示されるので、Expo Go アプリでスキャンしてください。

## プロジェクト構成 (Expo Router)

```
carebrief-mobile/
├── app/                           # Expo Router - ファイルベースルーティング
│   ├── _layout.tsx               # ルートレイアウト
│   ├── index.tsx                 # 患者選択画面 (/)
│   └── (tabs)/                   # タブグループ
│       ├── _layout.tsx           # タブナビゲーション
│       ├── log.tsx               # 記録作成画面
│       └── goals.tsx             # 目標管理画面
├── components/                    # 共有コンポーネント
│   ├── PatientCard.tsx
│   ├── GoalCard.tsx
│   ├── LogCard.tsx
│   ├── VoiceRecorder.tsx
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/                     # 定数・設定
│   ├── Colors.ts                 # デザインシステム
│   ├── Data.ts                   # モックデータ
│   └── PatientContext.tsx        # 患者選択コンテキスト
├── hooks/                        # カスタムフック
│   └── useColorScheme.ts
├── assets/                       # アセット
│   ├── images/
│   └── fonts/
├── app.json                      # Expo設定
├── package.json
├── tsconfig.json
└── babel.config.js
```

## 画面フロー

```
/ (index.tsx) - 患者選択画面
         │
         ▼
/(tabs) - タブナビゲーション
    ├── /log - 記録作成タブ
    │   ├── 音声入力モード
    │   ├── 処理中モード
    │   └── 編集モード
    │
    └── /goals - 目標管理タブ
        ├── フィルター (進行中/達成済み/すべて)
        └── 目標カード (展開可能)
```

## Expo Router の特徴

- **ファイルベースルーティング**: `app/` ディレクトリ内のファイル構造がそのままURLパスになります
- **ネストされたレイアウト**: `_layout.tsx` でレイアウトを階層的に定義
- **タイプセーフなナビゲーション**: `router.push()` が型チェックされます
- **自動ディープリンク**: スキーム（`carebrief://`）で直接画面にアクセス可能

## API統合（予定）

現在はモックデータを使用しています。本番環境では以下のAPIと連携予定：

- **音声認識**: OpenAI Whisper API
- **要約・構造化**: Claude API (claude-sonnet-4-20250514)
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth

## 要注意フラグ

| レベル | 色 | 例 |
|--------|-----|-----|
| 赤（高） | #D9534F | 服薬漏れ連続、転倒リスク |
| 黄（中） | #D4A03C | 夜間トイレ増加、食事量減少 |
| なし | - | 安定 |

## トラブルシューティング

### Expo Go で接続できない場合

1. PCとスマートフォンが同じWiFiネットワークに接続されていることを確認
2. `npx expo start --tunnel` でトンネルモードを試す
3. ファイアウォールで Expo のポート（8081）が許可されていることを確認

### 音声録音が動作しない場合

1. Expo Go にマイクの権限が付与されていることを確認
2. 実機でテストしてください（シミュレータでは制限あり）

### Metro Bundler のエラー

```bash
# キャッシュをクリアして再起動
npx expo start -c
```

## ライセンス

Private - Hackathon Project
