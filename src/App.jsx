import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Admin from '@/pages/Admin'
import Login from '@/pages/Login'
import TVMode from '@/pages/TVMode'
import CollaboratorProfile from '@/pages/CollaboratorProfile'
import UnitsComparison from '@/pages/UnitsComparison'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/tv" element={
            <ProtectedRoute>
              <TVMode />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/colaborador/:id" element={
            <ProtectedRoute>
              <CollaboratorProfile />
            </ProtectedRoute>
          } />
          <Route path="/unidades" element={
            <ProtectedRoute>
              <UnitsComparison />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
        }}
      />
    </AuthProvider>
  )
}
