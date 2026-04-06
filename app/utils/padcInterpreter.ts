/**
 * PADC Score Interpreter - Advanced Emotion Classification
 * 
 * This implementation draws from major emotion classification theories:
 * - Russell's Circumplex Model (Valence × Arousal)
 * - Plutchik's Wheel of Emotions (8 basic emotions + derivatives)
 * - Ekman's Basic Emotions (6 universal emotions)
 * - Dalai Lama & Ekman's Classification (46 emotions in 5 categories)
 * - Dimensional Theory (continuous emotional space)
 * 
 * PADC は4つの感情次元を表します：
 * - P (Pleasantness/Valence): 快感度 (0-1, 0=不快, 1=快い)
 * - A (Arousal): 覚醒度 (0-1, 0=リラックス, 1=興奮)
 * - D (Dominance): 支配性 (0-1, 0=受動的, 1=支配的)
 * - C (Certainty): 確信度 (0-1, 0=不確実, 1=確信)
 */

export interface PADCScore {
  P_Valence: number;
  A_Strength: number;
  D_Extent: number;
  C_Certainty: number;
}

export interface BasicEmotion {
  name: string;
  icon: string;
  description: string;
  category: 'positive' | 'negative' | 'neutral';
}

export interface EmotionInterpretation {
  primaryEmotion: string;
  emotionIcon: string;
  sentiment: string;
  sentimentColor: string;
  intensity: string;
  intensityValue: number;
  intensityLevel: number; // 新規: 1-5の強度レベル
  emotionPurity: string; // 新規: 感情の純度
  emotionPersistence: string; // 新規: 感情の持続性
  description: string;
  details: {
    valence: string;
    arousal: string;
    dominance: string;
    certainty: string;
  };
  // 新規追加: 複雑な感情分類
  emotionWheelPosition: string;
  plutchikBasicEmotions: BasicEmotion[];
  ekmanEmotions: string[];
  dalaiLamaCategory: string;
  mixedEmotions: string[];
  emotionIntensityLevels: {
    weak: string;
    strong: string;
  };
  psychologicalProfile: {
    dominantTrait: string;
    emotionalState: string;
    copingMechanism: string;
  };
}

/**
 * PADC スコアから主要な感情を解釈 (プルチック・ラッセルモデル対応)
 */
