// src/components/Blocks/TextBlock.jsx
import { memo } from 'react';

const TextBlock = memo(({ config }) => (
  <p
    className="text-slate-700 dark:text-slate-300 leading-relaxed text-base"
    style={{
      fontWeight:     config.bold      ? 'bold'      : 'normal',
      fontStyle:      config.italic    ? 'italic'    : 'normal',
      textDecoration: config.underline ? 'underline' : 'none',
    }}
  >
    {config.content || 'Your text content here...'}
  </p>
));

TextBlock.displayName = 'TextBlock';
export default TextBlock;
