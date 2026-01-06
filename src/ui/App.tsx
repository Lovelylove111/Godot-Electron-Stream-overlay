import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [components, setComponents] = useState<React.FC[]>([]);

  useEffect(() => {
    const modules = import.meta.glob('./godot-components-ui/*.tsx', { eager: true });

    const loadedComponents: React.FC[] = [];

    for (const path in modules) {
      const mod = modules[path] as { default: React.FC };
      if (mod?.default) {
        loadedComponents.push(mod.default);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setComponents(loadedComponents);
  }, []);

  return (
    <>
    <div>
      Sumoga
    </div>
    <div>
      {components.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
    </>
  );
}

export default App
