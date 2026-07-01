// src/App.jsx
import { Toaster } from 'react-hot-toast';
import { BuilderProvider } from './context/BuilderContext';
import Toolbar from './components/Toolbar/Toolbar';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';

const App = () => (
  <BuilderProvider>
    <div className="h-screen flex flex-col overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500 },
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
        }}
      />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <SettingsPanel />
      </div>
    </div>
  </BuilderProvider>
);

export default App;
