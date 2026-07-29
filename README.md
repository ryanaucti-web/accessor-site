# limena marketing site

The public pre-login site for **limena**, positioned as accessibility intelligence. 29 pages plus
legal and a 404, built with Astro and no UI framework, output as static HTML.

See [AGENTS.md](AGENTS.md) for the design rules, the component architecture, and the slug map.

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the build locally |

## Deploying

Static output to `dist/`. `vercel.json` sets `cleanUrls`, security headers, and serves
`/install` as a shell script.
