/**
 * Imagem de fundo: usa imagem_url do banco se existir;
 * caso contrário, usa picsum.photos (fotos gratuitas) com seed pelo id para consistência.
 * Fundo desfocado para boa leitura.
 */
function getBackgroundImage(imagemUrl, fraseId) {
  if (imagemUrl) return imagemUrl
  const seed = fraseId || Math.floor(Math.random() * 10000)
  return `https://picsum.photos/seed/${seed}/1200/800`
}

export default function FraseCard({ frase, imagemUrl = null, fraseId }) {
  const bg = getBackgroundImage(imagemUrl, fraseId)

  return (
    <article className="frase-card">
      <div
        className="frase-card-bg"
        style={{ '--bg-image': `url(${bg})` }}
        aria-hidden="true"
      />
      <div className="frase-card-overlay" />
      <blockquote className="frase-card-text">
        {frase}
      </blockquote>
    </article>
  )
}
