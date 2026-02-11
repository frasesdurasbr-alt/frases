import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout({ user }) {
  const navigate = useNavigate()

  async function handleLogout() {
    const { supabase } = await import('../lib/supabase')
    await supabase.auth.signOut()
    navigate('/entrar')
  }

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">Frases do dia</Link>
        <nav className="nav">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/entrar" className="btn btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="btn btn-primary">Cadastrar</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Até 3 frases por dia, só para você.</p>
      </footer>
    </div>
  )
}
