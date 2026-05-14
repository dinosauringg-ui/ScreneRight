import { useAppStore, BlockType, ScriptBlock } from "../../store";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Settings2 } from "lucide-react";

const getBlockStyles = (type: BlockType) => {
  switch (type) {
    case 'slugline':
      return 'uppercase font-bold pt-4 pb-2 text-slate-800';
    case 'action':
      return 'py-2 text-slate-700';
    case 'character':
      return 'uppercase ml-[20%] w-[40%] pt-4 text-slate-800';
    case 'parenthetical':
      return 'ml-[15%] w-[30%] text-slate-500 italic';
    case 'dialogue':
      return 'ml-[10%] w-[50%] pb-2 text-slate-700';
    default:
      return '';
  }
};

const BlockMenu = ({ type, onChangeType }: { type: BlockType; onChangeType: (t: BlockType) => void }) => {
  return (
    <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center p-1 bg-white/5 backdrop-blur-md rounded-md border border-white/10 scale-90 hover:scale-100">
      <select 
        value={type} 
        onChange={e => onChangeType(e.target.value as BlockType)}
        className="text-[9px] uppercase font-bold text-cyan-400 bg-transparent outline-none cursor-pointer appearance-none px-1"
      >
        <option value="slugline" className="bg-slate-900 border-none">SLUG</option>
        <option value="action" className="bg-slate-900 border-none">ACT</option>
        <option value="character" className="bg-slate-900 border-none">CHAR</option>
        <option value="parenthetical" className="bg-slate-900 border-none">PAREN</option>
        <option value="dialogue" className="bg-slate-900 border-none">DIAL</option>
      </select>
    </div>
  );
};

const SmartTextarea: React.FC<{ 
  block: ScriptBlock;
  index: number;
  totalLength: number;
  onChange: (text: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  onChangeType: (type: BlockType) => void;
  onUp: () => void;
  onDown: () => void;
}> = ({ 
  block,
  index,
  totalLength,
  onChange,
  onEnter,
  onBackspace,
  onChangeType,
  onUp,
  onDown
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { characters, locations } = useAppStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [block.text, block.type]);

  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    if (block.type === 'character' && block.text.length > 0) {
      const match = characters.find(c => c.name.toLowerCase().startsWith(block.text.toLowerCase()));
      if (match && match.name.toLowerCase() !== block.text.toLowerCase()) {
        setPrediction(match.name);
      } else {
        setPrediction(null);
      }
    } else if (block.type === 'slugline' && block.text.length > 0) {
      const match = locations.find(l => l.name.toLowerCase().startsWith(block.text.toLowerCase()));
      if (match && match.name.toLowerCase() !== block.text.toLowerCase()) {
        setPrediction(match.name);
      } else {
        setPrediction(null);
      }
    } else {
      setPrediction(null);
    }
  }, [block.text, block.type, characters, locations]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    } else if (e.key === 'Backspace' && block.text === '') {
      e.preventDefault();
      onBackspace();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (prediction) {
        onChange(prediction.toUpperCase());
        setPrediction(null);
      } else {
        // Flow changes on Tab:
        if (block.type === 'action') onChangeType('character');
        else if (block.type === 'character') onChangeType('dialogue');
        else if (block.type === 'dialogue') onChangeType('parenthetical');
        else if (block.type === 'parenthetical') onChangeType('action');
        else if (block.type === 'slugline') onChangeType('action');
      }
    } else if (e.key === 'ArrowUp') {
      if (e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        onUp();
      }
    } else if (e.key === 'ArrowDown') {
      if (e.currentTarget.selectionEnd === block.text.length) {
        e.preventDefault();
        onDown();
      }
    }
  };

  return (
    <div className={`relative group flex flex-col ${getBlockStyles(block.type)}`}>
      <BlockMenu type={block.type} onChangeType={onChangeType} />
      {prediction && (
        <div className="absolute -top-4 left-0 text-[10px] text-[var(--accent)] italic font-bold tracking-wider animate-in fade-in slide-in-from-bottom-1 underline decoration-[var(--primary)]/50">
          [TAB: {prediction.toUpperCase()}]
        </div>
      )}
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent resize-none outline-none leading-relaxed text-slate-800 placeholder:text-slate-300"
        value={block.text}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={block.type.toUpperCase()}
        rows={1}
      />
    </div>
  );
};

export const ScriptEditor = () => {
  const { scriptBlocks, setScriptBlocks, addBlock, removeBlock, updateBlock } = useAppStore();
  const editorRef = useRef<HTMLDivElement>(null);

  const getNextType = (currentType: BlockType): BlockType => {
    if (currentType === 'slugline') return 'action';
    if (currentType === 'character') return 'dialogue';
    if (currentType === 'parenthetical') return 'dialogue';
    if (currentType === 'dialogue') return 'character';
    return 'action';
  };

  const handleEnter = (index: number, currentType: BlockType) => {
    const nextType = getNextType(currentType);
    addBlock(index + 1, { id: uuidv4(), type: nextType, text: '' });
    // Focus logic will be deferred slightly to allow render
    setTimeout(() => {
      if (editorRef.current) {
        const textareas = editorRef.current.querySelectorAll('textarea');
        if (textareas[index + 1]) {
          textareas[index + 1].focus();
        }
      }
    }, 10);
  };

  const handleBackspace = (index: number) => {
    if (scriptBlocks.length > 1) {
      removeBlock(scriptBlocks[index].id);
      setTimeout(() => {
        if (editorRef.current) {
          const textareas = editorRef.current.querySelectorAll('textarea');
          if (textareas[index - 1]) {
            textareas[index - 1].focus();
            const length = textareas[index - 1].value.length;
            textareas[index - 1].setSelectionRange(length, length);
          }
        }
      }, 10);
    }
  };

  const focusOffset = (index: number, offset: number) => {
    setTimeout(() => {
      if (editorRef.current) {
        const textareas = editorRef.current.querySelectorAll('textarea');
        if (textareas[index + offset]) {
          textareas[index + offset].focus();
        }
      }
    }, 10);
  };

  return (
    <div 
      className="bg-white shadow-xl min-h-[1056px] w-[816px] mx-auto p-16 pb-32 text-sm leading-relaxed border-t border-b sm:border border-stone-200"
      ref={editorRef}
      style={{
        fontFamily: "var(--font-mono)",
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
    >
      {scriptBlocks.map((block, i) => (
        <SmartTextarea
          key={block.id}
          index={i}
          totalLength={scriptBlocks.length}
          block={block}
          onChange={(text) => updateBlock(block.id, { text })}
          onEnter={() => handleEnter(i, block.type)}
          onBackspace={() => handleBackspace(i)}
          onChangeType={(type) => updateBlock(block.id, { type })}
          onUp={() => focusOffset(i, -1)}
          onDown={() => focusOffset(i, 1)}
        />
      ))}

      {scriptBlocks.length === 0 && (
        <div className="text-stone-300 italic p-4 text-center cursor-pointer" onClick={() => addBlock(0, { id: uuidv4(), type: 'slugline', text: '' })}>
          Click to start writing...
        </div>
      )}
    </div>
  );
};
