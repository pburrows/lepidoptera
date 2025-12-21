import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { attachConsole } from '@tauri-apps/plugin-log'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Initialize logging - attach console to Tauri log plugin
attachConsole().catch((err) => {
  console.error('Failed to attach console to Tauri log plugin:', err)
})

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}