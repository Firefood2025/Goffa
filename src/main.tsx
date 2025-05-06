
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a version timestamp to force refresh when app updates
// Using a simple timestamp format to avoid URI encoding issues
console.log("App version:", Date.now());

const root = document.getElementById("root");

// Clear any existing content before rendering
if (root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  
  createRoot(root).render(<App />);
}