export function interpretPADC(scores: PADCScore): EmotionInterpretation {
  const { P_Valence: p, A_Strength: a, D_Extent: d, C_Certainty: c } = scores;

  // クランプ関数 (0-1の範囲に正規化)
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const P = clamp(p);
  const A = clamp(a);
  const D = clamp(d);
  const C = clamp(c);

  // 1. 主要な感情を判定 (P × A × D でより細かい分類)
  let primaryEmotion = "";
  let emotionIcon = "";

  // ニュートラル判定: Pが0.35-0.65の範囲で、AとDが中程度の場合
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  if (isNeutral) {
    // ニュートラルな感情の分類
    if (A < 0.4 && D > 0.5) {
      primaryEmotion = "冷静・落ち着き";
      emotionIcon = "😌";
    } else if (A < 0.3 && D < 0.5) {
      primaryEmotion = "無感情・無関心";
      emotionIcon = "😐";
    } else if (D > 0.6 && C > 0.5) {
      primaryEmotion = "普通・平凡";
      emotionIcon = "😑";
    } else {
      primaryEmotion = "無感動・平淡";
      emotionIcon = "😶";
    }
  } else if (P > 0.6 && A > 0.6) {
    primaryEmotion = "興奮・喜び";
    emotionIcon = "🎉";
  } else if (P > 0.6 && A <= 0.6) {
    primaryEmotion = "満足・リラックス";
    emotionIcon = "😊";
  } else if (P <= 0.6 && A > 0.6) {
    primaryEmotion = "不安・ストレス";
    emotionIcon = "😰";
  } else {
    primaryEmotion = "悲しみ・落ち込み";
    emotionIcon = "😢";
  }

  // 2. センチメント判定 (より細かい分類)
  let sentiment = "";
  let sentimentColor = "";

  if (isNeutral) {
    sentiment = "ニュートラル 😐";
    sentimentColor = "bg-blue-100 text-blue-800 border-blue-300";
  } else if (P > 0.65) {
    sentiment = "ポジティブ 🌟";
    sentimentColor = "bg-green-100 text-green-800 border-green-300";
  } else if (P > 0.45) {
    sentiment = "ややポジティブ 🙂";
    sentimentColor = "bg-lime-100 text-lime-800 border-lime-300";
  } else if (P > 0.25) {
    sentiment = "ややネガティブ 😕";
    sentimentColor = "bg-orange-100 text-orange-800 border-orange-300";
  } else {
    sentiment = "ネガティブ 😔";
    sentimentColor = "bg-red-100 text-red-800 border-red-300";
  }

  // 3. 強度 (5段階に細分化)
  const intensityValue = Math.sqrt(A * A + (P - 0.5) * (P - 0.5) * 2);
  let intensity = "";
  let intensityLevel = 1; // 1-5のレベル

  if (intensityValue > 0.8) {
    intensity = "極めて強い 💥💥";
    intensityLevel = 5;
  } else if (intensityValue > 0.65) {
    intensity = "非常に強い 💥";
    intensityLevel = 4;
  } else if (intensityValue > 0.45) {
    intensity = "中程度 ⚡";
    intensityLevel = 3;
  } else if (intensityValue > 0.25) {
    intensity = "弱い 🌤️";
    intensityLevel = 2;
  } else {
    intensity = "非常に弱い 🌫️";
    intensityLevel = 1;
  }

  // 3.5. 感情の純度 (単一感情 vs 混合感情の度合い)
  const purityScore = calculateEmotionPurity(P, A, D, C);
  let emotionPurity = "";
  if (purityScore > 0.9) {
    emotionPurity = "極めて純粋 (Extremely Pure)";
  } else if (purityScore > 0.75) {
    emotionPurity = "非常に純粋 (Very Pure)";
  } else if (purityScore > 0.6) {
    emotionPurity = "純粋 (Pure)";
  } else if (purityScore > 0.45) {
    emotionPurity = "混合的 (Mixed)";
  } else if (purityScore > 0.3) {
    emotionPurity = "複雑 (Complex)";
  } else {
    emotionPurity = "非常に複雑 (Highly Complex)";
  }

  // 3.6. 感情の持続性 (一時的 vs 持続的)
  const persistenceScore = calculateEmotionPersistence(P, A, D, C);
  let emotionPersistence = "";
  if (persistenceScore > 0.9) {
    emotionPersistence = "極めて持続的 (Extremely Persistent)";
  } else if (persistenceScore > 0.75) {
    emotionPersistence = "非常に持続的 (Very Persistent)";
  } else if (persistenceScore > 0.6) {
    emotionPersistence = "持続的 (Persistent)";
  } else if (persistenceScore > 0.45) {
    emotionPersistence = "中立的 (Neutral)";
  } else if (persistenceScore > 0.3) {
    emotionPersistence = "一時的 (Temporary)";
  } else {
    emotionPersistence = "非常に一時的 (Highly Temporary)";
  }

  // 4. 詳細説明
  const valenceDesc = P > 0.7 ? "非常に快い" : P > 0.5 ? "快い" : P > 0.3 ? "ニュートラル" : "不快";
  const arousalDesc = A > 0.7 ? "非常に興奮" : A > 0.5 ? "興奮" : A > 0.3 ? "やや覚醒" : "リラックス";
  const dominanceDesc = D > 0.7 ? "非常に支配的" : D > 0.5 ? "支配的" : D > 0.3 ? "やや受動的" : "受動的";
  const certaintyDesc = C > 0.7 ? "非常に確信" : C > 0.5 ? "確信" : C > 0.3 ? "やや不確実" : "不確実";

  // 5. ラッセルの感情円環モデル: 位置を計算
  const angle = Math.atan2(A - 0.5, P - 0.5) * (180 / Math.PI);
  const emotionWheelPosition = getEmotionWheelPosition(angle);

  // 6. プルチックの感情の輪: 基本感情を取得
  const plutchikBasicEmotions = getPlutiksBasicEmotions(P, A, D);

  // 7. エクマンの基本感情 (6つの普遍的な感情)
  const ekmanEmotions = getEkmanEmotions(P, A, D, C);

  // 8. ダライ・ラマ14世とエクマンの5カテゴリー分類
  const dalaiLamaCategory = getDalaiLamaCategory(P, A, D, C);

  // 9. 混合感情 (応用感情)
  const mixedEmotions = getMixedEmotions(P, A, D, C);

  // 10. 強弱派生感情
  const emotionIntensityLevels = getIntensityLevels(P, A, D);

  // 11. 心理学的プロフィール
  const psychologicalProfile = getPsychologicalProfile(P, A, D, C);

  return {
    primaryEmotion,
    emotionIcon,
    sentiment,
    sentimentColor,
    intensity,
    intensityValue,
    intensityLevel,
    emotionPurity,
    emotionPersistence,
    description: `${primaryEmotion}の状態です。${sentimentColor === "bg-green-100 text-green-800 border-green-300" ? "ポジティブな" : sentimentColor === "bg-blue-100 text-blue-800 border-blue-300" ? "ニュートラルな" : "ネガティブな"}感情が${intensity}強さで表現されています。感情の純度は${emotionPurity}で、${emotionPersistence}な性質を持っています。`,
    details: {
      valence: valenceDesc,
      arousal: arousalDesc,
      dominance: dominanceDesc,
      certainty: certaintyDesc,
    },
    emotionWheelPosition,
    plutchikBasicEmotions,
    ekmanEmotions,
    dalaiLamaCategory,
    mixedEmotions,
    emotionIntensityLevels,
    psychologicalProfile,
  };
}

