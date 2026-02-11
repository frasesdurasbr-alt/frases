import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResendSuccess(false)
    setLoading(true)
    const { isSupabaseConfigured } = await import('../lib/supabase')
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError('Supabase não configurado. Crie web/.env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY e reinicie o servidor (npm run dev).')
      return
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'Não foi possível conectar ao servidor. Verifique o arquivo web/.env e se o projeto Supabase está ativo. Reinicie o servidor após alterar o .env.'
        : err.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : err.message === 'Email not confirmed'
            ? ''
            : err.message
      setError(msg)
      if (err.message === 'Email not confirmed') {
        setError('E-mail ainda não confirmado. Abra o link que enviamos para o seu e-mail e depois tente entrar de novo. Se não recebeu, use o botão abaixo para reenviar.')
      }
      return
    }
    navigate('/')
  }

  async function handleResendConfirmation() {
    setError('')
    setResendSuccess(false)
    if (!email.trim()) {
      setError('Digite seu e-mail acima antes de reenviar.')
      return
    }
    const { error: err } = await supabase.auth.resend({ type: 'signup', email: email.trim() })
    if (err) {
      setError(err.message === 'Failed to fetch'
        ? 'Não foi possível conectar. Verifique sua internet e o .env.'
        : err.message)
      return
    }
    setResendSuccess(true)
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Entrar</h1>
        <p className="auth-subtitle">Acesse suas frases do dia.</p>
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
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {resendSuccess && <p className="auth-success">E-mail de confirmação reenviado. Verifique sua caixa de entrada (e o spam).</p>}
          {error && error.includes('não confirmado') && (
            <button type="button" className="btn btn-ghost btn-block auth-resend" onClick={handleResendConfirmation}>
              Reenviar e-mail de confirmação
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="auth-footer">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
