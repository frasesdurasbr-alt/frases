import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import FraseCard from './FraseCard'

const MAX_FRASES_POR_DIA = 3

function getTodayStartEnd() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export default function Home() {
  const [frases, setFrases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [jaViuHoje, setJaViuHoje] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { start: todayStart, end: todayEnd } = getTodayStartEnd()

      try {
        const { data: vistasHojeList } = await supabase
          .from('frases_vistas')
          .select('frase_id')
          .eq('user_id', user.id)
          .gte('visto_em', todayStart)
          .lt('visto_em', todayEnd)
          .order('visto_em', { ascending: true })

        const vistasHoje = vistasHojeList?.length ?? 0
        setJaViuHoje(vistasHoje)

        if (vistasHoje >= MAX_FRASES_POR_DIA) {
          const idsHoje = (vistasHojeList || []).map((v) => v.frase_id)
          if (idsHoje.length > 0) {
            const { data: frasesHoje, error: errFrases } = await supabase
              .from('frases')
              .select('id, frase')
              .in('id', idsHoje)
            if (!errFrases && frasesHoje?.length) {
              const ordem = new Map(idsHoje.map((id, i) => [id, i]))
              const ordenadas = [...frasesHoje].sort((a, b) => (ordem.get(a.id) ?? 0) - (ordem.get(b.id) ?? 0))
              if (!cancelled) setFrases(ordenadas)
            }
          }
          setLoading(false)
          return
        }

        const { data: vistas } = await supabase
          .from('frases_vistas')
          .select('frase_id')
          .eq('user_id', user.id)

        const idsVistos = new Set((vistas || []).map((v) => v.frase_id))

        const { data: todasFrases, error: errList } = await supabase
          .from('frases')
          .select('id, frase')

        if (errList || !todasFrases?.length) {
          setError(errList?.message || 'Nenhuma frase disponível.')
          setLoading(false)
          return
        }

        const disponiveis = todasFrases.filter((f) => !idsVistos.has(f.id))
        const shuffled = [...disponiveis].sort(() => Math.random() - 0.5)
        const escolhidas = shuffled.slice(0, Math.min(MAX_FRASES_POR_DIA - vistasHoje, 3))

        if (escolhidas.length === 0) {
          setLoading(false)
          return
        }

        for (const f of escolhidas) {
          await supabase.from('frases_vistas').insert({
            user_id: user.id,
            frase_id: f.id,
          })
        }

        if (!cancelled) setFrases(escolhidas)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Erro ao carregar frases.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="home home-loading">
        <div className="loading-spinner" />
        <p>Buscando suas frases…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home home-error">
        <p className="error-msg">{error}</p>
      </div>
    )
  }

  if (jaViuHoje >= MAX_FRASES_POR_DIA && frases.length === 0) {
    return (
      <div className="home home-limit">
        <h2>Por hoje é isso.</h2>
        <p>Você já viu suas 3 frases do dia. Volte amanhã para novas mensagens.</p>
      </div>
    )
  }

  if (frases.length === 0) {
    return (
      <div className="home home-empty">
        <h2>Você já viu todas as frases.</h2>
        <p>Parabéns! Não há mais frases novas no momento. Volte outro dia.</p>
      </div>
    )
  }

  return (
    <div className="home">
      <h1 className="home-title">Suas frases de hoje</h1>
      <div className="frases-grid">
        {frases.map((f) => (
          <FraseCard key={f.id} frase={f.frase} fraseId={f.id} />
        ))}
      </div>
      {jaViuHoje + frases.length >= MAX_FRASES_POR_DIA && (
        <p className="home-footer">Você já viu suas 3 frases de hoje. Até amanhã!</p>
      )}
    </div>
  )
}
