import React, { useState } from 'react';
import { useAppStore, Character } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  Shield, 
  Skull, 
  UserPlus, 
  Tags,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Target,
  Briefcase,
  UserCircle
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleGenAI, Type } from "@google/genai";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CharacterEditorDialog = ({ character }: { character: Character }) => {
  const updateCharacter = useAppStore(state => state.updateCharacter);
  
  return (
    <DialogContent className="max-w-2xl bg-slate-950 border-white/10 text-white font-[var(--font-sans)]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <UserCircle className="text-[var(--primary)]" />
          Character Profile: {character.name}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Full Name</Label>
            <Input 
              value={character.name} 
              onChange={e => updateCharacter(character.id, { name: e.target.value })}
              className="bg-white/5 border-white/10 h-10"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Archetype</Label>
              <Select 
                value={character.archetype} 
                onValueChange={(val: any) => updateCharacter(character.id, { archetype: val })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="protagonist">Protagonist</SelectItem>
                  <SelectItem value="antagonist">Antagonist</SelectItem>
                  <SelectItem value="supporting">Supporting</SelectItem>
                  <SelectItem value="catalyst">Catalyst</SelectItem>
                  <SelectItem value="foil">Foil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Age / Era</Label>
              <Input 
                value={character.age || ''} 
                onChange={e => updateCharacter(character.id, { age: e.target.value })}
                className="bg-white/5 border-white/10 h-10"
                placeholder="e.g. 28, Eternal"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Occupation</Label>
              <Input 
                value={character.occupation || ''} 
                onChange={e => updateCharacter(character.id, { occupation: e.target.value })}
                className="bg-white/5 border-white/10 h-10"
                placeholder="e.g. Smuggler"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Core Motivation</Label>
            <textarea 
              value={character.motivation || ''} 
              onChange={e => updateCharacter(character.id, { motivation: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-xs min-h-[80px] outline-none focus:border-[var(--primary)]/50"
              placeholder="What drives them?"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Fatal Flaw</Label>
            <Input 
              value={character.flaw || ''} 
              onChange={e => updateCharacter(character.id, { flaw: e.target.value })}
              className="bg-white/5 border-white/10 h-10"
              placeholder="Pride, Greed, etc."
            />
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Backstory Fragments</Label>
          <textarea 
            value={character.backstory || ''} 
            onChange={e => updateCharacter(character.id, { backstory: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-xs min-h-[100px] outline-none focus:border-[var(--primary)]/50"
            placeholder="Key life events, traumas, secrets..."
          />
        </div>
      </div>
    </DialogContent>
  );
};

export const CharacterPanel = () => {
  const { characters, addCharacter, updateCharacter, removeCharacter, projectGenre, projectTheme } = useAppStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const id = uuidv4();
    addCharacter({ 
      id, 
      name: 'New Character', 
      archetype: 'supporting',
      age: '',
      occupation: '',
      motivation: '',
      flaw: '',
      description: '', 
      arc: '',
      backstory: '',
      traits: []
    });
    setExpandedId(id);
  };

  const generateTraits = async (e: React.MouseEvent, char: Character) => {
    e.stopPropagation();
    setLoadingId(char.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 5 personality traits or narrative hooks for a character in a ${projectGenre} story. 
        Name: ${char.name}
        Archetype: ${char.archetype}
        Description: ${char.description}
        Theme: ${projectTheme}
        Return as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const traits = JSON.parse(response.text);
      if (Array.isArray(traits)) {
        updateCharacter(char.id, { traits: [...new Set([...(char.traits || []), ...traits])] });
      }
    } catch (error) {
      console.error("Failed to generate traits", error);
    } finally {
      setLoadingId(null);
    }
  };

  const removeTrait = (e: React.MouseEvent, charId: string, traitIndex: number) => {
    e.stopPropagation();
    const char = characters.find(c => c.id === charId);
    if (!char) return;
    const newTraits = [...char.traits];
    newTraits.splice(traitIndex, 1);
    updateCharacter(charId, { traits: newTraits });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between shrink-0 mb-4 px-1">
        <div>
          <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em]">
            Dramatis Personae
          </h3>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Cast Registry</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full" 
          onClick={handleAdd}
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 px-4 custom-scrollbar font-[var(--font-sans)]">
          <div className="space-y-3 pb-4 pt-2">
          {characters.map((char) => (
            <div key={char.id}>
              <Dialog>
                <Card 
                  className={`p-0 bg-[var(--surface)] border-[var(--border)] rounded-lg shadow-xl backdrop-blur-sm transition-all group overflow-hidden ${expandedId === char.id ? 'ring-1 ring-[var(--primary)]/30' : 'hover:border-[var(--primary)]/20 shadow-none'}`}
                  onClick={() => setExpandedId(expandedId === char.id ? null : char.id)}
                >
                <div className="p-4 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                        char.archetype === 'protagonist' ? 'bg-cyan-500/20 text-cyan-400' :
                        char.archetype === 'antagonist' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {char.archetype === 'protagonist' ? <Shield className="w-4 h-4" /> : 
                        char.archetype === 'antagonist' ? <Skull className="w-4 h-4" /> : 
                        <User className="w-4 h-4" />}
                      </div>
                      <DialogTrigger 
                        nativeButton={false}
                        render={
                          <div className="flex flex-col cursor-pointer group/name">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover/name:text-[var(--primary)] transition-colors">
                              {char.name || 'Unnamed Character'}
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold decoration-[var(--primary)]/30 underline underline-offset-2">
                              {char.archetype}
                            </span>
                          </div>
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <DialogTrigger 
                      render={
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-slate-600 hover:text-[var(--primary)] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                          title="Open Editor"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {expandedId === char.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      {/* Robust Sidebar Info */}
                      {(char.age || char.occupation) && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-[8px] uppercase font-bold text-slate-500 block">Age</span>
                            <span className="text-[10px] text-slate-300 font-mono italic">{char.age || 'Unknown'}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-[8px] uppercase font-bold text-slate-500 block">Job</span>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-2.5 h-2.5 text-slate-600" />
                              <span className="text-[10px] text-slate-300 truncate">{char.occupation || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className="text-[8px] uppercase font-bold text-slate-500 flex items-center gap-1.5 tracking-widest">
                          <Target className="w-3 h-3" /> Core Motivation
                        </span>
                        <p className="text-[10px] text-slate-400 italic bg-black/10 p-2 rounded border-l border-[var(--primary)]/30">
                          {char.motivation || 'Motivation not yet calibrated...'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] uppercase font-bold text-slate-500 flex items-center gap-1.5 tracking-widest">
                            <Tags className="w-3 h-3" /> Personality Traits
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 text-[8px] font-bold uppercase text-[var(--primary)] hover:text-white px-1 gap-1"
                            onClick={(e) => generateTraits(e, char)}
                            disabled={loadingId === char.id}
                          >
                            {loadingId === char.id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                            Suggest
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {char.traits?.map((trait, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[9px] text-slate-300 flex items-center gap-1 group/trait hover:border-[var(--primary)]/30 transition-colors"
                            >
                              {trait}
                              <button 
                                onClick={(e) => removeTrait(e, char.id, idx)}
                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover/trait:opacity-100 transition-opacity"
                              >
                                <Plus className="w-2.5 h-2.5 rotate-45" />
                              </button>
                            </div>
                          ))}
                          {(!char.traits || char.traits.length === 0) && (
                            <span className="text-[9px] text-slate-600 italic">No traits detected.</span>
                          )}
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full h-7 text-[9px] font-bold uppercase text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 border-dashed"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this character?')) {
                             removeCharacter(char.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1.5 transition-transform group-hover:scale-110" /> Remove Character
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
              <CharacterEditorDialog character={char} />
            </Dialog>
          </div>
          ))}
          
          {characters.length === 0 && (
            <div className="text-xs text-slate-500 italic text-center py-12 border border-dashed border-white/5 rounded-xl">
              <div className="text-2xl mb-2 opacity-20">👥</div>
              <p className="text-[10px] font-bold uppercase tracking-widest">No characters created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
