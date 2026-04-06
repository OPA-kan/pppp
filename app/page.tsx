"use client";
import { useState, useEffect } from "react";
import { EmotionDisplay } from "@/app/components/EmotionDisplay";
import { ScoreRadarChart } from "@/app/components/ScoreRadarChart";
import { AccuracyStats } from "@/app/components/AccuracyStats";

type Entry = {
  id: string;
  text: string;
  scores: Record<string, number>;
  feedback: boolean | null;
  createdAt: string;
};

type Stats = {
  total: number;
  correct: number;
  incorrect: number;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ id: string; scores: Record<string, number> } | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<Entry | null>(null);
  const [logs, setLogs] = useState<Entry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setStats(data.stats ?? { total: 0, correct: 0, incorrect: 0 });
    } catch (e) {
      console.error("fetchLogs error:", e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedHistory(null); // 新しい分析時は履歴選択をクリア

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "分析に失敗しました");
        return;
      }

      if (!data.scores) {
        setError("スコアが取得できませんでした");
        return;
      }

      setResult(data);
      fetchLogs();
    } catch (e) {
      console.error("handleAnalyze error:", e);
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (id: string, correct: boolean) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, correct }),
      });
      fetchLogs();
    } catch (e) {
      console.error("handleFeedback error:", e);
    }
  };

  const handleHistorySelect = (entry: Entry) => {
    setSelectedHistory(entry);
    setError(null);
  };

  const clearSelection = () => {
    setSelectedHistory(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex justify-center">
      {/* メインコンテナ - 中央寄せと幅制限 */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 sm:py-12 shadow-xl rounded-2xl mb-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">🌸 Saki PADC 感情分析ダッシュボード</h1>
            <p className="text-purple-100 text-base sm:text-lg">AI がテキストから4つの感情次元を分析します</p>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-8">
          {/* 入力セクション */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-l-4 border-purple-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">✍️ テキストを入力</h2>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none text-gray-800 placeholder-gray-500 text-base"
              placeholder="感情を分析したいテキストを入力してください。日本語の文章、感想、感情表現など何でもOKです。"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  loading || !text.trim()
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
                }`}
              >
                {loading ? "🔄 分析中..." : "🚀 分析する"}
              </button>
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-lg">
              <div className="flex items-start">
                <span className="text-3xl mr-4">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800 text-lg">エラーが発生しました</h3>
                  <p className="text-red-700 mt-2">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 分析結果 */}
          {(result && result.scores) || selectedHistory ? (
            <div className="space-y-6">
              {/* 履歴から選択された場合のヘッダー */}
              {selectedHistory && (
                <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">📚 履歴から選択された分析結果</h3>
                      <p className="text-orange-100 text-sm mt-1">
                        {new Date(selectedHistory.createdAt).toLocaleString("ja-JP")}
                      </p>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-semibold"
                    >
                      ✕ 閉じる
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-white/10 rounded-lg">
                    <p className="text-white font-medium line-clamp-2">{selectedHistory.text}</p>
                  </div>
                </div>
              )}

              {/* 感情解釈 - メインカード */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                  <h3 className="text-white text-xl font-bold text-center">
                    🎭 {selectedHistory ? "履歴の感情分析結果" : "感情分析結果"}
                  </h3>
                </div>
                <div className="p-6">
                  <EmotionDisplay
                    scores={{
                      P_Valence: (selectedHistory?.scores.P_Valence || result?.scores.P_Valence) || 0,
                      A_Strength: (selectedHistory?.scores.A_Strength || result?.scores.A_Strength) || 0,
                      D_Extent: (selectedHistory?.scores.D_Extent || result?.scores.D_Extent) || 0,
                      C_Certainty: (selectedHistory?.scores.C_Certainty || result?.scores.C_Certainty) || 0,
                    }}
                  />
                </div>
              </div>

              {/* レーダーチャート - サイドカード */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                  <h3 className="text-white text-xl font-bold text-center">📊 スコア分布</h3>
                </div>
                <div className="p-6">
                  <ScoreRadarChart
                    scores={{
                      P_Valence: (selectedHistory?.scores.P_Valence || result?.scores.P_Valence) || 0,
                      A_Strength: (selectedHistory?.scores.A_Strength || result?.scores.A_Strength) || 0,
                      D_Extent: (selectedHistory?.scores.D_Extent || result?.scores.D_Extent) || 0,
                      C_Certainty: (selectedHistory?.scores.C_Certainty || result?.scores.C_Certainty) || 0,
                    }}
                  />
                </div>
              </div>

              {/* フィードバックボタン - 履歴選択時は非表示 */}
              {!selectedHistory && result && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">💬 この分析結果は正確でしたか？</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleFeedback(result.id, true)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-lg"
                    >
                      ✅ 合ってる
                    </button>
                    <button
                      onClick={() => handleFeedback(result.id, false)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-lg"
                    >
                      ❌ 違う
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* 統計セクション */}
          <AccuracyStats stats={stats} />

          {/* ログ一覧セクション */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-l-4 border-orange-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📝 分析履歴</h2>
              <p className="text-gray-600 text-sm">各履歴をクリックすると、その分析結果を再表示できます</p>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-xl mb-2">📭 まだ分析結果がありません</p>
                <p className="text-gray-400">テキストを分析すると、ここに履歴が表示されます</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((entry, index) => (
                  <div
                    key={entry.id}
                    onClick={() => handleHistorySelect(entry)}
                    className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                            #{logs.length - index}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.createdAt).toLocaleString("ja-JP")}
                          </span>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            👆 クリックして結果を表示
                          </span>
                        </div>
                        <p className="text-gray-800 font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {entry.text}
                        </p>
                      </div>
                      <div className="lg:ml-4">
                        {entry.feedback === true && (
                          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                            ✅ 合ってる
                          </span>
                        )}
                        {entry.feedback === false && (
                          <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold text-sm">
                            ❌ 違う
                          </span>
                        )}
                        {entry.feedback === null && (
                          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">
                            ❓ 未回答
                          </span>
                        )}
                      </div>
                    </div>

                    {/* スコア表示 - モバイル対応グリッド */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-300">
                      {Object.entries(entry.scores).map(([key, value]) => {
                        const percentage = Math.round(Math.max(0, Math.min(1, typeof value === "number" ? value : 0)) * 100);
                        return (
                          <div key={key} className="text-center p-2 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs font-bold text-gray-700 mb-1">{getScoreName(key)}</p>
                            <p className={`text-lg font-bold ${getScoreColorClass(percentage)}`}>
                              {percentage}%
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="text-center text-gray-600 py-8 border-t border-gray-200">
            <p className="text-sm">
              💡 Saki PADC API による感情分析 | P(快感度) A(覚醒度) D(支配性) C(確信度)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function getScoreName(key: string): string {
  const names: Record<string, string> = {
    P_Valence: "P (快感度)",
    A_Strength: "A (覚醒度)",
    D_Extent: "D (支配性)",
    C_Certainty: "C (確信度)",
  };
  return names[key] || key;
}

function getScoreColorClass(percentage: number): string {
  if (percentage > 70) return "text-red-600";
  if (percentage > 50) return "text-orange-600";
  if (percentage > 30) return "text-yellow-600";
  return "text-blue-600";
}
