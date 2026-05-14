import { useAppStore } from './store';
import { ScriptEditor } from '@/components/editor/ScriptEditor';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { BrainstormSidebar } from '@/components/brainstorm/BrainstormSidebar';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { StoryBlueprint } from '@/components/planning/StoryBlueprint';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, EyeOff, LayoutPanelLeft, MessagesSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PDFExportOptions } from '@/components/export/PDFExportOptions';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { ThemeWrapper } from '@/components/ThemeWrapper';

export default function App() {
  const { 
    leftSidebarOpen, 
    rightSidebarOpen, 
    distractionFree,
    hasOnboarded,
    projectTitle,
    activeView,
    toggleLeftSidebar,
    toggleRightSidebar,
    setDistractionFree,
    setActiveView
  } = useAppStore();

  const [exportOpen, setExportOpen] = useState(false);

  return (
    <TooltipProvider>
      <ThemeWrapper>
        <div className="flex flex-col h-screen w-full bg-[var(--background)] overflow-hidden font-[var(--font-sans)] text-white selection:bg-[var(--primary)]/30 relative">
          {!hasOnboarded && <Onboarding />}
          
          {/* Mesh Gradient Background Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-20 z-0 mesh-gradient" />
          
          {/* Top Bar - Full Width */}
          {!distractionFree && (
            <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--surface)]/40 backdrop-blur-xl z-50 shrink-0">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger 
                    render={
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => {
                        toggleLeftSidebar();
                      }} />
                    }
                  >
                    <LayoutPanelLeft className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent>Toggle Panels</TooltipContent>
                </Tooltip>
                
                <div className="flex flex-col ml-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 leading-none mb-1">STORY WORKSPACE</span>
                  <span className="text-lg font-serif font-medium text-white tracking-tight group cursor-pointer hover:text-[var(--primary)] transition-colors" onClick={() => setActiveView('planning')}>
                    {projectTitle}
                  </span>
                </div>
              </div>

              <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                <button 
                  onClick={() => setActiveView('planning')}
                  className={`px-6 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full transition-all ${activeView === 'planning' ? 'bg-white text-black' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Blueprint
                </button>
                <button 
                  onClick={() => setActiveView('scripting')}
                  className={`px-6 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full transition-all ${activeView === 'scripting' ? 'bg-white text-black' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Manuscript
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger 
                    render={
                      <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setDistractionFree(!distractionFree)} />
                    }
                  >
                    <EyeOff className={`w-4 h-4 ${distractionFree ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                  </TooltipTrigger>
                  <TooltipContent>Focus Mode</TooltipContent>
                </Tooltip>
                
                <div className="w-px h-5 bg-white/10 mx-1" />
                
                <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                  <DialogTrigger 
                    render={
                      <Button className="bg-white hover:bg-slate-200 text-black h-8 gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all" />
                    }
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Export
                  </DialogTrigger>
                  <DialogContent className="glass-card text-white border-white/20">
                    <PDFExportOptions onClose={() => setExportOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Tooltip>
                  <TooltipTrigger 
                    render={
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => {
                        toggleRightSidebar();
                      }} />
                    }
                  >
                    <MessagesSquare className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent>Brainstorm window</TooltipContent>
                </Tooltip>
              </div>
            </header>
          )}

          <div className="flex flex-1 overflow-hidden relative">
            {/* Left Sidebar */}
            {leftSidebarOpen && !distractionFree && (
              <div className="w-80 h-full glass border-r shrink-0 z-10 transition-all duration-300">
                <LeftSidebar />
              </div>
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full bg-transparent transition-all duration-300 relative z-1 overflow-hidden">
              <main className="flex-1 overflow-y-auto scroll-smooth">
                {activeView === 'planning' ? (
                  <StoryBlueprint />
                ) : (
                  <div className="max-w-4xl mx-auto flex flex-col items-center py-8 md:py-12">
                    <ScriptEditor />
                  </div>
                )}
              </main>
            </div>

            {/* Right Sidebar (Brainstorm / AI) */}
            {rightSidebarOpen && !distractionFree && (
              <div className="w-80 h-full glass border-l shrink-0 z-10 transition-all duration-300">
                <BrainstormSidebar />
              </div>
            )}
          </div>
        </div>
      </ThemeWrapper>
    </TooltipProvider>
  );
}