/**
 * PADC 名を日本語に翻訳
 */
export function getPADCLabel(key: string): string {
  const labels: Record<string, string> = {
    P_Valence: "快感度 (P)",
    A_Strength: "覚醒度 (A)",
    D_Extent: "支配性 (D)",
    C_Certainty: "確信度 (C)",
  };
  return labels[key] || key;
}

// ============================================
// プルチックの感情の輪 (8基本感情 + 派生)
// ============================================

/**
 * プルチックの感情の輪: P × A で基本感情を判定
 */
function getPlutiksBasicEmotions(P: number, A: number, D: number): BasicEmotion[] {
  const emotions: BasicEmotion[] = [];

  // ニュートラル判定
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  if (isNeutral) {
    // ニュートラルな感情
    if (A < 0.4 && D > 0.5) {
      emotions.push({
        name: "冷静 (Calm)",
        icon: "😌",
        description: "落ち着いて理性的な状態。感情が安定している",
        category: "neutral",
      });
    } else if (A < 0.3 && D < 0.5) {
      emotions.push({
        name: "無関心 (Indifferent)",
        icon: "😐",
        description: "特に感情が動かない状態。関心が薄い",
        category: "neutral",
      });
    } else {
      emotions.push({
        name: "普通 (Ordinary)",
        icon: "😑",
        description: "特別な感情がない普通の状態",
        category: "neutral",
      });
    }
  } else if (P > 0.65 && A > 0.65) {
    // 8つの基本感情 (プルチックモデル)
    emotions.push({
      name: "喜び (Joy)",
      icon: "😄",
      description: "肯定的で活気のある状態。成功や達成感を感じている",
      category: "positive",
    });
    emotions.push({
      name: "期待 (Anticipation)",
      icon: "🔮",
      description: "未来への期待や関心。新しい可能性に向かっている",
      category: "positive",
    });
  } else if (P > 0.65 && A <= 0.5) {
    emotions.push({
      name: "平穏 (Serenity)",
      icon: "😌",
      description: "穏やかで安定した状態。心が落ち着いている",
      category: "positive",
    });
    emotions.push({
      name: "信頼 (Trust)",
      icon: "🤝",
      description: "相手や状況を信頼している。安心感がある",
      category: "positive",
    });
  } else if (P <= 0.35 && A > 0.65) {
    emotions.push({
      name: "恐れ (Fear)",
      icon: "😨",
      description: "危険や不確実性に対する恐怖。不安定な状態",
      category: "negative",
    });
    emotions.push({
      name: "驚き (Surprise)",
      icon: "😲",
      description: "予期しない出来事への反応。既知から未知への転換",
      category: "neutral",
    });
  } else if (P <= 0.35 && A <= 0.5) {
    emotions.push({
      name: "悲しみ (Sadness)",
      icon: "😢",
      description: "喪失感や失望。活力が低下している状態",
      category: "negative",
    });
    emotions.push({
      name: "嫌悪 (Disgust)",
      icon: "🤢",
      description: "拒否反応。何かを避けたい気持ち",
      category: "negative",
    });
  }

  // D (支配性) で追加の感情ニュアンスを追加
  if (P > 0.5 && A > 0.6 && D < 0.4) {
    emotions.push({
      name: "興奮 (Excitement)",
      icon: "🤩",
      description: "高い覚醒度と肯定感。でも受動的な立場",
      category: "positive",
    });
  } else if (P <= 0.4 && A > 0.7 && D > 0.6) {
    emotions.push({
      name: "怒り (Anger)",
      icon: "😠",
      description: "強い不快感と支配欲。コントロールしたい衝動",
      category: "negative",
    });
  }

  return emotions;
}

