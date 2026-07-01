// src/components/Blocks/BlockRenderer.jsx
import HeadingBlock  from './HeadingBlock';
import TextBlock     from './TextBlock';
import ImageBlock    from './ImageBlock';
import MarkdownBlock from './MarkdownBlock';
import DividerBlock  from './DividerBlock';
import QuoteBlock    from './QuoteBlock';

const map = {
  heading:  HeadingBlock,
  text:     TextBlock,
  image:    ImageBlock,
  markdown: MarkdownBlock,
  divider:  DividerBlock,
  quote:    QuoteBlock,
};

const BlockRenderer = ({ type, config }) => {
  const Component = map[type];
  if (!Component) return <p className="text-red-500 text-sm">Unknown block type: {type}</p>;
  return <Component config={config} />;
};

export default BlockRenderer;
