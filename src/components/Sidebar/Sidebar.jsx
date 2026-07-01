// src/components/Sidebar/Sidebar.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilder } from '../../context/BuilderContext';

const BLOCK_TYPES = [
  { type: 'heading',  label: 'Heading',   desc: 'H1–H6 title',         color: 'from-violet-500 to-purple-600',  icon: 'H' },
  { type: 'text',     label: 'Rich Text',  desc: 'Bold, italic, underline', color: 'from-blue-500 to-cyan-600',    icon: 'T' },
  { type: 'image',    label: 'Image',      desc: 'Display an image',    color: 'from-green-500 to-emerald-600', icon: '🖼' },
  { type: 'markdown', label: 'Markdown',   desc: 'Live preview editor', color: 'from-amber-500 to-orange-600',  icon: 'M↓' },
  { type: 'divider',  label: 'Divider',    desc: 'Horizontal rule',     color: 'from-slate-500 to-slate-600',   icon: '—' },
  { type: 'quote',    label: 'Quote',      desc: 'Blockquote with author', color: 'from-pink-500 to-rose-600',  icon: '"' },
];

const BlockPill = ({ block, onAdd }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onAdd(block.type)}
    className="w-full flex items-center gap-3 p-3 rounded-xl
      bg-white dark:bg-slate-800
      border border-slate-100 dark:border-slate-700
      hover:border-primary-300 dark:hover:border-primary-700
      hover:shadow-card-hover transition-all duration-150 group text-left"
  >
    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm`}>
      {block.icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {block.label}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{block.desc}</p>
    </div>
    <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors ml-auto flex-shrink-0"
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  </motion.button>
);

const Sidebar = () => {
  const { addBlock, blocks } = useBuilder();
  const [search, setSearch] = useState('');

  const filtered = BLOCK_TYPES.filter(b =>
    b.label.toLowerCase().includes(search.toLowerCase()) ||
    b.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-64 flex-shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white">Block Palette</h2>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
      </div>

      {/* Block list */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 mb-1">
          Click to add
        </p>
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No blocks match "{search}"</p>
        ) : (
          filtered.map(b => <BlockPill key={b.type} block={b} onAdd={addBlock} />)
        )}
      </div>

      {/* Footer stat */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''} on canvas
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
