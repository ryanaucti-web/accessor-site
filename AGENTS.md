# limena marketing site

The public pre-login site for **limena**, positioned as **accessibility intelligence**. Astro,
static output, no UI framework. Replaces the previous Accessor site (retired; see git history).

The build spec and the original `.dc.html` design references live outside this repo, in
`Limena Marketing site.zip` (`site/SKILL.md`). The references were authored in a streaming
`<x-dc>` runtime that does not run here; they are references, not shippable pages.

## Non-negotiable rules

1. **Full-bleed bands, never floating rounded boxes.** A section carrying a background colour runs
   edge to edge: `<section class="band band--banded">` with an inner `max-width` wrapper. Wrapping
   a whole content section in a rounded card on the page background is the single biggest tell.
2. **Spacing rhythm.** Bands are `padding: 96px 32px` (the `.band` class). 48px clearance before a
   background change.
3. **Alternate band backgrounds.** paper → banded → dark → green (CTA). Never two identical
   backgrounds adjacent without a divider rule.
4. **Show the product.** Every use-case, role, and partner page leads with a real dashboard mock in
   the first viewport, then alternates copy/mock rows. Prose is a lede plus short blocks, never five
   paragraphs.
5. **Status is colour + word + icon.** Never colour alone.
6. **Contrast.** Muted text is `--muted` (#5F6862). Never #8A938A, #67706A, or #A6ADA6 — all fail AA
   on paper, and all three appear in the original references. Accent labels at 11–13px use
   `--green-hover` (#1E5E3D), never #3C9466 or #2C7A52.
7. **Copy.** Lowercase "limena". Plain, calm, confident, one idea per sentence. No em dashes, no
   emoji, no marketing clichés. Example URLs are `aucti.ca` / `itsryan.ca` / `example.com`.
8. **Positioning.** Never "scanner / overlay / compliance automation / website checker". Use:
   accessibility intelligence, operations, the operating loop, verification, regression detection,
   evidence, governance, maturity, AI-assisted (judgment stays human).

## Architecture

- `src/styles/tokens.css` — every colour, type, spacing, radius, and shadow value. Nothing
  hard-codes a hex outside this file except SVG path data that needs a literal.
- `src/styles/global.css` — reset, focus, the band system, type primitives, buttons, cards,
  `.row` alternating grid, status pills, and the responsive layer the references never had.
- `src/data/nav.ts` — the IA. Nav mega menus, hubs, and footer all read from it, so a slug changes
  in exactly one place.
- `src/layouts/Base.astro` — head, meta/OG, fonts, favicon, skip link, nav, footer. `SiteNav` is the
  **first child of the page wrapper**, never a sibling above it, or `position: sticky` dies past the
  first viewport.
- `src/components/product/` — the product-led page template kit (below).

## The product-led page template

Every use-case, role, and partner page composes these in order. Do not deviate.

1. `ProductHero` — dark hero, breadcrumb, H1, one lede, then a dashboard **lifting off the dark**
   (`border-radius: 16px 16px 0 0`, upward shadow, `translateY(1px)`) with a 4-up metric strip and a
   per-item table.
2. `FrictionBand` — `#EDEAE0`, H2 naming the specific structural problem, one lede, three icon cards.
3. Three `ProductRow`s, alternating via `flip`. Each takes a numbered mono eyebrow, a 32px H2, one or
   two short paragraphs, and a mock in the default slot.
4. `OutcomeBand` — dark, H2 plus a 2-column list of four outcomes.
5. `CtaBand` — green, then the canonical footer from `Base`.

Mocks available as slot content: `GroupedPanel` (many findings collapse to few fixes),
`FindingCard` (full finding with the dark business-impact strip), `EvidencePanel` (dark label/value
record). Pages may add one bespoke section when the argument needs it — see the "Doesn't Acrobat
already check this?" band on `/use-cases/accounting-firms`.

**Each page needs one argument no other page makes.** Accounting is "1 fix clears 214"; retail is
"a barrier is a lost order"; healthcare is "your users are having their worst week"; education is
"accountable for everything, in charge of nothing"; government is "there is no competitor to switch
to"; financial is "security controls create the barriers"; manufacturing is "employees, not just
customers".

## Known traps

- A `<button>` with `border: none` plus a conditional `border-bottom` leaves the UA 2px outset
  border on the bottom edge. Declare all four edges and swap `border-bottom-color`.
- Colours computed in script are invisible to a grep sweep. Audit computed styles, not source
  literals.

## Slug map (reference file → route)

| Reference | Route |
| --- | --- |
| `Home-v3` | `/` |
| `Product` | `/platform` |
| `Solutions` | `/use-cases` |
| `UseCase-Audit` | `/use-cases/preparing-for-an-audit` |
| `UseCase-Portfolio` | `/use-cases/many-products-one-standard` |
| `UseCase-ContinuousDelivery` | `/use-cases/continuous-delivery` |
| `UseCase-DistributedTeams` | `/use-cases/distributed-teams` |
| `UseCase-Accounting` | `/use-cases/accounting-firms` |
| `UseCase-Healthcare` | `/use-cases/healthcare` |
| `UseCase-Retail` | `/use-cases/retail` |
| `UseCase-Manufacturing` | `/use-cases/manufacturing` |
| `UseCase-Education` | `/use-cases/higher-education` |
| `UseCase-Government` | `/use-cases/government` |
| `UseCase-Financial` | `/use-cases/financial-services` |
| `Role-AccessibilityLead` | `/roles/accessibility-leads` |
| `Role-Engineering` | `/roles/engineering-leads` |
| `Role-Product` | `/roles/product-managers` |
| `Role-Design` | `/roles/design-leads` |
| `Role-Compliance` | `/roles/compliance-and-legal` |
| `Role-Content` | `/roles/content-teams` |
| `Partners` | `/partners` |
| `Partner-ServiceProviders` | `/partners/service-providers` |
| `Partner-Consultancies` | `/partners/consultancies` |
| `Partner-Incubators` | `/partners/incubators` |
| `Pricing-v4` | `/pricing` |
| `Scan` | `/scan` (footer only, not in nav) |
| `About` | `/about` |
| `Contact` | `/contact` |
| `Security` | `/security` |

## Development

```bash
npm run dev
```

`npm run build` outputs static files to `dist/`. `vercel.json` sets `cleanUrls`, security headers,
and serves `/install` as a shell script.

Full Astro documentation: https://docs.astro.build