/**
 * ラッセルの感情円環モデル: 角度から位置を取得
 */
function getEmotionWheelPosition(angle: number): string {
  // 正規化 (0-360度)
  const normalizedAngle = ((angle + 180) % 360 + 360) % 360;

  if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return "喜び (右上)";
  if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return "期待 (上右)";
  if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return "驚き (上)";
  if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return "驚嘆 (上左)";
  if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return "恐れ (左上)";
  if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return "悲しみ (左下)";
  if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return "嫌悪 (下)";
  if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return "怒り (下右)";

  return "不明 (中央)";
}

/**
 * エクマンの基本感情 (6つの普遍的な感情)
 * 追加で11の応用感情も対応
 */
function getEkmanEmotions(P: number, A: number, D: number, C: number): string[] {
  const emotions: string[] = [];

  // ニュートラル判定
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  if (isNeutral) {
    // ニュートラルな感情
    if (A < 0.4 && D > 0.5) {
      emotions.push("冷静 (Calm)");
    } else if (A < 0.3 && D < 0.5) {
      emotions.push("無関心 (Indifference)");
    } else {
      emotions.push("普通 (Neutral)");
    }
  } else {
    // 6つの基本感情
    if (P > 0.6) emotions.push("幸福感 (Happiness)");
    if (P < 0.4 && A > 0.6) emotions.push("怒り (Anger)");
    if (P < 0.4 && A > 0.5) emotions.push("恐れ (Fear)");
    if (P < 0.4) emotions.push("悲しみ (Sadness)");
    if (A > 0.7) emotions.push("驚き (Surprise)");
    if (P < 0.3) emotions.push("嫌悪 (Disgust)");

    // 追加の11の応用感情 (1990年代追加分)
    if (P > 0.7 && A > 0.6) emotions.push("喜び/興奮 (Joy)");
    if (P > 0.65 && A < 0.4) emotions.push("安心 (Relief)");
    if (P > 0.6 && C > 0.7) emotions.push("満足 (Satisfaction)");
    if (P > 0.5 && A > 0.6) emotions.push("面白さ (Amusement)");
    if (P > 0.65 && A > 0.7) emotions.push("興奮 (Excitement)");
    if (D > 0.7 && P > 0.6) emotions.push("自負心/誇り (Pride)");
    if (P > 0.55 && C > 0.75) emotions.push("納得感 (Contentment)");
    if (P < 0.3 && D < 0.3) emotions.push("軽蔑 (Contempt)");
    if (A > 0.6 && C < 0.4) emotions.push("困惑 (Confusion)");
    if (P < 0.4 && C < 0.3) emotions.push("罪悪感 (Guilt)");
    if (P < 0.35 && D < 0.35 && C < 0.4) emotions.push("恥 (Shame)");
  }

  return [...new Set(emotions)]; // 重複を除去
}

