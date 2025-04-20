import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from './components/theme/theme-provider'
import { Toaster } from './components/ui/sonner'
import { router } from './router'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Temporizer" />
      <ThemeProvider
        storageKey="temporizer"
        defaultTheme="dark"
      >
        <RouterProvider router={router} />

        <Toaster richColors position="bottom-left" />
      </ThemeProvider>
    </HelmetProvider>
  )
}
