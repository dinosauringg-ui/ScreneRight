import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Sparkles, Plus, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Onboarding = () => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [openingSlug, setOpeningSlug] = useState('');
  const [charInput, setCharInput] = useState('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [genre, setGenre] = useState('');
  const [archetype, setArchetype] = useState('');
  const [format, setFormat] = useState('');
  const [conflict, setConflict] = useState('');

  const handleAddCharacter = () => {
    if (charInput.trim() && !characters.includes(charInput.trim())) {
      setCharacters([...characters, charInput.trim()]);
      setCharInput('');
    }
  };

  const removeCharacter = (name: string) => {
    setCharacters(characters.filter(c => c !== name));
  };

  const handleComplete = () => {
    completeOnboarding({
      title: title || 'UNTITLED SCRIPT',
      openingSlug: openingSlug || 'INT. SCENE - DAY',
      characters,
      genre,
      archetype,
      theme: genre, // default theme to genre
      format,
      conflict
    });
  };

  const genres = [
    { id: 'noir', label: 'Neon Noir', icon: '🌃' },
    { id: 'scifi', label: 'Space Opera', icon: '🚀' },
    { id: 'horror', label: 'Eerie Horror', icon: '🫀' },
    { id: 'dark_comedy', label: 'Dark Comedy', icon: '💀' },
    { id: 'comedy', label: 'Bright Comedy', icon: '🎡' },
    { id: 'fantasy', label: 'Epic Fantasy', icon: '🏰' },
    { id: 'western', label: 'Old West', icon: '🌵' },
    { id: 'thriller', label: 'Pulse', icon: '🩸' }
  ];

  const archetypes = [
    { id: 'journey', label: "Hero's Journey", icon: '🛡️' },
    { id: 'riches', label: 'Rags to Riches', icon: '💎' },
    { id: 'monster', label: 'Overcoming', icon: '👹' },
    { id: 'rebirth', label: 'Rebirth', icon: '🌱' },
    { id: 'tragedy', label: 'Tragedy', icon: '♟️' },
    { id: 'mystery', label: 'Mystery', icon: '🔍' },
    { id: 'heist', label: 'The Heist', icon: '💰' }
  ];

  const formats = [
    { id: 'feature', label: 'Feature Film', icon: '🎬' },
    { id: 'tv', label: 'TV Pilot', icon: '📺' },
    { id: 'short', label: 'Short Film', icon: '⏱️' }
  ];

  const steps = [
    {
      title: "The Project",
      description: "Define the core identity of your narrative.",
      content: (
        <div className="space-y-6 pt-2 h-[380px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Story Structure</label>
            <div className="grid grid-cols-4 gap-2">
              {archetypes.map(a => (
                <button
                  key={a.id}
                  onClick={() => setArchetype(a.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${archetype === a.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10'}`}
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-[7px] font-black uppercase tracking-tighter text-center leading-none">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Narrative Style</label>
            <div className="grid grid-cols-4 gap-2">
              {genres.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGenre(g.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${genre === g.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10'}`}
                >
                  <span className="text-lg">{g.icon}</span>
                  <span className="text-[7px] font-black uppercase tracking-tighter text-center leading-none">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Medium</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all ${format === f.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                >
                  <span className="text-sm">{f.icon}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Working Title</label>
            <Input 
              placeholder="e.g. BEYOND THE HORIZON" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 h-11 text-lg text-white placeholder:text-slate-800 italic font-medium"
            />
          </div>
        </div>
      )
    },
    {
      title: "The Heart",
      description: "Define the core friction that fuels your storytelling.",
      content: (
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">The Central Conflict</label>
            <Textarea 
              placeholder="e.g. A disgraced surgeon must win back her license during a global pandemic while protecting a secret that could destroy her hospital." 
              value={conflict} 
              onChange={e => setConflict(e.target.value)}
              className="bg-white/5 border-white/10 min-h-[150px] text-sm text-slate-200 resize-none italic leading-relaxed"
            />
          </div>
        </div>
      )
    },
    {
      title: "The Opening",
      description: "Set the scene for the first act.",
      content: (
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Opening Slugline</label>
            <Input 
              placeholder="e.g. INT. RUINED CATHEDRAL - DUSK" 
              value={openingSlug} 
              onChange={e => setOpeningSlug(e.target.value)}
              className="bg-white/5 border-white/10 h-12 font-mono uppercase text-white"
            />
            <p className="text-[10px] text-slate-500 italic">The visual anchor of your starting point.</p>
          </div>
        </div>
      )
    },
    {
      title: "The Cast",
      description: "Introduce the key figures who will inhabit this narrative world.",
      content: (
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dramatis Personae</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Name (e.g. Jax, Detective Miller)" 
                value={charInput} 
                onChange={e => setCharInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCharacter()}
                className="bg-white/5 border-white/10 h-10 italic"
              />
              <Button onClick={handleAddCharacter} className="bg-white hover:bg-slate-200 text-black h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
                Add
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 h-[120px] overflow-y-auto content-start">
            {characters.map(c => (
              <motion.div 
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={c} 
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors cursor-default"
              >
                {c}
                <button onClick={() => removeCharacter(c)} className="hover:text-red-500 transition-colors ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
            {characters.length === 0 && (
              <div className="w-full text-center py-6 border border-dashed border-white/5 rounded-xl">
                <div className="text-xl mb-1 opacity-20">👥</div>
                <div className="text-[10px] text-slate-600 italic uppercase">Awaiting the cast...</div>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const totalSteps = steps.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 pointer-events-none opacity-30 mesh-gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="glass-card shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 overflow-hidden">
          <div className="h-1 bg-white/5 w-full">
            <motion.div 
              className="h-full bg-white" 
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em] bg-white/10 px-2 py-0.5 rounded border border-white/20">Story Setup</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            </div>
            <CardTitle className="text-4xl text-white font-serif font-medium tracking-tight italic">{steps[step-1].title}</CardTitle>
            <CardDescription className="text-slate-500 font-medium">{steps[step-1].description}</CardDescription>
          </CardHeader>

          <CardContent className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
              >
                {steps[step-1].content}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/20">
            <Button 
              variant="ghost" 
              onClick={() => step > 1 && setStep(step - 1)}
              className={`text-slate-500 hover:text-white transition-all uppercase text-[9px] tracking-widest font-bold ${step === 1 ? 'invisible' : ''}`}
            >
              Previous
            </Button>
            {step < totalSteps ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && (!title || !genre || !archetype || !format)) || (step === 2 && !conflict) || (step === 3 && !openingSlug)}
                className="bg-white/5 hover:bg-white/10 text-white gap-2 border border-white/10 disabled:opacity-30 group px-8"
              >
                Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={characters.length === 0}
                className="bg-white hover:bg-slate-200 text-black font-black gap-2 transition-all hover:scale-105 active:scale-95 px-8 uppercase text-[10px] tracking-widest"
              >
                Begin Writing <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Workspace Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Draft 01</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
