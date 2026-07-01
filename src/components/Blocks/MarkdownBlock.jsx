// src/components/Blocks/MarkdownBlock.jsx
import { memo, useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

const MarkdownBlock = memo(({ config }) => {
  const html = useMemo(() => {
    try { return marked(config.content || ''); }
    catch { return '<p>Invalid markdown</p>'; }
  }, [config.content]);

  return (
    <div
      className="markdown-preview prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

MarkdownBlock.displayName = 'MarkdownBlock';
export default MarkdownBlock;
