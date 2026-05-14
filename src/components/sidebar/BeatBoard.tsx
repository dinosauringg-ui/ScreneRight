import { useAppStore } from "../../store";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card } from "../ui/card";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { ScrollArea } from "../ui/scroll-area";

export const BeatBoard = () => {
  const { beats, reorderBeats, addBeat, updateBeat } = useAppStore();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderBeats(result.source.index, result.destination.index);
  };

  const handleAddBeat = () => {
    addBeat({
      id: uuidv4(),
      title: "New Objective",
      description: "",
      type: 'setup',
      order: beats.length,
    });
  };

  const beatTypes = {
    setup: { label: 'Setup', color: 'bg-blue-500', icon: '📍' },
    action: { label: 'Action', color: 'bg-orange-500', icon: '⚔️' },
    reveal: { label: 'Reveal', color: 'bg-purple-500', icon: '👁️' },
    climax: { label: 'Climax', color: 'bg-red-500', icon: '🔥' }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-transparent">
      <div className="p-4 flex items-center justify-between shrink-0 border-b border-white/5 bg-black/20">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Inventory</span>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Beat Board</h3>
        </div>
        <Button variant="ghost" size="icon" className="text-[var(--primary)] hover:text-[var(--accent)] hover:bg-[var(--primary)]/10 rounded-full h-8 w-8" onClick={handleAddBeat}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 custom-scrollbar font-[var(--font-sans)]">
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="beats-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 pt-6">
                {beats.length === 0 && (
                  <div className="text-center py-12 px-6 border border-dashed border-white/10 rounded-xl font-[var(--font-sans)]">
                    <div className="text-2xl mb-2 opacity-20">📜</div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Your story is empty. <br/>Add your first objective.
                    </p>
                  </div>
                )}
                {beats.map((beat, index) => (
                  // @ts-ignore
                  <Draggable key={beat.id} draggableId={beat.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative p-4 bg-[var(--surface)] border-[var(--border)] rounded-xl shadow-2xl transition-all ${
                          snapshot.isDragging 
                            ? "scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-2 ring-[var(--primary)]/50 rotate-[-1deg] z-50 bg-slate-800" 
                            : "hover:border-[var(--primary)]/30 hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Type Decoration */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-xl ${beatTypes[beat.type || 'setup'].color}`} />
                        
                        <div className="flex gap-3 items-start">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-0.5 cursor-grab opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-400 transition-opacity"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <input
                                className="text-[11px] font-black text-white bg-transparent border-none p-0 outline-none w-full placeholder:text-slate-700 uppercase tracking-widest"
                                value={beat.title}
                                onChange={(e) => updateBeat(beat.id, { title: e.target.value })}
                                placeholder="THE HOOK..."
                              />
                              <div className="flex gap-1 shrink-0">
                                {(Object.keys(beatTypes) as Array<keyof typeof beatTypes>).map(type => (
                                  <button
                                    key={type}
                                    onClick={() => updateBeat(beat.id, { type })}
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-all ${beat.type === type ? 'scale-110 opacity-100 ring-1 ring-white/50 ring-offset-1 ring-offset-black' : 'opacity-20 hover:opacity-50 grayscale'}`}
                                    title={beatTypes[type].label}
                                  >
                                    {beatTypes[type].icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <textarea
                              className="text-[11px] text-slate-400 leading-relaxed bg-transparent border-none p-0 outline-none w-full resize-none placeholder:text-slate-800 min-h-[44px] italic"
                              value={beat.description}
                              onChange={(e) => updateBeat(beat.id, { description: e.target.value })}
                              placeholder="Enter situational details..."
                            />
                            
                            <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-500">Phase {index + 1}</span>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${beatTypes[beat.type || 'setup'].color} bg-opacity-10 text-opacity-80`}>
                                {beatTypes[beat.type || 'setup'].label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
