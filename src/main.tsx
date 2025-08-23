import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TriggerAuthContext } from '@trigger.dev/react-hooks'

const PUBLIC_ACCESS_TOKEN = (import.meta as any)?.env?.VITE_TRIGGER_PUBLIC_KEY || ''

createRoot(document.getElementById("root")!).render(
  <TriggerAuthContext.Provider value={{ accessToken: PUBLIC_ACCESS_TOKEN }}>
    <App />
  </TriggerAuthContext.Provider>
);
