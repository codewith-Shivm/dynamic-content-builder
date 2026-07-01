# Dynamic Content Builder

A responsive drag-and-drop page builder built for Assignment 3 of the Frontend Developer Intern role. Users can compose a personal content page by adding, reordering, and customizing content blocks — with everything persisted automatically to localStorage.

**Live Demo:** [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)
**GitHub:** [github.com/codewith-Shivm/dynamic-content-builder](https://github.com/codewith-Shivm/dynamic-content-builder)

---

## About the Project

I wanted to build something that felt like a real content editor — not just a demo. The core challenge was making drag-and-drop feel smooth while keeping the state clean and predictable. I used `@dnd-kit` for drag-and-drop because it's more accessible and flexible than react-beautiful-dnd.

The state management uses `useReducer` with a history stack for undo/redo — no external library needed. Every change auto-saves to localStorage so the user never loses their work.

---

## Features

- 6 block types — Heading, Rich Text, Image, Markdown, Divider, Quote
- Drag to reorder blocks on the canvas
- Click any block to open its settings panel on the right
- Collapse/expand blocks to reduce visual clutter
- Duplicate blocks with one click
- Undo / Redo with full history (up to 50 states)
- Auto-save to localStorage on every change
- Export canvas as JSON or HTML file
- Import JSON to restore a saved layout
- Dark mode with theme persistence
- Search blocks in the sidebar palette
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+S (save)
- Auto-save indicator in toolbar
- Toast notifications for all actions
- Fully responsive layout

---

## Block Types

| Block | Configuration Options |
|---|---|
| **Heading** | Text, level (H1–H6), alignment |
| **Rich Text** | Content, bold, italic, underline |
| **Image** | URL, alt text, width %, border radius |
| **Markdown** | Editor with live preview |
| **Divider** | Thickness, color, margin |
| **Quote** | Quote text, author, alignment |

---

## Tech Stack

| Technology | Why I used it |
|---|---|
| React 18 + Vite | Fast build, modern React features |
| Tailwind CSS | Utility-first, dark mode support |
| @dnd-kit | Accessible and flexible drag-and-drop |
| Framer Motion | Smooth block entrance and layout animations |
| marked | Markdown parsing for live preview |
| react-hot-toast | Clean user feedback |

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar/         # Block palette with search
│   ├── Canvas/          # Drag-and-drop canvas
│   ├── Toolbar/         # Actions bar (undo, save, export, dark mode)
│   ├── Blocks/          # HeadingBlock, TextBlock, ImageBlock, etc.
│   └── SettingsPanel/   # Right panel for block configuration
│
├── context/
│   └── BuilderContext.jsx  # useReducer state + all actions
│
├── hooks/
│   └── useLocalStorage.js
│
├── utils/
│   ├── exportJson.js    # JSON + HTML export
│   └── importJson.js    # JSON import with validation
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Setup Instructions

```bash
git clone https://github.com/codewith-Shivm/dynamic-content-builder.git
cd dynamic-content-builder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Key Architectural Decisions

**Why useReducer instead of useState?**
The builder has many interdependent state updates — adding blocks, reordering, undo/redo history. useReducer keeps all of this in one predictable place with clear action types.

**Why @dnd-kit instead of react-beautiful-dnd?**
@dnd-kit is actively maintained, supports touch devices, and has better accessibility support. It also gives more control over the drag overlay and collision detection.

**Why localStorage instead of a backend?**
The assignment specifies localStorage persistence. The export/import JSON feature lets users back up and restore their work manually if needed.

**History management**
Every structural change (add, remove, reorder, clear) pushes to a history array. Text edits don't push to history to avoid flooding it. Max 50 history states to keep memory usage low.

---

## What I'd improve with more time

- Add more block types (video embed, code block, button)
- Multi-select blocks for bulk operations
- Templates to start from a pre-built layout
- Collaborative editing with Firebase Realtime Database
- Drag blocks from palette directly onto canvas (not just click-to-add)

---

## Deployment

```bash
npm i -g vercel
vercel --prod
```

No environment variables needed — fully client-side app.

---

*Built by Shivam — Frontend Developer Intern Assignment 3*
