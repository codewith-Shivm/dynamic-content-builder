// src/components/SettingsPanel/SettingsPanel.jsx
import { useBuilder } from '../../context/BuilderContext';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Reusable input components ────────────────────────────────────────────────
const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
    {children}
  </label>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    onClick={e => e.stopPropagation()}
    className="w-full px-3 py-2 rounded-lg text-sm
      bg-white dark:bg-slate-800
      border border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-all"
  />
);

const TextArea = ({ value, onChange, placeholder, rows = 5 }) => (
  <textarea
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    onClick={e => e.stopPropagation()}
    className="w-full px-3 py-2 rounded-lg text-sm
      bg-white dark:bg-slate-800
      border border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-all resize-y"
  />
);

const SelectInput = ({ value, onChange, options }) => (
  <select
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    onClick={e => e.stopPropagation()}
    className="w-full px-3 py-2 rounded-lg text-sm
      bg-white dark:bg-slate-800
      border border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      focus:outline-none focus:ring-2 focus:ring-primary-500
      transition-all cursor-pointer"
  >
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const RangeInput = ({ value, onChange, min, max, label }) => (
  <div>
    <Label>{label}: {value}</Label>
    <input
      type="range"
      value={value || min}
      onChange={e => onChange(Number(e.target.value))}
      min={min} max={max}
      onClick={e => e.stopPropagation()}
      className="w-full accent-primary-500 cursor-pointer"
    />
  </div>
);

const ToggleInput = ({ checked, onChange, label }) => (
  <div
    className="flex items-center justify-between py-1 cursor-pointer"
    onClick={e => { e.stopPropagation(); onChange(!checked); }}
  >
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    <div className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="mb-4">
    <Label>{label}</Label>
    {children}
  </div>
);

// ─── Block-specific settings ──────────────────────────────────────────────────

const HeadingSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <Field label="Heading Text">
      <TextInput
        value={config.text}
        onChange={v => update({ text: v })}
        placeholder="Enter your heading..."
      />
    </Field>
    <Field label="Heading Level">
      <SelectInput
        value={config.level}
        onChange={v => update({ level: v })}
        options={['h1','h2','h3','h4','h5','h6'].map(v => ({ value: v, label: v.toUpperCase() }))}
      />
    </Field>
    <Field label="Text Alignment">
      <SelectInput
        value={config.align}
        onChange={v => update({ align: v })}
        options={[
          { value: 'left', label: '← Left' },
          { value: 'center', label: '↔ Center' },
          { value: 'right', label: '→ Right' },
        ]}
      />
    </Field>
  </div>
);

const TextSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <Field label="Text Content">
      <TextArea
        value={config.content}
        onChange={v => update({ content: v })}
        placeholder="Write your text here..."
        rows={6}
      />
    </Field>
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Formatting</p>
      <ToggleInput checked={!!config.bold}      onChange={v => update({ bold: v })}      label="Bold" />
      <ToggleInput checked={!!config.italic}    onChange={v => update({ italic: v })}    label="Italic" />
      <ToggleInput checked={!!config.underline} onChange={v => update({ underline: v })} label="Underline" />
    </div>
  </div>
);

const ImageSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <Field label="Image URL">
      <TextInput
        value={config.url}
        onChange={v => update({ url: v })}
        placeholder="https://example.com/image.jpg"
      />
    </Field>
    <Field label="Alt Text">
      <TextInput
        value={config.alt}
        onChange={v => update({ alt: v })}
        placeholder="Describe the image..."
      />
    </Field>
    <RangeInput
      label="Width %"
      value={config.width || 100}
      onChange={v => update({ width: v })}
      min={10} max={100}
    />
    <div className="mb-4 mt-4">
      <RangeInput
        label="Border Radius px"
        value={config.borderRadius || 0}
        onChange={v => update({ borderRadius: v })}
        min={0} max={48}
      />
    </div>
  </div>
);

const MarkdownSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <Field label="Markdown Content">
      <TextArea
        value={config.content}
        onChange={v => update({ content: v })}
        placeholder="## Your Heading&#10;&#10;Write **markdown** here..."
        rows={12}
      />
    </Field>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
      Preview updates live on the canvas
    </p>
  </div>
);

const DividerSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <div className="mb-4">
      <RangeInput
        label="Thickness px"
        value={config.thickness || 1}
        onChange={v => update({ thickness: v })}
        min={1} max={12}
      />
    </div>
    <Field label="Color">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={config.color || '#e2e8f0'}
          onChange={e => update({ color: e.target.value })}
          onClick={e => e.stopPropagation()}
          className="w-12 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer p-0.5"
        />
        <TextInput
          value={config.color || '#e2e8f0'}
          onChange={v => update({ color: v })}
          placeholder="#e2e8f0"
        />
      </div>
    </Field>
    <div className="mt-4">
      <RangeInput
        label="Margin px"
        value={config.margin || 16}
        onChange={v => update({ margin: v })}
        min={0} max={80}
      />
    </div>
  </div>
);

const QuoteSettings = ({ config, update }) => (
  <div onClick={e => e.stopPropagation()}>
    <Field label="Quote Text">
      <TextArea
        value={config.text}
        onChange={v => update({ text: v })}
        placeholder="Enter your quote here..."
        rows={4}
      />
    </Field>
    <Field label="Author Name">
      <TextInput
        value={config.author}
        onChange={v => update({ author: v })}
        placeholder="Author name..."
      />
    </Field>
    <Field label="Text Alignment">
      <SelectInput
        value={config.align}
        onChange={v => update({ align: v })}
        options={[
          { value: 'left', label: '← Left' },
          { value: 'center', label: '↔ Center' },
          { value: 'right', label: '→ Right' },
        ]}
      />
    </Field>
  </div>
);

// Map block types to their settings component
const settingsMap = {
  heading:  HeadingSettings,
  text:     TextSettings,
  image:    ImageSettings,
  markdown: MarkdownSettings,
  divider:  DividerSettings,
  quote:    QuoteSettings,
};

const typeLabels = {
  heading: '📝 Heading Block',
  text:    '✏️ Rich Text Block',
  image:   '🖼️ Image Block',
  markdown:'📄 Markdown Block',
  divider: '➖ Divider Block',
  quote:   '💬 Quote Block',
};

// ─── Main Settings Panel ──────────────────────────────────────────────────────
const SettingsPanel = () => {
  const { blocks, selectedId, updateBlock, selectBlock } = useBuilder();
  const block = blocks.find(b => b.id === selectedId);

  return (
    <aside
      className="w-72 flex-shrink-0 h-full flex flex-col
        bg-slate-50 dark:bg-slate-900
        border-l border-slate-200 dark:border-slate-800"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </h2>
        {block && (
          <button
            onClick={e => { e.stopPropagation(); selectBlock(null); }}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!block ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">No block selected</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                Click any block on the canvas to edit its content and settings here
              </p>
            </motion.div>
          ) : (
            /* Block settings */
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="p-4"
            >
              {/* Block type badge */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {typeLabels[block.type]}
                </span>
              </div>

              {/* Render the correct settings form */}
              {(() => {
                const SettingsComponent = settingsMap[block.type];
                return SettingsComponent ? (
                  <SettingsComponent
                    config={block.config}
                    update={(cfg) => updateBlock(block.id, cfg)}
                  />
                ) : (
                  <p className="text-sm text-red-500">Unknown block type</p>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default SettingsPanel;
