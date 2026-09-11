# Nick

A small site for graphite portraits. Drop image files into `drawings/` and they show up.

```
drawings/
  01-study.jpg
  02-portrait.jpg
```

Names are sorted alphabetically, so a number prefix sets the order. The filename (minus the number) is used as the image’s alt text.

Use jpg, png, or webp. Phone photos as HEIC will not display — export to jpg first. A couple thousand pixels on the long edge is plenty.

## Local

```
npm install
npm run dev
```

Edit your name, the one-line description, or an optional email at the top of `src/App.jsx`.

## GitHub Pages

Live at GitHub Pages from the `nickvw-art` repo. New drawings go live the same way: drop them in `drawings/`, commit, push.
