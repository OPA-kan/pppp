"use client";

import React from "react";
import { interpretPADC, PADCScore, scoreToPercentage } from "@/app/utils/padcInterpreter";

interface EmotionDisplayProps {
  scores: PADCScore;
}

export function EmotionDisplay({ scores }: EmotionDisplayProps) {
  const interpretation = interpretPADC(scores);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* メイン感情表示 */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-3">{interpretation.emotionIcon}</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">
            {interpretation.primaryEmotion}
          </h3>
          <p className="text-base sm:text-lg text-gray-700 px-2">{interpretation.description}</p>
        </div>

        {/* センチメント & 強度バッジ */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <div
            className={`px-4 py-2 rounded-full border-2 font-bold text-sm sm:text-base ${interpretation.sentimentColor}`}
          >
            {interpretation.sentiment}
          </div>
          <div className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-300 font-bold text-sm sm:text-base">
            {interpretation.intensity}
          </div>
        </div>

        {/* 詳細スコア表示 - モバイル対応グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScoreBox label="快感度 (P)" value={scores.P_Valence} description={interpretation.details.valence} />
          <ScoreBox label="覚醒度 (A)" value={scores.A_Strength} description={interpretation.details.arousal} />
          <ScoreBox label="支配性 (D)" value={scores.D_Extent} description={interpretation.details.dominance} />
          <ScoreBox label="確信度 (C)" value={scores.C_Certainty} description={interpretation.details.certainty} />
        </div>

        {/* PADC説明 */}
        <div className="bg-white rounded-lg p-4 border border-purple-200 mt-4">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-purple-900">💡 PADC とは：</span> Pleasure (快感度)・Arousal (覚醒度)・Dominance (支配性)・Certainty
            (確信度)の4つの感情次元です。テキストの感情を多次元的に分析します。
          </p>
        </div>
      </div>

      {/* ラッセルの感情円環モデル */}
      <div className="p-4 sm:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200 shadow-lg">
        <h4 className="text-lg sm:text-xl font-bold text-indigo-900 mb-4">🎡 ラッセルの感情円環モデル</h4>
        <p className="text-indigo-800 mb-4 text-sm sm:text-base">
          <strong>位置:</strong> {interpretation.emotionWheelPosition}
        </p>
        <p className="text-sm text-indigo-700">
          感情を「快-不快」と「覚醒-睡眠」という2つの次元で表現します。感情の強さは中心からの距離で表わされます。
        </p>
      </div>

      {/* プルチックの感情の輪 */}
      <div className="p-4 sm:p-6 bg-rose-50 rounded-xl border-2 border-rose-200 shadow-lg">
        <h4 className="text-lg sm:text-xl font-bold text-rose-900 mb-4">🎭 プルチックの感情の輪</h4>
        <p className="text-sm text-gray-600 mb-3">8つの基本感情とその派生感情：</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {interpretation.plutchikBasicEmotions.map((emotion, idx) => (
            <div key={idx} className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="font-semibold text-rose-800 text-sm sm:text-base">
                {emotion.icon} {emotion.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">{emotion.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* エクマンの基本感情 */}
      <div className="p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-lg">
        <h4 className="text-lg sm:text-xl font-bold text-blue-900 mb-4">😊 エクマンの基本感情</h4>
        <p className="text-sm text-gray-600 mb-3">検出された感情：</p>
        <div className="flex flex-wrap gap-2">
          {interpretation.ekmanEmotions.map((emotion, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-semibold"
            >
              {emotion}
            </span>
          ))}
        </div>
      </div>

      {/* ダライ・ラマの5カテゴリー */}
      <div className="p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-200 shadow-lg">
        <h4 className="text-lg sm:text-xl font-bold text-amber-900 mb-4">🏛️ ダライ・ラマ14世の分類 (46感情)</h4>
        <p className="text-sm text-amber-800 whitespace-pre-wrap font-mono">
          {interpretation.dalaiLamaCategory}
        </p>
      </div>

      {/* 混合感情と心理プロフィール (高度な情報) */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
      >
        {showAdvanced ? "▼ 詳細情報を隠す" : "▶ 詳細な感情分析を表示"}
      </button>

      {showAdvanced && (
        <>
          {/* 混合感情 */}
          <div className="p-4 sm:p-6 bg-green-50 rounded-xl border-2 border-green-200 shadow-lg">
            <h4 className="text-lg sm:text-xl font-bold text-green-900 mb-4">🔀 混合感情 (応用感情)</h4>
            {interpretation.mixedEmotions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interpretation.mixedEmotions.map((emotion, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">{emotion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">複数の感情が混在していない状態です</p>
            )}
          </div>

          {/* 強弱派生感情 */}
          <div className="p-4 sm:p-6 bg-cyan-50 rounded-xl border-2 border-cyan-200 shadow-lg">
            <h4 className="text-lg sm:text-xl font-bold text-cyan-900 mb-4">📊 強弱派生感情</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-cyan-200">
                <p className="text-xs font-semibold text-cyan-700 mb-1">弱い感情</p>
                <p className="text-base sm:text-lg font-bold text-cyan-900">{interpretation.emotionIntensityLevels.weak}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-cyan-200">
                <p className="text-xs font-semibold text-cyan-700 mb-1">強い感情</p>
                <p className="text-base sm:text-lg font-bold text-cyan-900">{interpretation.emotionIntensityLevels.strong}</p>
              </div>
            </div>
          </div>

          {/* 心理学的プロフィール */}
          <div className="p-4 sm:p-6 bg-violet-50 rounded-xl border-2 border-violet-200 shadow-lg">
            <h4 className="text-lg sm:text-xl font-bold text-violet-900 mb-4">🧠 心理学的プロフィール</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-violet-700">優位な特性</p>
                <p className="text-violet-900">{interpretation.psychologicalProfile.dominantTrait}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-700">現在の感情状態</p>
                <p className="text-violet-900">{interpretation.psychologicalProfile.emotionalState}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-700">コーピング機構 (対処方法)</p>
                <p className="text-violet-900">{interpretation.psychologicalProfile.copingMechanism}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ScoreBoxProps {
  label: string;
  value: number;
  description: string;
}

function ScoreBox({ label, value, description }: ScoreBoxProps) {
  const percentage = scoreToPercentage(value);
  const barColor = percentage > 70 ? "bg-red-500" : percentage > 50 ? "bg-orange-500" : percentage > 30 ? "bg-yellow-500" : "bg-blue-500";

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-gray-800">{label}</span>
        <span className="text-xl font-bold text-purple-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
