import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/Icons';
import { EnergyChart } from '@/components/EnergyChart';
import { getLogs } from '@/services/storageService';
import { analyzeEnergy } from '@/services/geminiService';
import { EnergyLog, CoachInsight, DIMENSION_CONFIG } from '@/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [insight, setInsight] = useState<CoachInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const storedLogs = getLogs();
    setLogs(storedLogs);
    setHasKey(!!process.env.API_KEY);
  }, []);

  const handleAnalyze = async () => {
    if (!hasKey) {
        alert("请先配置 Gemini API Key 以使用 AI 教练功能。");
        return;
    }
    setLoadingInsight(true);
    const result = await analyzeEnergy(logs);
    setInsight(result);
    setLoadingInsight(false);
  };

  const latestLog = logs[0];

  return (
    <div className="pb-24 px-4 max-w-md mx-auto pt-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">仪表盘</h1>
            <p className="text-slate-500 text-sm">管理精力，而非时间。</p>
        </div>
        <button 
            onClick={() => navigate('/history')}
            className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm"
        >
            <Icons.History size={20} />
        </button>
      </header>

      {/* Quick Stats or Welcome */}
      {logs.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center mb-8">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Zap className="text-blue-600" size={24} />
          </div>
          <h3 className="font-semibold text-blue-900 mb-2">开始记录</h3>
          <p className="text-blue-700/80 text-sm mb-4">
            记录体能、情感、思维、意志四个维度的精力状态，获取 AI 洞察。
          </p>
          <button
            onClick={() => navigate('/checkin')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
          >
            首次打卡
          </button>
        </div>
      ) : (
        <>
          {/* Current Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">当前状态</h2>
                <span className="text-xs text-gray-400">
                    {new Date(latestLog.timestamp).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
            <div className="mb-4">
                <EnergyChart logs={logs} type="radar" />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
                {(['physical', 'emotional', 'mental', 'spiritual'] as const).map(dim => (
                    <div key={dim} className="flex flex-col items-center">
                        <div className={`text-sm font-bold ${DIMENSION_CONFIG[dim].color}`}>
                            {latestLog.levels[dim]}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            {DIMENSION_CONFIG[dim].label}
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* AI Coach Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icons.Mental size={18} className="text-purple-600" />
                    AI 精力教练
                </h2>
                {logs.length > 0 && !insight && !loadingInsight && (
                     <button 
                        onClick={handleAnalyze}
                        className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium hover:bg-purple-200 transition"
                     >
                        分析
                     </button>
                )}
            </div>

            {loadingInsight && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                    <p className="text-sm text-gray-500">正在咨询 AI 教练...</p>
                </div>
            )}

            {insight && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    {/* Decorative blob */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
                    
                    <h3 className="font-semibold text-lg mb-2">教练洞察</h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed italic">"{insight.summary}"</p>
                    
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-400/20 p-1.5 rounded-full">
                                <Icons.Trend size={16} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">推荐恢复仪式</p>
                                <p className="font-medium text-white text-sm">{insight.ritual}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-20">
             <h2 className="font-semibold text-gray-700 mb-4">精力趋势</h2>
             <EnergyChart logs={logs} type="trend" />
          </div>
        </>
      )}
      
      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/checkin')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <Icons.Add size={28} />
      </button>
    </div>
  );
};