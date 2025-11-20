import React from 'react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Zap, 
  Plus, 
  LayoutDashboard, 
  History, 
  Settings,
  TrendingUp,
  Battery,
  BatteryCharging,
  BatteryFull,
  Leaf
} from 'lucide-react';

export const Icons = {
  Physical: Activity,
  Emotional: Heart,
  Mental: Brain,
  Spiritual: Leaf, // Using Leaf for growth/spiritual
  Add: Plus,
  Dashboard: LayoutDashboard,
  History: History,
  Settings: Settings,
  Trend: TrendingUp,
  LowBattery: Battery,
  MidBattery: BatteryCharging,
  FullBattery: BatteryFull,
  Zap: Zap
};