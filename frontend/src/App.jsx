import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppRouter from './router/Router'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/chat/ChatWidget'
import GuestChatWidget from './components/chat/GuestChatWidget'

// Wrapper component to access auth context
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <>
      <ScrollToTop />
      <AppRouter />
      {/* Show appropriate chat widget based on auth state */}
      {user ? <ChatWidget /> : <GuestChatWidget />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