/**
 * ダライ・ラマ14世とエクマンの5カテゴリー分類 (全46種類)
 */
function getDalaiLamaCategory(P: number, A: number, D: number, C: number): string {
  // ニュートラル判定
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  // 5つのカテゴリーに分類
  if (P > 0.65) {
    return "楽しみ (13種類)\n狂喜・興奮・驚嘆・ナチェス・フィエロ・高慢・平穏・安心・シャーデンフロイデ・面白い・同情・喜び・感覚的快楽";
  }
  if (isNeutral) {
    if (A < 0.4 && D > 0.5) {
      return "ニュートラル: 冷静 (5種類)\n落ち着き・平穏・安定・冷静・沈着";
    } else if (A < 0.3 && D < 0.5) {
      return "ニュートラル: 無関心 (4種類)\n無感情・無感動・無関心・平淡";
    } else {
      return "ニュートラル: 普通 (6種類)\n平凡・普通・標準・通常・一般・平均";
    }
  }
  if (P > 0.35 && P <= 0.65 && A < 0.4) {
    return "嫌気 (7種類)\n強い嫌悪・憎悪・反感・嫌気・嫌悪・嫌い・苦手";
  }
  if (A > 0.6) {
    return "恐れ (8種類)\n震駭・恐怖・パニック・自暴自棄・恐れる・不安・緊張感・狼狽";
  }
  if (D > 0.65) {
    return "怒り (7種類)\n憤激・執念・怨み・論争性・激昂・フラストレーション・苛立ち";
  }
  return "悲しみ (11種類)\n苦悩・悲嘆・悲哀・絶望・悲惨・落胆・無力・諦め・逸脱・挫折・残念";
}

/**
 * 混合感情 (応用感情): 複数の基本感情の組み合わせ
 */
function calculateEmotionPurity(P: number, A: number, D: number, C: number): number {
  // 感情の純度を計算：各次元の値がどれだけ極端かを測定
  const maxDeviation = Math.max(
    Math.abs(P - 0.5),
    Math.abs(A - 0.5),
    Math.abs(D - 0.5),
    Math.abs(C - 0.5)
  );

  // 純度は0-1の範囲で、1に近いほど純粋な感情
  return Math.min(maxDeviation * 2, 1);
}

function calculateEmotionPersistence(P: number, A: number, D: number, C: number): number {
  // 感情の持続性を計算：感情の安定性と強さを考慮
  const intensity = Math.sqrt(P * P + A * A + D * D + C * C) / Math.sqrt(4);
  const stability = 1 - Math.abs(P - A) - Math.abs(D - C); // 対角線のバランス

  // 持続性は0-1の範囲で、1に近いほど持続的な感情
  return Math.max(0, Math.min((intensity + stability) / 2, 1));
}

