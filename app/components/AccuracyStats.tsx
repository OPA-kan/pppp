"use client";

interface Stats {
  total: number;
  correct: number;
  incorrect: number;
}

interface AccuracyStatsProps {
  stats: Stats;
}

export function AccuracyStats({ stats }: AccuracyStatsProps) {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const correctPercentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const incorrectPercentage = stats.total > 0 ? Math.round((stats.incorrect / stats.total) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-300 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-cyan-900 mb-6">📈 フィードバック統計</h3>

      {/* 総分析数 - モバイル対応グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold">総分析数</p>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-2">件</p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold">✅ 合ってる</p>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">{stats.correct}</p>
          <p className="text-xs text-gray-500 mt-2">{correctPercentage}%</p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold">❌ 違う</p>
          <p className="text-3xl sm:text-4xl font-bold text-red-600">{stats.incorrect}</p>
          <p className="text-xs text-gray-500 mt-2">{incorrectPercentage}%</p>
        </div>
      </div>

      {/* 正解率バー */}
      {stats.total > 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-gray-800">正解率</span>
            <span className="text-2xl sm:text-3xl font-bold text-green-600">{accuracy}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 sm:h-6 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${accuracy}%` }}
            >
              {accuracy > 10 && <span className="text-xs font-bold text-white">{accuracy}%</span>}
            </div>
          </div>

          {/* 詳細な円グラフ風表示 */}
          <div className="mt-4 flex justify-between text-center">
            <div>
              <p className="text-sm text-gray-700 font-semibold">成功</p>
              <div className="relative w-20 h-20 mx-auto mt-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-200 to-green-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-700">{correctPercentage}%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-semibold">失敗</p>
              <div className="relative w-20 h-20 mx-auto mt-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 to-red-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-700">{incorrectPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
          <p className="text-lg text-yellow-800 font-semibold">
            📊 まだ分析結果がありません
          </p>
          <p className="text-sm text-yellow-700 mt-2">テキストを分析してフィードバックを送ると統計が表示されます</p>
        </div>
      )}
    </div>
  );
}
