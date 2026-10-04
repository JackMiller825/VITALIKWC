# Vitalik-Inspired World Computer

Website for **$VITALIKWC**, an independent Ethereum community memecoin. The page is a small retro desktop: the story, a working meme maker, and a token file that stays blank until facts are actually known.

Independent community project. Not affiliated with or endorsed by Vitalik Buterin or the Ethereum Foundation.

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

- The token is **pre-launch**. There is no contract address and no buy link.
- The network stated for the project is Ethereum mainnet (chain ID 1). That is a project statement, not an on-chain check.
- The meme maker runs in the browser. Captions are not uploaded.
- Supply, taxes, allocation, vesting, liquidity, and admin permissions are **not announced**. The page does not invent them.
- Telegram, X, the explorer, the swap, and the chart are unset. Those actions stay non-links.
- Analytics are off.

## Launch facts still required

Edit `src/config/site.ts` only when a value is real. Leave unknowns as `null`.

| Field | Needed for |
| --- | --- |
| `siteUrl` | Canonical URL, absolute social image, sitemap. Use `null` or a double-quoted https origin such as `"https://example.com"`. |
| `launchStatus: 'live'` | Public trading state. |
| `contractAddress` | The token address. |
| `contractConfirmed: true` | Owner confirmation. A valid-looking address is not enough. |
| `swapUrl` | Official https swap destination. The buy button stays hidden until status, confirmation, address, and this URL are all set. |
| `explorerUrl` | https page for the token. It is not guessed from the address. |
| `telegramUrl`, `xUrl` | Community links. |
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
