# Vitalik-Inspired World Computer

Website for **$VITALIKWC**, an Ethereum community memecoin. The page is a small retro desktop: a meme maker, tokenomics, and how to buy.

Public site: https://jackmiller825.github.io/VITALIKWC/

The GitHub Pages build uses a project subpath:

```bash
PAGES_BASE=/VITALIKWC/ npm run build
```

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port **4317**.

```bash
npm run check
npm run lint
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. Host that folder on any static host. No server, database, or wallet connection is required.

## What is already true

- The contract address is **Coming Soon**. Copy on the page copies that line until a confirmed address is set.
- The meme maker runs in the browser, from `meme.exe` on the desktop. Captions are not uploaded.
- Tokenomics states that LP tokens are burnt and contract ownership is renounced. Supply is not announced.
- How to buy walks through MetaMask, ETH, and Uniswap, and states that taxes are zero.
- Telegram is https://t.me/vitalikwc. X is https://x.com/.
- Analytics are off.

## Launch facts still required

Edit `src/config/site.ts` only when a value is real. Leave unknowns as `null`.

| Field | Needed for |
| --- | --- |
| `siteUrl` | Canonical URL, absolute social image, sitemap. Currently `https://jackmiller825.github.io/VITALIKWC`. |
| `launchStatus: 'live'` | Public trading state. |
| `contractAddress` | The token address. |
| `contractConfirmed: true` | Owner confirmation. A valid-looking address is not enough. |
| `swapUrl` | Official https swap destination. The buy button stays hidden until status, confirmation, address, and this URL are all set. |
| `explorerUrl` | https page for the token. It is not guessed from the address. |
| `telegramUrl`, `xUrl` | Community links. Set to https://t.me/vitalikwc and https://x.com/. |
| `supply`, `buyTax`, `sellTax`, `vesting` | Token spec rows, each with evidence URL, label, and checked date. |
| `allocations` | Only if every slice is real and the percentages total 100. Otherwise the page keeps the “published before launch” line. |
| `liquidity` | Separate from ownership. A lock needs pool, locker, share covered, and unlock date. A burn needs scope and evidence. |
| `adminPermissions` | Ownership, upgradeability, and privileged roles, each on its own. |
| `marketData` | Leave `enabled: false` until `pairAddress` and `sourceUrl` are real. The source must return JSON: `{"priceUsd":"0.01","updatedAt":"2026-10-04T00:00:00Z","pairLabel":"VITALIKWC / WETH"}`. Failed quotes show an unavailable state. There is no sample price. |
| `analyticsEnabled` | Optional. When true, the page emits `vwc-analytics` events for community clicks, successful contract copies, buy-link clicks, meme exports, and source-essay clicks. Buy clicks are not counted as purchases. Captions and wallet addresses are not included. |

Do not put private keys or seed phrases in this repo.

## Artwork

Shipped files:

- `public/media/logo-seal.png` — circular logo with the name in the ring. Download and footer seal. Do not crop the lettering.
- `public/media/mascot-mark.png` — inner mascot cropped from that seal for the nav, hero, and favicon. A lettering-free master was not part of the supplied art.
- `public/media/banner-retro.png` — retro desktop banner. The name is already in the image, so the page does not put another heading on top of it.

Display copies are WebP. Downloads stay PNG.

Still needed if you want them on the site: a transparent mascot cutout, a comic-book banner, a purple space banner, and the Telegram welcome image. Those are not faked here.

## Meme maker

Three compositions: retro desktop (the banner inside a window), comic burst (drawn on the canvas), and mascot badge (the circular seal). Export is a 1080×1080 PNG with the name and ticker in the footer. Share uses the device share sheet when it can take the file. Otherwise it downloads the PNG and copies post text. The site does not publish posts.
