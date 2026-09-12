# Linux, at a glance.

A static, continuous document containing 262 distinct command examples from the supplied 62-page Linux Handbook. Built with HTML, compiled Tailwind CSS, and vanilla JavaScript. Fonts are self-hosted IBM Plex; their OFL licenses are in `fonts/`.

**Live site:** https://arpandrv.github.io/linux-cheatsheet/

Open `index.html` directly, or serve this directory with any static web server. All command content is in the HTML, so it remains readable with JavaScript disabled. Search, copying, reading size, topic navigation, and printing progressively enhance the document. Clipboard access depends on browser permissions; when unavailable, the command is selected for manual copying.

To rebuild the CSS:

```sh
npm install
npm run build
```

Edit command content directly in `index.html`. The original PDF is not bundled. Repeated commands are consolidated; command spacing is corrected from PDF extraction. Cautions preserve important context, including destructive commands and the Arch `pacman -Sy` example. Read-only and modifying examples are documentation only: the site never executes commands.

GitHub Pages serves the root of the `main` branch. Commit `style.css` after rebuilding; the deployed page does not need Node.js or a CDN.
