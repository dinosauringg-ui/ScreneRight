import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Sparkles, Loader2, Bot } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export const BrainstormSidebar = () => {
  const { scriptBlocks, characters, locations, beats } = useAppStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I am your co-writer. I can help brainstorm plot holes, generate alt-lines, or review your script. What are we working on today?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing API Key");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Build context
      const scriptText = scriptBlocks.map(b => b.text).join('\n');
      const biblesContext = `
Characters: ${characters.map(c => c.name + " - " + c.description).join(', ')}
Locations: ${locations.map(l => l.name + " - " + l.description).join(', ')}
Beats: ${beats.map(b => b.title).join(' -> ')}
      `;

      const prompt = `You are an expert screenwriter and co-writer. You help the user write their script. 
Here is their current script context:
---SCRIPT---
${scriptText}

---BIBLES & BEATS---
${biblesContext}

Respond concisely and creatively to the following user request: ${userMessage}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm not sure what to say." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI. Please ensure your GEMINI_API_KEY is set in settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-white/5 shrink-0 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-[0.2em] font-[var(--font-sans)]">Brainstorming Bot</h3>
      </div>

      <ScrollArea className="flex-1 p-4 font-[var(--font-sans)]" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-white/10 border-white/20 text-white' : 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_15px_var(--glow)] border-[var(--primary)]'}`}>
                {m.role === 'user' ? <span className="text-[10px] font-bold">U</span> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`text-xs p-3 rounded-xl max-w-[85%] leading-relaxed shadow-lg backdrop-blur-md border ${m.role === 'user' ? 'bg-white/15 border-white/20 text-white rounded-tr-none' : 'bg-[var(--surface)] border-white/5 text-slate-200 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--surface)] text-[var(--primary)] border border-white/5 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xs p-3 rounded-xl bg-[var(--surface)] border border-white/5 rounded-tl-none shadow-sm flex items-center gap-2 text-slate-400 backdrop-blur-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/10 shrink-0 font-[var(--font-sans)]">
        <div className="relative">
          <Textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pressure test plot hole..."
            className="pr-10 resize-none h-20 min-h-0 bg-white/5 border-white/10 text-xs focus-visible:ring-1 focus-visible:ring-[var(--primary)]/50 placeholder:text-slate-600 rounded-lg"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-2 bottom-2 h-6 w-6 rounded-full hover:bg-white/10 text-[var(--primary)]"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
