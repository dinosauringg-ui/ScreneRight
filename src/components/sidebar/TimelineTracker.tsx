import { useAppStore } from "../../store";
import { ScrollArea } from "../ui/scroll-area";

export const TimelineTracker = () => {
  const { beats } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between shrink-0 mb-4 px-1">
        <div>
          <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em]">Master Timeline</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Chronological flow</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-4 px-4 pt-4 custom-scrollbar font-[var(--font-sans)]">
          <div className="relative border-l border-white/10 ml-3 space-y-8 pb-6">
          {beats.map((beat, i) => (
            <div key={beat.id} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-700 rounded-full ring-4 ring-black/40 transition-all group-hover:bg-[var(--accent)] group-hover:ring-[var(--primary)]/20" />
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase font-bold tracking-[0.1em] text-slate-500">
                  PT {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold text-slate-200 line-clamp-1">{beat.title}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                {beat.description}
              </p>
            </div>
          ))}
          {beats.length === 0 && (
            <div className="pl-6 text-xs text-slate-500 italic">No beats added to timeline.</div>
          )}
        </div>
      </div>
    </div>
  );
};
