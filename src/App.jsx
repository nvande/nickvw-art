import { useEffect, useState } from 'react'

const NAME = 'nick vw'
const LINE = 'portraits from live studio sessions'

const PRICING = [
  'Portraits take 1.5hrs to complete, and are done on 11x14 inch paper in graphite.',
  'Cost is $100.',
  'I accept cash, Venmo, and PayPal.',
]

const CONTACT = [
  'Currently located in Boston, MA',
  'For sittings and commissions, get in touch at t2vanden@gmail.com',
]

const RESEMBLANCE = [
  'I do not work from photos, I prefer to work from life over simply reproducing what the camera sees.',
  'These photos were taken to help you see the likeness to the subject.',
]

const SECTIONS = ['gallery', 'resemblance', 'pricing', 'contact']

const galleryFiles = import.meta.glob('../drawings/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const galleryThumbs = import.meta.glob('../drawings/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?thumb',
  import: 'default',
})

const pairFiles = import.meta.glob('../resemblance/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const pairThumbs = import.meta.glob('../resemblance/*/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?thumb',
  import: 'default',
})

const drawings = withThumbs(galleryFiles, galleryThumbs).sort((a, b) => a.path.localeCompare(b.path))
const pairs = groupPairs(withThumbs(pairFiles, pairThumbs))

function cleanPath(path) {
  return path.split('?')[0]
}

function titleFromPath(path) {
  const file = cleanPath(path).split('/').pop() ?? ''
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\d+\s+/, '')
    .trim()
}

function withThumbs(full, thumbs) {
  const thumbByPath = Object.fromEntries(
    Object.entries(thumbs).map(([path, src]) => [cleanPath(path), src]),
  )

  return Object.entries(full).map(([path, src]) => ({
    src,
    thumb: thumbByPath[cleanPath(path)],
    path: cleanPath(path),
    title: titleFromPath(path),
  }))
}

function Photo({ src, thumb, alt }) {
  const [ready, setReady] = useState(false)

  return (
    <span className="photo">
      {thumb && <img className="photo-low" src={thumb} alt="" />}
      <img
        className={ready ? 'photo-high ready' : 'photo-high'}
        src={src}
        alt={alt}
        onLoad={() => setReady(true)}
      />
    </span>
  )
}

function groupPairs(images) {
  const groups = new Map()

  for (const image of images) {
    const folder = image.path.split('/').at(-2)
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push(image)
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
                <Photo src={drawing.src} thumb={drawing.thumb} alt={drawing.title} />
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
                      <Photo src={image.src} thumb={image.thumb} alt={`${pair.title} ${image.title}`} />
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
