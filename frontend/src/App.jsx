import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/Router'
import ScrollToTop from './components/ScrollToTop' // <-- make sure this path is correct

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* <-- scrolls to top on every route change */}
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
