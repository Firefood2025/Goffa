
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set up global CSS variables for smooth animations and scrolling
document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
document.documentElement.style.setProperty('scroll-behavior', 'smooth');

// Handle viewport height for mobile browsers
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
});

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
