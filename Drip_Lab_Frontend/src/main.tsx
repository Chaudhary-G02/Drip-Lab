import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // This loads your Tailwind styles

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
)