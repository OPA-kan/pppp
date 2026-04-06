# 🌸 Saki PADC 感情分析ダッシュボード

AI によってテキストから複雑な4次元感情を分析し、可視化するダッシュボードです。

## 🚀 クイックスタート

```bash
# 依存関係をインストール
npm install

# 環境変数を設定 (.env.local)
UPSTASH_REDIS_REST_URL=<your-url>
UPSTASH_REDIS_REST_TOKEN=<your-token>

# 開発サーバー起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセス

---

## 📚 ドキュメント

| ドキュメント | 説明 |
|------------|------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 📖 5分でわかる使い方ガイド |
| **[FEATURES.md](./FEATURES.md)** | ✨ 全機能の詳細説明 |
| **[PADC_GUIDE.md](./PADC_GUIDE.md)** | 🧠 PADC スコアの詳細解説 |
| **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** | 🎨 UI/UX デザインガイド |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | 🔧 実装の詳細サマリー |

---

## ✨ 主な機能

### 1. 感情解釈パネル 🎯
- テキストから自動的に感情を判定
- 🎉 興奮・喜び / 😊 満足・リラックス / 😰 不安・ストレス / 😢 悲しみ・落ち込み
- ポジティブ/ニュートラル/ネガティブ のセンチメント表示
- 感情の強度レベル表示

### 2. レーダーチャート 📊
Recharts による4次元感情の可視化
- P(快感度)、A(覚醒度)、D(支配性)、C(確信度)
- リアルタイム アニメーション表示
- パーセンテージ表示

### 3. フィードバック統計 📈
- 総分析数、正解数、誤解数
- **正解率をパーセンテージで大きく表示**
- プログレスバーと円形グラフ

### 4. 分析履歴 📝
- すべての分析結果を日時順に表示
- スコアとフィードバック状態を記録
- 最大50件まで保存

---

## 🎨 UI/UX 強化

- ✅ TailwindCSS による最新スタイリング
- ✅ グラデーション背景 (紫→ピンク→青)
- ✅ スムーズなアニメーション
- ✅ レスポンシブデザイン (モバイル対応)
- ✅ ホバーエフェクト
- ✅ 色分けされたスコア表示

---

## 🧠 PADC スコア解説

### 4つの感情次元

| スコア | 説明 | 範囲 |
|-------|------|------|
| **P_Valence** | 快感度 (快い↔不快) | 0.0 ~ 1.0 |
| **A_Strength** | 覚醒度 (興奮↔リラックス) | 0.0 ~ 1.0 |
| **D_Extent** | 支配性 (支配的↔受動的) | 0.0 ~ 1.0 |
| **C_Certainty** | 確信度 (確信↔不確実) | 0.0 ~ 1.0 |

詳細は [PADC_GUIDE.md](./PADC_GUIDE.md) を参照

---

## 📁 プロジェクト構成

```
app/
├── page.tsx                    ← メインページ (完全リデザイン)
├── layout.tsx                  ← ルートレイアウト
├── globals.css                 ← グローバルスタイル
├── components/
│   ├── EmotionDisplay.tsx      ← 感情解釈パネル
│   ├── ScoreRadarChart.tsx     ← レーダーチャート
│   └── AccuracyStats.tsx       ← 統計表示
├── utils/
│   └── padcInterpreter.ts      ← PADC解釈ユーティリティ
└── api/
    ├── analyze/route.ts        ← 分析API
    ├── feedback/route.ts       ← フィードバックAPI
    └── logs/route.ts           ← ログAPI
```

---

## 🛠 技術スタック

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Visualization**: Recharts
- **Backend**: Next.js API Routes
- **Database**: Upstash Redis
- **AI API**: Saki PADC

---

## 💡 使用例

### テキスト: 「今日のプレゼン最高だった！」

**分析結果:**
```
P_Valence:  0.85 (85%)  ✓ 快い
A_Strength: 0.80 (80%)  ✓ 興奮
D_Extent:   0.75 (75%)  ✓ 支配的
C_Certainty: 0.90 (90%) ✓ 確信

判定: 🎉 興奮・喜び
センチメント: ポジティブ 🌟
強度: 非常に強い 💥
```

---

## 📱 対応ブラウザ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔐 環境変数

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

[Upstash](https://upstash.com) から取得してください

---

## 🚀 デプロイ

### Vercel へのデプロイ

```bash
npm run build
vercel deploy
```

---

## 🤝 貢献

バグ報告や改善提案は Issue で！

---

## 📄 ライセンス

MIT

---

**🎉 Saki PADC ダッシュボードへようこそ！**
