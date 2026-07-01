// src/components/Blocks/ImageBlock.jsx
import { memo, useState } from 'react';

const ImageBlock = memo(({ config }) => {
  const [error, setError] = useState(false);

  if (!config.url || error) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
        style={{ minHeight: 160, borderRadius: config.borderRadius || 8, width: `${config.width || 100}%` }}
      >
        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">{error ? 'Invalid image URL' : 'Add an image URL in settings'}</p>
      </div>
    );
  }

  return (
    <img
      src={config.url}
      alt={config.alt || 'Image'}
      onError={() => setError(true)}
      className="object-cover"
      style={{
        borderRadius: `${config.borderRadius || 8}px`,
        width: `${config.width || 100}%`,
        maxWidth: '100%',
      }}
    />
  );
});

ImageBlock.displayName = 'ImageBlock';
export default ImageBlock;
