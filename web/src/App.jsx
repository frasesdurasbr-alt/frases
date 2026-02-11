import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Carregando…</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={user ? <Home /> : <Navigate to="/entrar" replace />} />
        <Route path="entrar" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="cadastro" element={user ? <Navigate to="/" replace /> : <Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
