import React from 'react'
import '../index.css'

export default function FraseCard({ frase }) {
  const texto = typeof frase === 'string' ? frase : frase?.texto || frase?.frase || ''
  const autor = frase?.autor || frase?.author || null

  return (
    <article className="frase-card">
      <div className="content">
        <h3 className="frase-text">{texto}</h3>
        {autor && <p className="frase-author">— {autor}</p>}
      </div>
    </article>
  )
}