function getMixedEmotions(P: number, A: number, D: number, C: number): string[] {
  const mixed: string[] = [];

  // ニュートラル判定
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  if (isNeutral) {
    // ニュートラルな混合感情
    if (A < 0.4 && D > 0.5) {
      mixed.push("冷静な安定 (Calm Stability)");
      mixed.push("落ち着いた平常心 (Composed Equanimity)");
      mixed.push("理性的な平静 (Rational Serenity)");
    } else if (A < 0.3 && D < 0.5) {
      mixed.push("無関心な平淡 (Indifferent Blandness)");
      mixed.push("感情のない無感動 (Emotionless Apathy)");
      mixed.push("冷めた無関与 (Detached Indifference)");
    } else {
      mixed.push("普通の平凡さ (Ordinary Mediocrity)");
      mixed.push("標準的な中庸 (Standard Moderation)");
      mixed.push("平均的な凡庸 (Average Commonness)");
    }
  } else {
    // より細かい混合感情パターン
    if (P > 0.7 && A > 0.7 && D > 0.7) {
      mixed.push("圧倒的な達成感 (Overwhelming Achievement)");
      mixed.push("卓越した優越感 (Supreme Superiority)");
      mixed.push("完璧な満足感 (Perfect Fulfillment)");
    } else if (P > 0.6 && A > 0.6 && D > 0.6) {
      mixed.push("達成感 (Achievement)");
      mixed.push("優越感 (Superiority)");
      mixed.push("自信に満ちた喜び (Confident Joy)");
    }

    if (P < 0.3 && A > 0.7 && D > 0.7) {
      mixed.push("激しい怒り (Fierce Rage)");
      mixed.push("執拗な執念 (Relentless Obsession)");
      mixed.push("破壊的な憎悪 (Destructive Hatred)");
    } else if (P < 0.4 && A > 0.6 && D > 0.6) {
      mixed.push("激怒 (Rage)");
      mixed.push("執念 (Obsession)");
      mixed.push("強い敵意 (Strong Hostility)");
    }

    if (P < 0.3 && A > 0.8 && D < 0.3) {
      mixed.push("極度の恐怖 (Extreme Terror)");
      mixed.push("深い絶望 (Deep Despair)");
      mixed.push("パニック状態 (Panic State)");
    } else if (P < 0.4 && A > 0.7 && D < 0.4) {
      mixed.push("パニック (Panic)");
      mixed.push("絶望 (Despair)");
      mixed.push("無力感 (Helplessness)");
    }

    if (P > 0.6 && A < 0.4 && D > 0.5 && C > 0.7) {
      mixed.push("確信的な満足感 (Confident Fulfillment)");
      mixed.push("安定した充足感 (Stable Contentment)");
      mixed.push("安心した幸福感 (Secure Happiness)");
    } else if (P > 0.6 && A < 0.4 && D > 0.5) {
      mixed.push("満足感 (Fulfillment)");
      mixed.push("充実感 (Contentment)");
      mixed.push("穏やかな喜び (Gentle Joy)");
    }

    if (P > 0.5 && A > 0.5 && C > 0.8) {
      mixed.push("確信的な喜び (Confident Joy)");
      mixed.push("信頼できる幸福感 (Reliable Happiness)");
      mixed.push("安定した満足 (Stable Satisfaction)");
    }

    if (P < 0.4 && A < 0.4 && C < 0.2) {
      mixed.push("深い無力感 (Deep Helplessness)");
      mixed.push("完全な諦め (Complete Resignation)");
      mixed.push("絶望的な絶望 (Hopeless Despair)");
    } else if (P < 0.4 && A < 0.4 && C < 0.3) {
      mixed.push("無力感 (Helplessness)");
      mixed.push("諦感 (Resignation)");
      mixed.push("絶望感 (Hopelessness)");
    }

    // 追加の複雑な混合感情
    if (P > 0.5 && A > 0.6 && D < 0.4) {
      mixed.push("興奮した期待 (Excited Anticipation)");
      mixed.push("熱狂的な楽しみ (Enthusiastic Enjoyment)");
    }

    if (P < 0.5 && A > 0.5 && D > 0.6) {
      mixed.push("攻撃的な怒り (Aggressive Anger)");
      mixed.push("支配的な苛立ち (Dominant Irritation)");
    }

    if (P > 0.4 && P < 0.6 && A > 0.4 && A < 0.6 && D > 0.4 && D < 0.6) {
      mixed.push("バランスの取れた感情 (Balanced Emotion)");
      mixed.push("調和的な状態 (Harmonious State)");
    }
  }

  return [...new Set(mixed)]; // 重複を除去
}

/**
 * 強弱派生感情: プルチックモデルの強い/弱い感情
 */
