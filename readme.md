# Go Home Tanuki (You're Drunk)

Go Home Tanuki is a game where you fly a drunk tanuki home, made at Global
Game Jam 2016 on the theme "Ritual." This repo is the whole game, built with
Phaser CE and Vite. Play it at
[tanuki.joekarlsson.com](https://tanuki.joekarlsson.com/).

![Go Home Tanuki: a loading card listing Tanuki's daily ritual (work, drink, go home), the title screen of a sleepy tanuki slumped over a bar with a phone saying come home, then the tanuki flying through the night past clouds and sake bottles](.github/readme/2026-11-recording.gif)

## Artist statement

The theme for Global Game Jam 2016 was "Ritual," and we picked one a lot of
office workers know: work late, go drinking with your coworkers, get home
somehow, and do it again tomorrow. He never gets home. A run ends when he hits
a cloud or a rock, and the title screen puts him back at the bar, slumped over
while his phone rings to tell him to come home.

[Read the full statement](https://www.joekarlsson.com/work/go-home-tanuki/).

## Quick start

Node.js 22 or newer.

```bash
git clone https://github.com/JoeKarlsson/go-home-tanuki.git
cd go-home-tanuki
npm install
npm run dev        # http://localhost:3017, with hot reload
```

## Development

```bash
npx playwright install chromium firefox webkit   # once
npm test           # builds the site and plays it in Playwright, with axe
npm run lint
npm run build      # production build in dist/
npm run images     # redraw the icons and social card (build and run `npx vite preview --port 4173` first)
```

Sprites in `public/images` are lossless WebP, and the music and phone ring in
`public/audio` are loudness-normalized MP3s.

To embed the game, give the iframe `allow="fullscreen; autoplay"` and
`allowfullscreen`. Embedded, it starts muted and the speaker button turns sound
on.

Every push to `main` runs lint and the tests in GitHub Actions, then deploys
`dist/` to GitHub Pages.

## Credits

Made by [Joe Karlsson](https://www.joekarlsson.com/), Corina Jacobson,
[Sarah Kurisu](https://github.com/skurisu) and
[Kent Salcedo](https://github.com/kentsalcedo), with art by Bao Nguyen and
Gabe.

![The Go Home Tanuki team at Global Game Jam 2016](./assets/687474703a2f2f692e696d6775722e636f6d2f52756c6d7731722e6a7067.jpg)

## License

MIT. See [license.txt](license.txt).
