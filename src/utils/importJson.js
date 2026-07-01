// src/utils/importJson.js
export const importJson = () =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return reject(new Error('No file selected'));
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          // Validate structure
          const blocks = parsed.blocks || parsed; // support both formats
          if (!Array.isArray(blocks)) throw new Error('Invalid format: expected blocks array');
          const validTypes = ['heading', 'text', 'image', 'markdown', 'divider', 'quote'];
          const valid = blocks.every(b => b.id && b.type && validTypes.includes(b.type) && b.config);
          if (!valid) throw new Error('Invalid block structure in JSON');
          resolve(blocks);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
