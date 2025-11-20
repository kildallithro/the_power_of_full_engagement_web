import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/Icons';
import { DIMENSION_CONFIG, EnergyLog, EnergyLevels } from '@/types';
import { saveLog } from '@/services/storageService';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<EnergyLevels>({
    physical: 5,
    emotional: 5,
    mental: 5,
    spiritual: 5
  });
  const [notes, setNotes] = useState('');

  const handleSliderChange = (dimension: keyof EnergyLevels, value: number) => {
    setLevels(prev => ({ ...prev, [dimension]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: EnergyLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      levels,
      notes
    };
    saveLog(newLog);
    navigate('/');
  };

  const renderSlider = (key: keyof EnergyLevels) => {
    const config = DIMENSION_CONFIG[key];
    const Icon = Icons[key === 'physical' ? 'Physical' : key === 'emotional' ? 'Emotional' : key === 'mental' ? 'Mental' : 'Spiritual'];
    const value = levels[key];

    return (
      <div key={key} className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${config.bgColor} bg-opacity-10`}>
              <Icon size={20} className={config.color} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{config.label}</h3>
              <p className="text-xs text-gray-500">{config.question}</p>
            </div>
          </div>
          <span className={`text-xl font-bold ${config.color}`}>{value}</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-${config.color.replace('text-', '')}`}
          style={{ accentColor: 'currentColor' }} 
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>耗尽 (1)</span>
            <span>充沛 (10)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">精力打卡</h1>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">取消</button>
      </div>

      <form onSubmit={handleSubmit}>
        {renderSlider('physical')}
        {renderSlider('emotional')}
        {renderSlider('mental')}
        {renderSlider('spiritual')}

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">备注 (选填)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="是什么在消耗或补充你的能量？"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
        >
          保存记录
        </button>
      </form>
    </div>
  );
};