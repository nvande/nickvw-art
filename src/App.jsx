import { useEffect, useState } from 'react'

const NAME = 'nick vw'
const LINE = 'portraits from live studio sessions'

const PRICING = [
  'Portraits take 1hr to complete, and are done on 11x14 inch paper in graphite.',
  'Cost is $100.',
  'I accept cash, Venmo, and PayPal.',
]

const CONTACT = [
  'Currently located in Boston, MA',
  'For sittings and commissions, get in touch at t2vanden@gmail.com',
]

const RESEMBLANCE = [
  'I don\'t take photos until after the drawing is complete. I prefer to work from life over simply reproducing what the camera sees.',
]

const SECTIONS = ['gallery', 'resemblance', 'pricing', 'contact']

const galleryFiles = import.meta.glob('../drawings/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const pairFiles = import.meta.glob('../resemblance/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const drawings = Object.entries(galleryFiles)
  .map(([path, src]) => ({ src, path, title: titleFromPath(path) }))
  .sort((a, b) => a.path.localeCompare(b.path))

const pairs = groupPairs(pairFiles)

function titleFromPath(path) {
  const file = path.split('/').pop() ?? ''
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\d+\s+/, '')
    .trim()
}

function groupPairs(files) {
  const groups = new Map()

  for (const [path, src] of Object.entries(files)) {
    const folder = path.split('/').at(-2)
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push({ src, path, title: titleFromPath(path) })
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([folder, images]) => ({
      folder,
      title: folder.replace(/[-_]+/g, ' ').replace(/^\d+\s+/, '').trim(),
      images: images.sort((a, b) => a.path.localeCompare(b.path)),
    }))
}

function sectionFromHash() {
  const hash = window.location.hash.replace('#', '')
  return SECTIONS.includes(hash) ? hash : 'gallery'
}

export default function App() {
  const [section, setSection] = useState(sectionFromHash)
  const [viewer, setViewer] = useState(null)

  useEffect(() => {
    function onHash() {
      setSection(sectionFromHash())
      setViewer(null)
    }

    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!viewer) return

    function onKey(event) {
      if (event.key === 'Escape') setViewer(null)
      if (event.key === 'ArrowRight') {
        setViewer((v) => v && { ...v, index: (v.index + 1) % v.list.length })
      }
      if (event.key === 'ArrowLeft') {
        setViewer((v) => v && { ...v, index: (v.index - 1 + v.list.length) % v.list.length })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewer])

  return (
    <div className="page">
      <header>
        <h1>{NAME}</h1>
        <p>{LINE}</p>
        <nav>
          {SECTIONS.map((id, i) => (
            <span key={id}>
              {i > 0 && <span className="sep">|</span>}
              <a href={`#${id}`} className={section === id ? 'on' : ''}>
                {id}
              </a>
            </span>
          ))}
        </nav>
      </header>

      {section === 'gallery' && (
        drawings.length === 0 ? (
          <p className="empty">Drop images into the drawings folder.</p>
        ) : (
          <main className="gallery">
            {drawings.map((drawing, i) => (
              <button
                key={drawing.path}
                type="button"
                className="piece"
                onClick={() => setViewer({ list: drawings, index: i })}
              >
                <img src={drawing.src} alt={drawing.title} />
              </button>
            ))}
          </main>
        )
      )}

      {section === 'resemblance' && (
        <>
          <section className="prose resemblance-intro">
            {RESEMBLANCE.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
          {pairs.length === 0 ? (
            <p className="empty">Drop a photo and a drawing into a folder inside resemblance.</p>
          ) : (
            <main className="pairs">
              {pairs.map((pair) => (
                <div
                  key={pair.folder}
                  className={pair.images.length === 1 ? 'pair single' : 'pair'}
                >
                  {pair.images.map((image, i) => (
                    <button
                      key={image.path}
                      type="button"
                      onClick={() => setViewer({ list: pair.images, index: i })}
                    >
                      <img src={image.src} alt={`${pair.title} ${image.title}`} />
                    </button>
                  ))}
                </div>
              ))}
            </main>
          )}
        </>
      )}

      {section === 'pricing' && (
        <section className="prose">
          {PRICING.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>
      )}

      {section === 'contact' && (
        <section className="prose">
          {CONTACT.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>
      )}

      {viewer && (
        <div className="lightbox" onClick={() => setViewer(null)}>
          <img src={viewer.list[viewer.index].src} alt={viewer.list[viewer.index].title} />
        </div>
      )}
    </div>
  )
}
