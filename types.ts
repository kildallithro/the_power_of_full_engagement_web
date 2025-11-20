export interface EnergyLevels {
  physical: number; // 1-10
  emotional: number; // 1-10
  mental: number; // 1-10
  spiritual: number; // 1-10
}

export interface EnergyLog {
  id: string;
  timestamp: number; // Date.now()
  levels: EnergyLevels;
  notes: string;
}

export interface CoachInsight {
  summary: string;
  dimensionFocus: 'physical' | 'emotional' | 'mental' | 'spiritual';
  suggestion: string;
  ritual: string; // Suggested recovery ritual
}

export const DIMENSION_CONFIG = {
  physical: {
    label: '体能',
    description: '精力的数量。血糖、睡眠、呼吸。',
    color: 'text-physical',
    bgColor: 'bg-physical',
    borderColor: 'border-physical',
    question: '你的身体现在感觉充满活力吗？'
  },
  emotional: {
    label: '情感',
    description: '精力的质量。人际连接、韧性、冷静。',
    color: 'text-emotional',
    bgColor: 'bg-emotional',
    borderColor: 'border-emotional',
    question: '你感觉积极和情绪稳定吗？'
  },
  mental: {
    label: '思维',
    description: '精力的聚焦。专注力、创造力、规划。',
    color: 'text-mental',
    bgColor: 'bg-mental',
    borderColor: 'border-mental',
    question: '你的思维敏锐且专注吗？'
  },
  spiritual: {
    label: '意志',
    description: '精力的力量。目标、价值观、性格。',
    color: 'text-spiritual',
    bgColor: 'bg-spiritual',
    borderColor: 'border-spiritual',
    question: '你感觉与核心价值观保持一致吗？'
  }
};