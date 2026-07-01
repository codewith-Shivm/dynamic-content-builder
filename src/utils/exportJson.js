// src/utils/exportJson.js
export const exportJson = (blocks) => {
  const data = JSON.stringify({ version: '1.0', blocks, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content-builder-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportHtml = (blocks) => {
  const blockHtml = blocks.map(b => {
    switch (b.type) {
      case 'heading': return `<${b.config.level} style="text-align:${b.config.align}">${b.config.text}</${b.config.level}>`;
      case 'text':    return `<p style="${b.config.bold?'font-weight:bold;':''}${b.config.italic?'font-style:italic;':''}${b.config.underline?'text-decoration:underline;':''}">${b.config.content}</p>`;
      case 'image':   return `<img src="${b.config.url}" alt="${b.config.alt}" style="border-radius:${b.config.borderRadius}px;width:${b.config.width}%" />`;
      case 'divider': return `<hr style="border-top:${b.config.thickness}px solid ${b.config.color};margin:${b.config.margin}px 0" />`;
      case 'quote':   return `<blockquote style="text-align:${b.config.align}"><p>${b.config.text}</p><cite>— ${b.config.author}</cite></blockquote>`;
      case 'markdown':return `<div class="markdown">${b.config.content}</div>`;
      default: return '';
    }
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Content Page</title>
  <style>
    body { font-family: Inter, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1e293b; }
    blockquote { border-left: 4px solid #6366f1; padding-left: 1rem; color: #64748b; font-style: italic; }
    img { max-width: 100%; }
  </style>
</head>
<body>${blockHtml}</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content-page-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
