import React, { useState } from 'react';
import { useAppStore } from "../../store";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { 
  BookOpen, 
  Map, 
  Flag, 
  Zap, 
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface GuideStep {
  title: string;
  description: string;
}

interface NarrativeGuide {
  id: string;
  name: string;
  icon: React.ReactNode;
  steps: GuideStep[];
}

const GUIDES: NarrativeGuide[] = [
  {
    id: 'hero',
    name: "The Hero's Journey",
    icon: <Map className="w-4 h-4" />,
    steps: [
      { title: "Ordinary World", description: "The hero's normal life before the journey begins." },
      { title: "Call to Adventure", description: "A problem or opportunity arises that requires action." },
      { title: "Refusal of the Call", description: "The hero hesitates or refuses due to fear or insecurity." },
      { title: "Meeting the Mentor", description: "A guide provides training, equipment, or advice." },
      { title: "Crossing the First Threshold", description: "The hero fully commits to the journey and leaves home." },
      { title: "Tests, Allies, and Enemies", description: "The hero explores the new world and faces challenges." },
      { title: "Approach to the Inmost Cave", description: "Getting closer to the ultimate goal or danger." },
      { title: "The Ordeal", description: "A major hurdle or life-or-death crisis." },
      { title: "The Reward", description: "The hero survives and gains a prize or knowledge." },
      { title: "The Road Back", description: "Descending back to the ordinary world, often with a chase." },
      { title: "Resurrection", description: "A final, climactic test that transforms the hero." },
      { title: "Return with the Elixir", description: "Returning home with something to heal or improve the world." }
    ]
  },
  {
    id: 'save-cat',
    name: "Save the Cat Beat Sheet",
    icon: <Zap className="w-4 h-4" />,
    steps: [
      { title: "Opening Image", description: "A snapshot of the hero's life as it is now." },
      { title: "Theme Stated", description: "Someone (not the hero) hints at what the hero must learn." },
      { title: "Set-up", description: "Introduce all main characters and the status quo." },
      { title: "Catalyst", description: "The life-changing event (the 'Inciting Incident')." },
      { title: "Debate", description: "The hero wonders if they should take on the challenge." },
      { title: "Break into Two", description: "Leaving the old world for the new one." },
      { title: "B Story", description: "A subplot, often romantic, that reflects the theme." },
      { title: "Fun and Games", description: "The 'promise of the premise'—classic genre moments." },
      { title: "Midpoint", description: "A false victory or false defeat that raises the stakes." },
      { title: "Bad Guys Close In", description: "Internal or external forces pressure the hero." },
      { title: "All is Lost", description: "The hero hits rock bottom; a 'whiff of death'." },
      { title: "Dark Night of the Soul", description: "The hero mourns and reflects before their revelation." },
      { title: "Break into Three", description: "The hero finds a new plan or internal strength." },
      { title: "Finale", description: "Executing the plan and overcoming the obstacle." },
      { title: "Final Image", description: "A snapshot of the hero's life transformed." }
    ]
  },
  {
    id: 'three-act',
    name: "Standard Three-Act Structure",
    icon: <BookOpen className="w-4 h-4" />,
    steps: [
      { title: "Act I: Setup", description: "Establish characters, goals, and the inciting incident." },
      { title: "Plot Point 1", description: "The protagonist is forced to commit to the goal." },
      { title: "Act II: Confrontation", description: "Escalating obstacles and local conflicts." },
      { title: "The Midpoint", description: "A massive shift in context or a temporary win/loss." },
      { title: "Plot Point 2", description: "The hero hits a low point but finds a way forward." },
      { title: "Act III: Resolution", description: "The final showdown and the aftermath." }
    ]
  },
  {
    id: 'mystery',
    name: "The Mystery Track",
    icon: <Info className="w-4 h-4" />,
    steps: [
      { title: "The Discovery", description: "A crime, disappearance, or strange event occurs." },
      { title: "Initial Investigation", description: "Gathering obvious clues and interviewing witnesses." },
      { title: "The Red Herring", description: "A false lead that distracts the protagonist." },
      { title: "The Second Crime", description: "Something goes wrong, or another clue appears, raising stakes." },
      { title: "The Breakthrough", description: "A critical piece of evidence is finally understood." },
      { title: "The Reveal", description: "The truth is exposed in a dramatic confrontation." }
    ]
  },
  {
    id: 'heist',
    name: "The Heist Method",
    icon: <Flag className="w-4 h-4" />,
    steps: [
      { title: "The Job", description: "An impossible-to-get item or a major score is identified." },
      { title: "The Team", description: "Recruiting specialists with unique skills." },
      { title: "The Plan", description: "Mapping out the target and identifying security flaws." },
      { title: "The Break-in", description: "Infiltration begins; early successes." },
      { title: "The Twist", description: "The plan fails or an unexpected variable appears." },
      { title: "The Escape", description: "Getting out alive with the prize against all odds." }
    ]
  }
];

export const GuidesPanel = () => {
  const { projectArchetype } = useAppStore();
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const selectedGuide = GUIDES.find(g => g.id === selectedGuideId);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between shrink-0 mb-4 px-1">
        <div>
          <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em]">
            Narrative Library
          </h3>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Foundational Guides</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 px-4 custom-scrollbar font-[var(--font-sans)]">
          <div className="space-y-4 pb-4">
          {!selectedGuideId ? (
            <div className="grid gap-3">
              {GUIDES.map(guide => {
                const isRecommended = guide.id === projectArchetype;
                return (
                  <Card 
                    key={guide.id}
                    className={`p-4 bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]/30 transition-all cursor-pointer group relative overflow-hidden ${isRecommended ? 'ring-1 ring-[var(--primary)]/50 border-[var(--primary)]/20' : ''}`}
                    onClick={() => setSelectedGuideId(guide.id)}
                  >
                    {isRecommended && (
                      <div className="absolute top-0 right-0 bg-[var(--primary)] text-black text-[7px] font-black px-2 py-0.5 uppercase tracking-widest rounded-bl-lg z-10">
                        Recommended
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRecommended ? 'bg-[var(--primary)] text-black' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                          {guide.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{guide.name}</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest">{guide.steps.length} Milestones</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                  </Card>
                );
              })}

              
              <div className="mt-8 p-4 border border-dashed border-white/5 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Writer's Tip</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  "Structure is a roadmap, not a set of rails. Use these templates to ensure your story has the necessary emotional beats, then break the rules where your vision demands it."
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-bold uppercase text-slate-500 hover:text-white mb-2 p-0"
                onClick={() => setSelectedGuideId(null)}
              >
                ← Back to Library
              </Button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">
                  {selectedGuide?.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">{selectedGuide?.name}</h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">Story Structure Breakdown</p>
                </div>
              </div>

              <div className="space-y-6 relative ml-4 border-l border-white/5 pl-6">
                {selectedGuide?.steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10" />
                    <div className="absolute -left-[35px] top-1 w-4.5 h-4.5 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-[var(--primary)] opacity-50">#{String(idx + 1).padStart(2, '0')}</span>
                        <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{step.title}</h5>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
