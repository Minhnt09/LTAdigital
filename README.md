# LTA website

Angular 20 front-end for LTA Digital. The layout uses the colors of [ltadigital.com](https://ltadigital.com/): white and light gray content areas, charcoal text, a deep blue hero, and cyan calls to action.

## Information structure

- Home shows the five business areas immediately, then the company introduction, working approach, partner logos, and contact action.
- Services is organized into Digital & Telecom, Cloud & Platform, AI & Data, Enterprise IT, and Data Center & Telecom Infrastructure. The catalog links to 11 bilingual service detail routes.
- Why LTA, Partners, and Contact remain separate pages.

The 31 partner images supplied in `assets-src/partners/` were optimized individually into `public/partners/`. The originals and mapping are preserved in `assets-src/partners/manifest.json`. No logo was cut from a website screenshot. The photo assets in `public/img/` came from the DOCX; `assets-src/manifest.json` maps their originals.

## Run and verify locally

```bash
npm install
npm start
npm run build
npm run smoke
```

Open `http://localhost:4200/`. The smoke suite needs a running local server and Chrome at `/usr/bin/google-chrome`; use `LTA_BASE_URL` and `CHROME_PATH` to override them.

The contact form validates locally and does not send data. Before publication, LTA should confirm the partner list and permission to display each logo, provide the vector LTA logo and original high-resolution hero images where available, and connect the form to a delivery service.

White redesign: Raleway headings and Open Sans body match the original website. Desktop uses Lenis, cursor, magnetic buttons, subtle tilt and parallax; mobile keeps native scrolling and touch feedback. Fonts are self-hosted in public/fonts/lta.
