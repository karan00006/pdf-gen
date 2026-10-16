import './index.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (
  rootElement?.childNodes.length === 1
  && rootElement.firstChild?.nodeType === Node.COMMENT_NODE
  && rootElement.firstChild.textContent === 'app-html'
) {
  createRoot(rootElement).render(app)
} else if (rootElement) {
  hydrateRoot(rootElement, app)
}
