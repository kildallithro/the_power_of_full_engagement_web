import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { EnergyLog } from '../types';

interface Props {
  logs: EnergyLog[];
  type: 'trend' | 'radar';
}

export const EnergyChart: React.FC<Props> = ({ logs, type }) => {
  if (logs.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">暂无数据</div>;
  }

  // Prepare data for Trend (reversed because logs are stored newest first)
  const trendData = [...logs].reverse().map(log => ({
    time: new Date(log.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    physical: log.levels.physical,
    emotional: log.levels.emotional,
    mental: log.levels.mental,
    spiritual: log.levels.spiritual,
  }));

  // Prepare data for Radar (most recent log)
  const latestLog = logs[0];
  const radarData = [
    { subject: '体能', A: latestLog.levels.physical, fullMark: 10 },
    { subject: '情感', A: latestLog.levels.emotional, fullMark: 10 },
    { subject: '思维', A: latestLog.levels.mental, fullMark: 10 },
    { subject: '意志', A: latestLog.levels.spiritual, fullMark: 10 },
  ];

  if (type === 'radar') {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="当前精力"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip 
             contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
          />
          <Line name="体能" type="monotone" dataKey="physical" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line name="情感" type="monotone" dataKey="emotional" stroke="#f97316" strokeWidth={2} dot={false} />
          <Line name="思维" type="monotone" dataKey="mental" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line name="意志" type="monotone" dataKey="spiritual" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};