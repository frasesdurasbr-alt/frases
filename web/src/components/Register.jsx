import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { isSupabaseConfigured } = await import('../lib/supabase')
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError('Supabase não configurado. Crie web/.env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY e reinicie o servidor (npm run dev).')
      return
    }
    const { error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'Não foi possível conectar ao servidor. Verifique o arquivo web/.env (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) e se o projeto Supabase está ativo. Reinicie o servidor após alterar o .env.'
        : err.message
      setError(msg)
      return
    }
    setSuccess(true)
    navigate('/')
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Quase lá</h1>
          <p className="auth-subtitle">Confirme seu e-mail no link que enviamos e depois faça login.</p>
          <Link to="/entrar" className="btn btn-primary btn-block">Ir para login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Cadastro</h1>
        <p className="auth-subtitle">Crie sua conta para receber frases personalizadas.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </label>
          <label>
            Senha (mín. 6 caracteres)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-footer">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
