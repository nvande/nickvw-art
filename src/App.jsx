import { useEffect, useState } from 'react'

const NAME = 'nick vw'
const LINE = 'portraits from live studio sessions'
const EMAIL = ''

const files = import.meta.glob('../drawings/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const drawings = Object.entries(files)
  .map(([path, src]) => ({
    src,
    path,
    title: titleFromPath(path),
  }))
  .sort((a, b) => a.path.localeCompare(b.path))

function titleFromPath(path) {
  const file = path.split('/').pop() ?? ''
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\d+\s+/, '')
    .trim()
}

export default function App() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (open === null) return

    function onKey(event) {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') {
        setOpen((i) => (i === null ? i : (i + 1) % drawings.length))
      }
      if (event.key === 'ArrowLeft') {
        setOpen((i) => (i === null ? i : (i - 1 + drawings.length) % drawings.length))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="page">
      <header>
        <h1>{NAME}</h1>
        <p>{LINE}</p>
      </header>

      {drawings.length === 0 ? (
        <p className="empty">Drop images into the drawings folder.</p>
      ) : (
        <main className="gallery">
          {drawings.map((drawing, i) => (
            <button
              key={drawing.path}
              type="button"
              className="piece"
              onClick={() => setOpen(i)}
            >
              <img src={drawing.src} alt={drawing.title} />
            </button>
          ))}
        </main>
      )}

      {EMAIL && (
        <footer>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </footer>
      )}

      {open !== null && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <img src={drawings[open].src} alt={drawings[open].title} />
        </div>
      )}
    </div>
  )
}
