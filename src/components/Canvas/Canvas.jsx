// src/components/Canvas/Canvas.jsx
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilder } from '../../context/BuilderContext';
import BlockRenderer from '../Blocks/BlockRenderer';

// ─── Sortable block card ──────────────────────────────────────────────────────
const SortableBlock = ({ block, isSelected, onSelect, onRemove, onDuplicate, onToggleCollapse }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const typeLabels = { heading:'Heading', text:'Rich Text', image:'Image', markdown:'Markdown', divider:'Divider', quote:'Quote' };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
      className={`group relative rounded-2xl border-2 transition-all duration-150 cursor-pointer
        bg-white dark:bg-slate-800
        ${isSelected
          ? 'border-primary-500 shadow-lg shadow-primary-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm'
        }`}
    >
      {/* Top action bar — always visible when selected, hover otherwise */}
      <div className={`absolute -top-4 left-0 right-0 flex items-center justify-between px-3 transition-opacity duration-150 z-10
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

        {/* Left: type label + drag handle */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-2 py-0.5 shadow-sm">
          <button {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            title="Drag to reorder">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {typeLabels[block.type]}
          </span>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-1.5 py-0.5 shadow-sm">
          {/* Collapse */}
          <button onClick={e => { e.stopPropagation(); onToggleCollapse(block.id); }}
            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors rounded" title="Collapse">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={block.collapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
            </svg>
          </button>
          {/* Duplicate */}
          <button onClick={e => { e.stopPropagation(); onDuplicate(block.id); }}
            className="p-0.5 text-slate-400 hover:text-primary-500 transition-colors rounded" title="Duplicate">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {/* Delete */}
          <button onClick={e => { e.stopPropagation(); onRemove(block.id); }}
            className="p-0.5 text-slate-400 hover:text-red-500 transition-colors rounded" title="Delete">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected left border accent */}
      {isSelected && <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary-500" />}

      {/* Block content */}
      {!block.collapsed ? (
        <div className="p-5 pt-6">
          <BlockRenderer type={block.type} config={block.config} />
        </div>
      ) : (
        <div className="px-5 py-3 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{typeLabels[block.type]}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
            {block.config.text || block.config.content || block.config.url || '—'}
          </span>
          <span className="ml-auto text-[10px] text-slate-300 dark:text-slate-600">collapsed</span>
        </div>
      )}

      {/* Click hint when selected */}
      {isSelected && (
        <div className="absolute bottom-2 right-3 text-[10px] text-primary-400 dark:text-primary-500 font-medium">
          ✏️ Edit in Settings →
        </div>
      )}
    </motion.div>
  );
};

// ─── Empty canvas ─────────────────────────────────────────────────────────────
const EmptyCanvas = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center min-h-[500px] text-center p-10">
    <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center mb-6 shadow-sm">
      <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    </div>
    <h3 className="font-display font-bold text-xl text-slate-600 dark:text-slate-300 mb-2">Your canvas is empty</h3>
    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
      Click any block from the <strong>left sidebar</strong> to add it here. Then click it to edit in the <strong>Settings panel</strong> on the right.
    </p>
    <div className="mt-6 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
      <span className="flex items-center gap-1">👈 Add blocks</span>
      <span>·</span>
      <span className="flex items-center gap-1">✏️ Click to edit</span>
      <span>·</span>
      <span className="flex items-center gap-1">↕️ Drag to reorder</span>
    </div>
  </motion.div>
);

// ─── Canvas ───────────────────────────────────────────────────────────────────
const Canvas = () => {
  const { blocks, selectedId, selectBlock, removeBlock, duplicateBlock, reorderBlocks, toggleCollapse } = useBuilder();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex(b => b.id === active.id);
    const newIdx = blocks.findIndex(b => b.id === over.id);
    reorderBlocks(arrayMove(blocks, oldIdx, newIdx));
  }, [blocks, reorderBlocks]);

  return (
    <main
      className="flex-1 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900"
      onClick={() => selectBlock(null)}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header hint */}
        {blocks.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-6 font-medium">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''} · Click a block to edit · Drag to reorder
          </p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.length === 0 ? (
              <EmptyCanvas />
            ) : (
              <div className="flex flex-col gap-6">
                <AnimatePresence>
                  {blocks.map(block => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedId === block.id}
                      onSelect={selectBlock}
                      onRemove={removeBlock}
                      onDuplicate={duplicateBlock}
                      onToggleCollapse={toggleCollapse}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
};

export default Canvas;
