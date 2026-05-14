import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type BlockType = 'action' | 'character' | 'dialogue' | 'parenthetical' | 'slugline';

export type ScriptBlock = {
  id: string;
  type: BlockType;
  text: string;
};

export type Beat = {
  id: string;
  title: string;
  description: string;
  type?: 'setup' | 'action' | 'reveal' | 'climax';
  color?: string;
  order: number;
};

export type Character = {
  id: string;
  name: string;
  archetype: 'protagonist' | 'antagonist' | 'supporting' | 'catalyst' | 'foil';
  age?: string;
  occupation?: string;
  motivation?: string;
  flaw?: string;
  description: string;
  arc: string;
  backstory?: string;
  traits: string[];
  color?: string;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  logistics: string;
};

interface AppState {
  // Project Info
  projectTitle: string;
  projectGenre: string;
  projectTheme: string;
  projectArchetype: string;
  projectFormat: string;
  projectConflict: string;
  setProjectTitle: (title: string) => void;
  resetProject: () => void;

  // Onboarding
  hasOnboarded: boolean;
  completeOnboarding: (data: { 
    title: string; 
    openingSlug: string; 
    characters: string[];
    genre: string;
    archetype: string;
    theme: string;
    format: string;
    conflict: string;
  }) => void;
  setProjectTheme: (theme: string) => void;

  // Script Editor
  scriptBlocks: ScriptBlock[];
  setScriptBlocks: (blocks: ScriptBlock[]) => void;
  updateBlock: (id: string, partial: Partial<ScriptBlock>) => void;
  addBlock: (index: number, block: ScriptBlock) => void;
  removeBlock: (id: string) => void;

  // Bibles
  characters: Character[];
  addCharacter: (char: Character) => void;
  updateCharacter: (id: string, char: Partial<Character>) => void;
  
  locations: Location[];
  addLocation: (loc: Location) => void;
  updateLocation: (id: string, loc: Partial<Location>) => void;

  // Beat Board
  beats: Beat[];
  addBeat: (beat: Beat) => void;
  updateBeat: (id: string, beat: Partial<Beat>) => void;
  reorderBeats: (startIndex: number, endIndex: number) => void;

  // UI State
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeLeftPanel: 'beatboard' | 'timeline' | 'characters' | 'locations' | 'guides';
  activeRightPanel: 'brainstorming' | null;
  distractionFree: boolean;
  activeView: 'planning' | 'scripting';
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveLeftPanel: (panel: 'beatboard' | 'timeline' | 'characters' | 'locations' | 'guides') => void;
  setDistractionFree: (val: boolean) => void;
  setActiveView: (view: 'planning' | 'scripting') => void;
  removeCharacter: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projectTitle: 'NEW PROJECT',
      projectGenre: '',
      projectArchetype: '',
      projectTheme: 'default',
      projectFormat: '',
      projectConflict: '',
      setProjectTitle: (title) => set({ projectTitle: title }),
      setProjectTheme: (theme) => set({ projectTheme: theme }),
      resetProject: () => {
        set({
          hasOnboarded: false,
          projectTitle: '',
          projectGenre: '',
          projectArchetype: '',
          projectTheme: 'default',
          projectFormat: '',
          projectConflict: '',
          scriptBlocks: [],
          beats: [],
          characters: [],
          locations: [],
          activeView: 'planning',
          activeLeftPanel: 'beatboard',
          distractionFree: false,
          leftSidebarOpen: true,
          rightSidebarOpen: true
        });
        // Explicitly clear local storage to be sure
        localStorage.removeItem('screenwriter-storage');
        // Force a reload to ensure all state is clean
        window.location.reload();
      },

      hasOnboarded: false,
      completeOnboarding: ({ title, openingSlug, characters, genre, archetype, theme, format, conflict }) => set((state) => ({
        hasOnboarded: true,
        projectTitle: title,
        projectGenre: genre,
        projectArchetype: archetype,
        projectTheme: theme || genre,
        projectFormat: format,
        projectConflict: conflict,
        activeView: 'planning',
        scriptBlocks: [
          { id: uuidv4(), type: 'slugline', text: openingSlug || 'INT. SCENE - DAY' },
          { id: uuidv4(), type: 'action', text: '' }
        ],
        characters: characters.map(name => ({
          id: uuidv4(),
          name,
          archetype: 'protagonist',
          age: '',
          occupation: '',
          motivation: '',
          flaw: '',
          description: '',
          arc: '',
          backstory: '',
          traits: []
        })),
        beats: [
          { id: uuidv4(), title: 'The Opening', description: conflict || 'Introduce the world and characters.', order: 0 }
        ]
      })),

      scriptBlocks: [],
      setScriptBlocks: (blocks) => set({ scriptBlocks: blocks }),
      updateBlock: (id, partial) => set((state) => ({
        scriptBlocks: state.scriptBlocks.map((b) => (b.id === id ? { ...b, ...partial } : b))
      })),
      addBlock: (index, block) => set((state) => {
        const newBlocks = [...state.scriptBlocks];
        newBlocks.splice(index, 0, block);
        return { scriptBlocks: newBlocks };
      }),
      removeBlock: (id) => set((state) => ({
        scriptBlocks: state.scriptBlocks.filter((b) => b.id !== id)
      })),

      characters: [],
      addCharacter: (char) => set((state) => ({ characters: [...state.characters, char] })),
      updateCharacter: (id, updatedChar) => set((state) => ({
        characters: state.characters.map((c) => (c.id === id ? { ...c, ...updatedChar } : c))
      })),

      locations: [],
      addLocation: (loc) => set((state) => ({ locations: [...state.locations, loc] })),
      updateLocation: (id, updatedLoc) => set((state) => ({
        locations: state.locations.map((l) => (l.id === id ? { ...l, ...updatedLoc } : l))
      })),

      beats: [],
      addBeat: (beat) => set((state) => ({ beats: [...state.beats, beat] })),
      updateBeat: (id, updatedBeat) => set((state) => ({
        beats: state.beats.map((b) => (b.id === id ? { ...b, ...updatedBeat } : b))
      })),
      reorderBeats: (startIndex, endIndex) => set((state) => {
        const newBeats = Array.from(state.beats);
        const [removed] = newBeats.splice(startIndex, 1);
        newBeats.splice(endIndex, 0, removed);
        return { beats: newBeats };
      }),

      leftSidebarOpen: true,
      rightSidebarOpen: true,
      activeLeftPanel: 'beatboard',
      activeRightPanel: 'brainstorming',
      distractionFree: false,
      activeView: 'planning',

      toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
      toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      setActiveLeftPanel: (panel) => set({ activeLeftPanel: panel, leftSidebarOpen: true }),
      setDistractionFree: (val) => set({ distractionFree: val, leftSidebarOpen: !val, rightSidebarOpen: !val }),
      setActiveView: (view) => set({ activeView: view }),
      removeCharacter: (id) => set((state) => ({ 
        characters: state.characters.filter(c => c.id !== id) 
      }))
    }),
    {
      name: 'screenwriter-storage',
    }
  )
);
