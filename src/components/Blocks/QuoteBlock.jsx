// src/components/Blocks/QuoteBlock.jsx
import { memo } from 'react';

const QuoteBlock = memo(({ config }) => (
  <blockquote
    className="border-l-4 border-primary-500 pl-5 py-2"
    style={{ textAlign: config.align || 'left' }}
  >
    <p className="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
      "{config.text || 'Your quote here'}"
    </p>
    {config.author && (
      <cite className="text-sm font-semibold text-primary-600 dark:text-primary-400 not-italic">
        — {config.author}
      </cite>
    )}
  </blockquote>
));

QuoteBlock.displayName = 'QuoteBlock';
export default QuoteBlock;
