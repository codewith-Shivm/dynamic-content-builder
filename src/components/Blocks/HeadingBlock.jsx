// src/components/Blocks/HeadingBlock.jsx
import { memo } from 'react';

const sizeMap = { h1:'text-4xl', h2:'text-3xl', h3:'text-2xl', h4:'text-xl', h5:'text-lg', h6:'text-base' };

const HeadingBlock = memo(({ config }) => {
  const Tag = config.level || 'h2';
  return (
    <Tag
      className={`font-display font-bold ${sizeMap[Tag]} text-slate-900 dark:text-white leading-tight`}
      style={{ textAlign: config.align || 'left' }}
    >
      {config.text || 'Your Heading'}
    </Tag>
  );
});

HeadingBlock.displayName = 'HeadingBlock';
export default HeadingBlock;
