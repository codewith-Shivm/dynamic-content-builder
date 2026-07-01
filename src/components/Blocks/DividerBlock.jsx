// src/components/Blocks/DividerBlock.jsx
import { memo } from 'react';

const DividerBlock = memo(({ config }) => (
  <hr
    style={{
      borderTop: `${config.thickness || 1}px solid ${config.color || '#e2e8f0'}`,
      margin: `${config.margin || 16}px 0`,
    }}
  />
));

DividerBlock.displayName = 'DividerBlock';
export default DividerBlock;
