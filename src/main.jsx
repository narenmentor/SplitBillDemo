// StrictMode helps catch common mistakes while developing
import { StrictMode } from 'react'
// createRoot lets React take control of an HTML element
import { createRoot } from 'react-dom/client'
// Import our main App component
import App from './App.jsx'

// Find the <div id="root"> in index.html and render our app inside it
createRoot(document.getElementById('root')).render(
  // Wrap the app in StrictMode for extra development checks
  <StrictMode>
    {/* Show the App component */}
    <App />
  </StrictMode>, // End of StrictMode wrapper
) // End of the render call
