import React, { useState } from 'react';
import { useAppStore, Location } from "../../store";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { 
  Plus, 
  MapPin, 
  Box, 
  Camera, 
  History, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../ui/card";

export const LocationPanel = () => {
  const { locations, addLocation, updateLocation } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const id = uuidv4();
    addLocation({ 
      id, 
      name: 'New Location', 
      description: '', 
      logistics: '' 
    });
    setExpandedId(id);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between shrink-0 mb-4 px-1">
        <div>
          <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em]">
            Location Gallery
          </h3>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">World Settings</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full" 
          onClick={handleAdd}
        >
          <MapPin className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 px-4 custom-scrollbar font-[var(--font-sans)]">
          <div className="space-y-4 pb-4 pt-2">
          {locations.map((loc) => (
            <Card 
              key={loc.id} 
              className={`p-4 bg-[var(--surface)] border-[var(--border)] rounded-lg shadow-xl backdrop-blur-sm transition-all group overflow-hidden ${expandedId === loc.id ? 'ring-1 ring-[var(--primary)]/30' : 'hover:border-[var(--primary)]/20'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <Box className="w-4 h-4" />
                  </div>
                  <input
                    className="text-sm font-bold text-white bg-transparent border-none p-0 outline-none w-32 placeholder:text-white/20 uppercase tracking-widest"
                    value={loc.name}
                    onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-slate-500 hover:text-white"
                    onClick={() => setExpandedId(expandedId === loc.id ? null : loc.id)}
                  >
                    {expandedId === loc.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {expandedId === loc.id && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 mb-1 block tracking-widest flex items-center gap-1.5 font-mono">
                      <Camera className="w-3 h-3" /> Visual Profile
                    </span>
                    <textarea
                      className="text-xs text-slate-300 bg-black/40 border border-white/5 rounded-md p-2 outline-none w-full resize-none placeholder:text-slate-600 min-h-[60px] focus:border-[var(--primary)]/30 transition-colors"
                      value={loc.description}
                      onChange={(e) => updateLocation(loc.id, { description: e.target.value })}
                      placeholder="Lighting, mood, architecture, soundscape..."
                    />
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-[var(--primary)] mb-1 block tracking-widest flex items-center gap-1.5 font-mono">
                      <History className="w-3 h-3" /> Narrative Potential
                    </span>
                    <textarea
                      className="text-xs text-slate-400 bg-transparent border-none p-0 outline-none w-full resize-none placeholder:text-white/10 min-h-[40px] italic"
                      value={loc.logistics}
                      onChange={(e) => updateLocation(loc.id, { logistics: e.target.value })}
                      placeholder="What events happened here? Why is this place significant?"
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
          {locations.length === 0 && (
            <div className="text-xs text-slate-500 italic text-center py-12 border border-dashed border-white/5 rounded-xl">
              <div className="text-2xl mb-2 opacity-20">📍</div>
              <p className="text-[10px] font-bold uppercase tracking-widest">No locations developed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
