import './style.css'
import { createRoot } from 'react-dom/client'
import App from './App.js'

const root = createRoot(document.querySelector('#root'))

root.render(
    <App/>
)