// src/context/BuilderContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// ─── Default block configs ────────────────────────────────────────────────────
const defaultConfig = {
  heading:  { text: 'Your Heading Here', level: 'h2', align: 'left' },
  text:     { content: 'Start writing your content here...', bold: false, italic: false, underline: false },
  image:    { url: '', alt: 'Image', borderRadius: 8, width: 100 },
  markdown: { content: '## Hello World\n\nWrite your **markdown** here.\n\n- Item 1\n- Item 2' },
  divider:  { thickness: 1, color: '#e2e8f0', margin: 16 },
  quote:    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', align: 'left' },
};

// ─── Unique ID generator ──────────────────────────────────────────────────────
const uid = () => `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── Create a new block ───────────────────────────────────────────────────────
export const createBlock = (type) => ({
  id: uid(),
  type,
  config: { ...defaultConfig[type] },
  collapsed: false,
});

// ─── Reducer ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dcb_blocks_v1';
const MAX_HISTORY = 50;

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlocks = [...state.blocks, action.block];
      return push(state, newBlocks);
    }
    case 'REMOVE_BLOCK': {
      const newBlocks = state.blocks.filter(b => b.id !== action.id);
      return push(state, newBlocks);
    }
    case 'DUPLICATE_BLOCK': {
      const idx = state.blocks.findIndex(b => b.id === action.id);
      if (idx === -1) return state;
      const copy = { ...state.blocks[idx], id: uid(), config: { ...state.blocks[idx].config } };
      const newBlocks = [...state.blocks.slice(0, idx + 1), copy, ...state.blocks.slice(idx + 1)];
      return push(state, newBlocks);
    }
    case 'UPDATE_BLOCK': {
      const newBlocks = state.blocks.map(b =>
        b.id === action.id ? { ...b, config: { ...b.config, ...action.config } } : b
      );
      return { ...state, blocks: newBlocks };
    }
    case 'REORDER_BLOCKS': {
      return push(state, action.blocks);
    }
    case 'TOGGLE_COLLAPSE': {
      const newBlocks = state.blocks.map(b =>
        b.id === action.id ? { ...b, collapsed: !b.collapsed } : b
      );
      return { ...state, blocks: newBlocks };
    }
    case 'SELECT_BLOCK':
      return { ...state, selectedId: action.id };
    case 'CLEAR_CANVAS':
      return push(state, []);
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return { ...state, blocks: state.history[newIndex], historyIndex: newIndex, selectedId: null };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return { ...state, blocks: state.history[newIndex], historyIndex: newIndex };
    }
    case 'LOAD_BLOCKS':
      return { ...state, blocks: action.blocks, history: [action.blocks], historyIndex: 0 };
    case 'SET_DARK':
      return { ...state, isDark: action.value };
    default:
      return state;
  }
}

// Push to history helper
function push(state, newBlocks) {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  const history = [...trimmed, newBlocks].slice(-MAX_HISTORY);
  return { ...state, blocks: newBlocks, history, historyIndex: history.length - 1 };
}

// ─── Initial state ────────────────────────────────────────────────────────────
const initialState = {
  blocks: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
  isDark: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────
const BuilderContext = createContext(null);

export const BuilderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const blocks = JSON.parse(saved);
        if (Array.isArray(blocks)) dispatch({ type: 'LOAD_BLOCKS', blocks });
      }
      const theme = localStorage.getItem('dcb_theme');
      if (theme === 'dark') {
        dispatch({ type: 'SET_DARK', value: true });
        document.documentElement.classList.add('dark');
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-save to localStorage whenever blocks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.blocks));
    } catch { /* ignore */ }
  }, [state.blocks]);

  // Dark mode effect
  useEffect(() => {
    if (state.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dcb_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dcb_theme', 'light');
    }
  }, [state.isDark]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); dispatch({ type: 'UNDO' }); }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); dispatch({ type: 'REDO' }); }
        if (e.key === 's') {
          e.preventDefault();
          toast.success('Saved!', { icon: '💾', id: 'save' });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addBlock    = useCallback((type) => dispatch({ type: 'ADD_BLOCK', block: createBlock(type) }), []);
  const removeBlock = useCallback((id) => dispatch({ type: 'REMOVE_BLOCK', id }), []);
  const duplicateBlock = useCallback((id) => dispatch({ type: 'DUPLICATE_BLOCK', id }), []);
  const updateBlock = useCallback((id, config) => dispatch({ type: 'UPDATE_BLOCK', id, config }), []);
  const reorderBlocks = useCallback((blocks) => dispatch({ type: 'REORDER_BLOCKS', blocks }), []);
  const selectBlock = useCallback((id) => dispatch({ type: 'SELECT_BLOCK', id }), []);
  const toggleCollapse = useCallback((id) => dispatch({ type: 'TOGGLE_COLLAPSE', id }), []);
  const clearCanvas = useCallback(() => { dispatch({ type: 'CLEAR_CANVAS' }); dispatch({ type: 'SELECT_BLOCK', id: null }); }, []);
  const undo        = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo        = useCallback(() => dispatch({ type: 'REDO' }), []);
  const toggleDark  = useCallback(() => dispatch({ type: 'SET_DARK', value: !state.isDark }), [state.isDark]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <BuilderContext.Provider value={{
      blocks: state.blocks,
      selectedId: state.selectedId,
      isDark: state.isDark,
      canUndo, canRedo,
      addBlock, removeBlock, duplicateBlock,
      updateBlock, reorderBlocks, selectBlock,
      toggleCollapse, clearCanvas, undo, redo, toggleDark,
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be inside BuilderProvider');
  return ctx;
};
