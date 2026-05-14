import React from 'react';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Users, 
  MapPin, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  ShieldAlert,
  Trophy,
  History
} from 'lucide-react';
import { motion } from 'motion/react';

import { themes } from '../../lib/themes';

export const StoryBlueprint = () => {
  const { 
    projectTitle, 
    projectGenre,
    projectArchetype,
    projectTheme,
    projectFormat,
    projectConflict,
    beats, 
    characters, 
    locations, 
    setActiveView,
    setActiveLeftPanel,
    setProjectTheme,
    resetProject
  } = useAppStore();

  const milestones = [
    { 
      id: 'beats', 
      label: 'Story Beats Established', 
      value: beats.length, 
      target: 8, 
      icon: <Target className="w-4 h-4 text-slate-400" />,
      panel: 'beatboard'
    },
    { 
      id: 'characters', 
      label: 'Characters Developed', 
      value: characters.filter(c => c.description).length, 
      target: Math.max(3, characters.length), 
      icon: <Users className="w-4 h-4 text-slate-400" />,
      panel: 'characters'
    },
    { 
      id: 'locations', 
      label: 'World Settings Defined', 
      value: locations.length, 
      target: 3, 
      icon: <MapPin className="w-4 h-4 text-slate-400" />,
      panel: 'locations'
    }
  ];

  const overallProgress = Math.min(100, Math.round(
    ((milestones[0].value / milestones[0].target) + 
     (milestones[1].value / milestones[1].target) + 
     (milestones[2].value / milestones[2].target)) / 3 * 100
  ));

  const genreEmoji = {
    noir: '🌃',
    scifi: '🚀',
    horror: '🫀',
    dark_comedy: '💀',
    comedy: '🎡',
    fantasy: '🏰',
    western: '🌵',
    thriller: '🩸'
  }[projectGenre as keyof typeof genreEmoji] || '🎭';

  const archetypeLabel = {
    journey: "Hero's Journey",
    riches: 'Rags to Riches',
    monster: 'Overcoming Monsters',
    rebirth: 'Rebirth',
    tragedy: 'Tragedy',
    mystery: 'Mystery',
    heist: 'The Heist'
  }[projectArchetype as keyof typeof archetypeLabel] || 'Story Concept';

  const formatLabel = {
    feature: 'Feature Film',
    tv: 'TV Pilot',
    short: 'Short Film'
  }[projectFormat as keyof typeof formatLabel] || 'Creative Project';

  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">{formatLabel} — {archetypeLabel}</span>
              <span className="text-xl opacity-50">{genreEmoji}</span>
            </div>
            <h1 className="text-6xl font-serif font-medium text-white tracking-tight leading-none">
              {projectTitle}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl italic">
              {projectTheme || "Exploring the depths of narrative and the complexities of human experience through the lens of modern storytelling."}
            </p>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="text-right">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Development Phase</div>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-serif italic text-white tracking-tighter">Draft {Math.floor(overallProgress / 33) + 1}</span>
              </div>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  className="h-full bg-white"
                />
              </div>
            </div>
            <Button 
              onClick={() => setActiveView('scripting')}
              className="bg-white hover:bg-slate-200 text-black font-bold px-10 h-14 gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Start Writing <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Milestones Card */}
          <Card className="md:col-span-2 bg-transparent border-white/10 p-8 flex flex-col justify-between rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3">
                  <Trophy className="w-3.5 h-3.5 text-slate-400" />
                  Project Milestones
                </h3>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global Status</span>
              </div>
              <div className="space-y-10">
                {milestones.map((m) => (
                  <div key={m.id} className="group cursor-pointer" onClick={() => setActiveLeftPanel(m.panel as any)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                          {m.icon}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-[0.15em]">
                          {m.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {Math.min(100, Math.round((m.value / m.target) * 100))}%
                      </span>
                    </div>
                    <Progress value={(m.value / m.target) * 100} className="h-0.5 bg-white/5" indicatorClassName="bg-white" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] self-center">
                  visual texture: {projectGenre || 'standard'} setting.
                </span>
                <div className="flex gap-3">
                  {Object.values(themes).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setProjectTheme(t.id)}
                      className={`w-5 h-5 rounded-full border transition-all ${projectTheme === t.id ? 'border-white scale-125' : 'border-white/10 hover:border-white/30'}`}
                      style={{ backgroundColor: t.primary }}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats / Intel */}
          <div className="space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-3">Central Conflict</h4>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    {projectConflict || "The core tension that drives your narrative is awaiting definition..."}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              onClick={() => {
                if (showResetConfirm) {
                  resetProject();
                } else {
                  setShowResetConfirm(true);
                  setTimeout(() => setShowResetConfirm(false), 3000);
                }
              }} 
              className={`p-8 flex flex-col items-center justify-center text-center group cursor-pointer transition-all border-dashed rounded-2xl ${showResetConfirm ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10'}`}
            >
              <History className={`w-6 h-6 mb-4 transition-colors ${showResetConfirm ? 'text-red-500' : 'text-red-500/30 group-hover:text-red-500'}`} />
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {showResetConfirm ? 'Confirm Reset?' : 'Reset Workspace'}
              </h4>
              <p className="text-[8px] text-slate-700 mt-2 uppercase tracking-widest leading-relaxed">
                {showResetConfirm ? 'Click again to confirm' : 'Clear all current progress'}
              </p>
            </Card>
          </div>
        </div>

        {/* Action Board (Simulated) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {['Rising Action', 'The Turning Point', 'The Climax'].map((phase, i) => (
             <div key={phase} className="p-5 border border-white/5 bg-white/[0.02] rounded-xl group hover:border-white/20 transition-all">
               <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-2">Phase 0{i+1}</div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter group-hover:text-white transition-colors">{phase}</span>
                 {beats.length > i * 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Circle className="w-3.5 h-3.5 text-slate-800" />}
               </div>
             </div>
           ))}
           <div className="p-5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-700 hover:text-white hover:border-white/30 cursor-pointer transition-colors" onClick={() => setActiveLeftPanel('beatboard')}>
             <span className="text-[9px] font-bold uppercase tracking-[0.2em]">+ Add Milestone</span>
           </div>
        </div>
      </div>
    </div>
  );
};
