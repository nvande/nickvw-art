# Nick

A small site for graphite portraits.

```
drawings/
  01-study.jpg
  02-portrait.jpg

resemblance/
  jane/
    photo.jpg
    drawing.jpg
  study/
    drawing-only.jpg
```

`drawings/` is the main gallery. `resemblance/` is likeness pairs: one folder per example, with two images (shown side by side) or one.

Names are sorted alphabetically, so a number prefix sets the order. Edit pricing and contact copy at the top of `src/App.jsx`.

Use jpg, png, or webp. Phone photos as HEIC will not display — export to jpg first. A couple thousand pixels on the long edge is plenty.

## Local

```
npm install
npm run dev
```

Edit your name, the one-line description, or an optional email at the top of `src/App.jsx`.

## GitHub Pages

Live at https://nvande.github.io/nickvw-art/

To update the live site after adding drawings: `npm run build`, then replace the `gh-pages` branch with the new `dist/` folder.