function getIntensityLevels(P: number, A: number, D: number): {
  weak: string;
  strong: string;
} {
  let weak = "";
  let strong = "";

  // ニュートラル判定
  const isNeutral = P >= 0.35 && P <= 0.65 && A >= 0.2 && A <= 0.6 && D >= 0.3 && D <= 0.7;

  if (isNeutral) {
    // ニュートラルな強弱派生
    if (A < 0.4 && D > 0.5) {
      weak = "落ち着き (Composure)";
      strong = "冷静 (Calmness)";
    } else if (A < 0.3 && D < 0.5) {
      weak = "平淡 (Blandness)";
      strong = "無感動 (Apathy)";
    } else {
      weak = "普通 (Normality)";
      strong = "平凡 (Mediocrity)";
    }
  } else if (P > 0.6 && A > 0.6) {
    weak = "平穏 (Serenity)";
    strong = "恍惚 (Ecstasy)";
  } else if (P > 0.6 && A <= 0.5) {
    weak = "関心 (Interest)";
    strong = "信頼 (Trust)";
  } else if (A > 0.6) {
    weak = "不安 (Anxiety)";
    strong = "恐怖 (Terror)";
  } else if (P < 0.4 && A < 0.4) {
    weak = "悲哀 (Sadness)";
    strong = "悲嘆 (Grief)";
  } else {
    weak = "冷静 (Calm)";
    strong = "激怒 (Fury)";
  }

  return { weak, strong };
}

/**
 * 心理学的プロフィール: その人の心理状態の全体像
 */
function getPsychologicalProfile(
  P: number,
  A: number,
  D: number,
  C: number
): {
  dominantTrait: string;
  emotionalState: string;
  copingMechanism: string;
} {
  let dominantTrait = "";
  let emotionalState = "";
  let copingMechanism = "";

  // 優位な特性を判定
  if (P > 0.65) {
    dominantTrait = "ポジティブ志向 (Positive Orientation)";
  } else if (P < 0.35) {
    dominantTrait = "ネガティブ傾向 (Negative Bias)";
  } else {
    dominantTrait = "バランス型 (Balanced)";
  }

  if (A > 0.7) {
    dominantTrait += " × 高覚醒型 (High Arousal)";
  } else if (A < 0.3) {
    dominantTrait += " × 低覚醒型 (Low Arousal)";
  }

  // 現在の感情状態
  if (P > 0.6 && A > 0.6) {
    emotionalState = "満ち足りた活動状態。新しいチャレンジに前向き";
  } else if (P > 0.6 && A <= 0.5) {
    emotionalState = "安定した肯定状態。現在の状況に満足";
  } else if (P <= 0.6 && A > 0.6) {
    emotionalState = "緊張・不安の状態。何らかの脅威を感じている";
  } else {
    emotionalState = "抑うつ状態。活力の低下を経験中";
  }

  // コーピング機構 (対処機制)
  if (D > 0.65 && P > 0.5) {
    copingMechanism = "主動的問題解決 (Active Problem-Solving)";
  } else if (D > 0.65 && P < 0.4) {
    copingMechanism = "支配的・攻撃的対処 (Aggressive Coping)";
  } else if (D < 0.35 && P > 0.5) {
    copingMechanism = "受容的・社会的支援求成 (Social Support)";
  } else if (D < 0.35 && P < 0.4) {
    copingMechanism = "回避的・諦観的対処 (Avoidance Coping)";
  } else {
    copingMechanism = "状況依存的対処 (Situational Coping)";
  }

  if (C > 0.7) {
    copingMechanism += " (確信度高)";
  } else if (C < 0.3) {
    copingMechanism += " (不確実性あり)";
  }

  return { dominantTrait, emotionalState, copingMechanism };
}

// ============================================
// ユーティリティ関数
// ============================================

/**
 * スコアを0-100のパーセンテージに変換
 */
export function scoreToPercentage(score: number): number {
  return Math.round(clamp(score) * 100);
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * PADC スコアから色を取得
 */
export function getScoreColor(score: number): string {
  const clamped = Math.max(0, Math.min(1, score));
  if (clamped > 0.7) return "text-red-600";
  if (clamped > 0.5) return "text-orange-600";
  if (clamped > 0.3) return "text-yellow-600";
  return "text-blue-600";
}
