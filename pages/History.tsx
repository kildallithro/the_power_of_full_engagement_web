import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/Icons';
import { getLogs, exportData, clearLogs } from '@/services/storageService';
import { EnergyLog, DIMENSION_CONFIG } from '@/types';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<EnergyLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const handleClear = () => {
    if(window.confirm("确定要删除所有历史记录吗？此操作无法撤销。")) {
        clearLogs();
        setLogs([]);
    }
  }

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('zh-CN');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, EnergyLog[]>);

  return (
    <div className="pb-24 px-4 max-w-md mx-auto pt-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
            <Icons.Trend className="transform rotate-180" size={20} /> {/* Back Icon substitute */}
        </button>
        <h1 className="text-2xl font-bold text-slate-800">历史记录</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="flex gap-2 mb-6">
        <button 
            onClick={exportData}
            className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            导出数据 (JSON)
        </button>
        <button 
            onClick={handleClear}
            className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100"
        >
            清空
        </button>
      </div>

      <div className="space-y-6">
        {logs.length === 0 ? (
            <p className="text-center text-gray-400 py-10">暂无历史记录</p>
        ) : (
            Object.entries(groupedLogs).map(([date, dayLogs]) => (
              <div key={date}>
                <h3 className="text-sm font-bold text-gray-500 mb-3 px-1">{date}</h3>
                <div className="space-y-3">
                  {dayLogs.map(log => (
                    <div key={log.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {(['physical', 'emotional', 'mental', 'spiritual'] as const).map(dim => (
                                <div key={dim} className="flex flex-col">
                                    <div className={`h-1 rounded-full ${DIMENSION_CONFIG[dim].bgColor} opacity-20 w-full mb-1`}></div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-gray-400">{DIMENSION_CONFIG[dim].label}</span>
                                        <span className={`text-xs font-bold ${DIMENSION_CONFIG[dim].color}`}>{log.levels[dim]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {log.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic">
                                "{log.notes}"
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};