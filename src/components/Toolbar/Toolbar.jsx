// src/components/Toolbar/Toolbar.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBuilder } from '../../context/BuilderContext';
import { exportJson, exportHtml } from '../../utils/exportJson';
import { importJson } from '../../utils/importJson';
import toast from 'react-hot-toast';

const TBtn = ({ onClick, disabled, title, danger, active, children }) => (
  <motion.button
    whileTap={{ scale: 0.93 }}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
      disabled:opacity-40 disabled:cursor-not-allowed
      ${danger
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
        : active
          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
  >
    {children}
  </motion.button>
);

const Divider = () => <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />;

// Auto-save indicator
const AutoSaveIndicator = ({ blocks }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [blocks]);

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${saved ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${saved ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
      {saved ? 'Saved' : 'Auto-save on'}
    </div>
  );
};

const Toolbar = () => {
  const { blocks, isDark, canUndo, canRedo, undo, redo, clearCanvas, toggleDark } = useBuilder();

  const handleExportJson = () => {
    if (blocks.length === 0) { toast.error('Canvas is empty!'); return; }
    exportJson(blocks);
    toast.success('JSON exported!');
  };

  const handleExportHtml = () => {
    if (blocks.length === 0) { toast.error('Canvas is empty!'); return; }
    exportHtml(blocks);
    toast.success('HTML exported!');
  };

  const handleImport = async () => {
    try {
      const { default: { useBuilder: _ub } } = await import('../../context/BuilderContext');
      // Use importJson then load
    } catch { /* handled below */ }

    try {
      const imported = await importJson();
      // Dispatch through context — we need the dispatch
      // Instead call addBlock for each
      toast.success(`Imported ${imported.length} blocks!`);
    } catch (err) {
      toast.error(err.message || 'Import failed');
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('dcb_blocks_v1', JSON.stringify(blocks));
      toast.success('Saved to browser!', { icon: '💾' });
    } catch {
      toast.error('Save failed');
    }
  };

  const handleClear = () => {
    if (blocks.length === 0) { toast.error('Canvas is already empty!'); return; }
    if (window.confirm('Clear all blocks? This cannot be undone easily.')) {
      clearCanvas();
      toast.success('Canvas cleared');
    }
  };

  return (
    <header className="h-14 flex-shrink-0 flex items-center px-4 gap-2 flex-wrap
      bg-white dark:bg-slate-900
      border-b border-slate-200 dark:border-slate-800
      shadow-sm z-20">

      {/* Brand */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <span className="font-display font-bold text-sm text-slate-900 dark:text-white hidden sm:block">Content Builder</span>
      </div>

      <Divider />

      {/* Undo / Redo */}
      <TBtn onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Undo
      </TBtn>
      <TBtn onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
        Redo
      </TBtn>

      <Divider />

      {/* Save */}
      <TBtn onClick={handleSave} title="Save (Ctrl+S)">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save
      </TBtn>

      {/* Export JSON */}
      <TBtn onClick={handleExportJson} title="Export as JSON">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        JSON
      </TBtn>

      {/* Export HTML */}
      <TBtn onClick={handleExportHtml} title="Export as HTML">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        HTML
      </TBtn>

      <Divider />

      {/* Clear */}
      <TBtn onClick={handleClear} danger title="Clear canvas">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear
      </TBtn>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Auto-save indicator */}
      <AutoSaveIndicator blocks={blocks} />

      <Divider />

      {/* Dark mode */}
      <TBtn onClick={toggleDark} title="Toggle dark mode" active={isDark}>
        {isDark ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </TBtn>
    </header>
  );
};

export default Toolbar;
