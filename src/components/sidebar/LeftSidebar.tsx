import { useAppStore } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeatBoard } from "./BeatBoard";
import { TimelineTracker } from "./TimelineTracker";
import { CharacterPanel } from "./CharacterPanel";
import { LocationPanel } from "./LocationPanel";
import { GuidesPanel } from "./GuidesPanel";

export const LeftSidebar = () => {
  const { activeLeftPanel, setActiveLeftPanel } = useAppStore();

  return (
    <div className="h-full flex flex-col bg-transparent text-slate-200">
      <Tabs 
        value={activeLeftPanel} 
        onValueChange={(val) => setActiveLeftPanel(val as any)} 
        className="flex flex-col h-full"
      >
        <div className="px-4 py-2 border-b border-white/5 shrink-0">
          <TabsList className="grid w-full grid-cols-5 h-9 bg-black/20 border border-white/5 rounded-lg p-1">
            <TabsTrigger value="beatboard" className="text-[10px] uppercase font-bold px-1 data-[state=active]:bg-white/10 data-[state=active]:text-[var(--primary)] rounded transition-all">Beats</TabsTrigger>
            <TabsTrigger value="timeline" className="text-[10px] uppercase font-bold px-1 data-[state=active]:bg-white/10 data-[state=active]:text-[var(--primary)] rounded transition-all">Time</TabsTrigger>
            <TabsTrigger value="characters" className="text-[10px] uppercase font-bold px-1 data-[state=active]:bg-white/10 data-[state=active]:text-[var(--primary)] rounded transition-all">Chars</TabsTrigger>
            <TabsTrigger value="locations" className="text-[10px] uppercase font-bold px-1 data-[state=active]:bg-white/10 data-[state=active]:text-[var(--primary)] rounded transition-all">Locs</TabsTrigger>
            <TabsTrigger value="guides" className="text-[10px] uppercase font-bold px-1 data-[state=active]:bg-white/10 data-[state=active]:text-[var(--primary)] rounded transition-all">Build</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="beatboard" className="h-full m-0 data-[state=active]:flex flex-col min-h-0">
            <BeatBoard />
          </TabsContent>
          <TabsContent value="timeline" className="h-full m-0 data-[state=active]:flex flex-col p-4 min-h-0">
            <TimelineTracker />
          </TabsContent>
          <TabsContent value="characters" className="h-full m-0 data-[state=active]:flex flex-col p-4 min-h-0">
            <CharacterPanel />
          </TabsContent>
          <TabsContent value="locations" className="h-full m-0 data-[state=active]:flex flex-col p-4 min-h-0">
            <LocationPanel />
          </TabsContent>
          <TabsContent value="guides" className="h-full m-0 data-[state=active]:flex flex-col p-4 min-h-0">
            <GuidesPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
