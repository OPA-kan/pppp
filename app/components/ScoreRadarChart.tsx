"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { PADCScore, scoreToPercentage, getPADCLabel } from "@/app/utils/padcInterpreter";

interface ScoreRadarChartProps {
  scores: PADCScore;
}

export function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const data = [
    {
      name: getPADCLabel("P_Valence"),
      value: scoreToPercentage(scores.P_Valence),
      fullMark: 100,
    },
    {
      name: getPADCLabel("A_Strength"),
      value: scoreToPercentage(scores.A_Strength),
      fullMark: 100,
    },
    {
      name: getPADCLabel("D_Extent"),
      value: scoreToPercentage(scores.D_Extent),
      fullMark: 100,
    },
    {
      name: getPADCLabel("C_Certainty"),
      value: scoreToPercentage(scores.C_Certainty),
      fullMark: 100,
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl border-2 border-blue-200 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6 text-center">📊 感情スコア分析</h3>
      <div className="w-full h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="name" angle={90} direction="clockwise" stroke="#666" fontSize={12} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#999" fontSize={10} />
            <Radar
              name="スコア"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#a78bfa"
              fillOpacity={0.6}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-sm font-semibold text-gray-700">{item.name}</p>
            <p className="text-2xl font-bold text-purple-600">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
