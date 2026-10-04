/**
 * Single source for public project facts.
 *
 * Unknown facts stay null. Do not fill this file with sample supply figures,
 * taxes, holder counts, partner logos, or a guessed contract address.
 *
 * Buying stays off until launchStatus is "live", contractConfirmed is true,
 * contractAddress is a valid Ethereum address, and swapUrl is an https URL.
 * A format check is not proof of authenticity. contractConfirmed must be set
 * by the project owner on purpose.
 *
 * siteUrl is null until a production domain exists. Keep it null or a
 * double-quoted https origin with no trailing path, for example
 * "https://example.com". The build reads that field for the canonical URL.
 */

export type LaunchStatus = 'prelaunch' | 'live'

export type EvidenceStatus = 'documented' | 'not_announced' | 'unverified'

export interface Evidence<T> {
  value: T | null
  status: EvidenceStatus
  evidenceUrl: string | null
  evidenceLabel: string | null
  checkedAt: string | null
  note: string | null
}

export interface AllocationSlice {
  label: string
  percent: number
  evidenceUrl: string | null
}

export interface LiquidityRecord {
  kind: 'locked' | 'burned' | null
  status: EvidenceStatus
  pool: string | null
  locker: string | null
  shareCovered: string | null
  unlockDate: string | null
  scope: string | null
  evidenceUrl: string | null
  evidenceLabel: string | null
  checkedAt: string | null
  note: string | null
}

export interface DownloadAsset {
  id: string
  title: string
  description: string
  file: string
  preview: string
  width: number
  height: number
  alt: string
  sizeLabel: string
}

export interface SiteConfig {
  name: string
  shortName: string
  symbol: string
  ticker: string
  description: string
  chainId: 1
  chainName: string
  launchStatus: LaunchStatus
  contractConfirmed: boolean
  contractAddress: string | null
  swapUrl: string | null
  explorerUrl: string | null
  telegramUrl: string | null
  xUrl: string | null
  chartUrl: string | null
  siteUrl: string | null
  analyticsEnabled: boolean
  sourceArticle: {
    title: string
    url: string
    date: string
    dateLabel: string
    author: string
  }
  chain: Evidence<string> & { chainId: 1 }
  supply: Evidence<string>
  buyTax: Evidence<string>
  sellTax: Evidence<string>
  vesting: Evidence<string>
  allocations: AllocationSlice[] | null
  liquidity: LiquidityRecord
  adminPermissions: {
    ownership: Evidence<string>
    upgradeability: Evidence<string>
    privilegedRoles: Evidence<string>
  }
  evidenceCheckedAt: string | null
  marketData: {
    enabled: boolean
    pairAddress: string | null
    sourceUrl: string | null
  }
  assetManifest: DownloadAsset[]
  affiliation: string
  risk: string
}

function unannounced<T>(): Evidence<T> {
  return {
    value: null,
    status: 'not_announced',
    evidenceUrl: null,
    evidenceLabel: null,
    checkedAt: null,
    note: null,
  }
}

export const site: SiteConfig = {
  name: 'Vitalik-Inspired World Computer',
  shortName: 'VITALIKWC',
  symbol: 'VITALIKWC',
  ticker: '$VITALIKWC',
  description:
    'Meet $VITALIKWC, an independent Ethereum community memecoin. A tiny computer mascot, the world-computer story, and a meme maker. Not affiliated with Vitalik Buterin or the Ethereum Foundation.',
  chainId: 1,
  chainName: 'Ethereum mainnet',
  launchStatus: 'prelaunch',
  contractConfirmed: false,
  contractAddress: null,
  swapUrl: null,
  explorerUrl: null,
  telegramUrl: null,
  xUrl: null,
  chartUrl: null,
  siteUrl: null,
  analyticsEnabled: false,
  sourceArticle: {
    title: 'The cryptographic world computer',
    url: 'https://vitalik.eth.limo/general/2026/09/27/the_cryptographic_world_computer.html',
    date: '2026-09-27',
    dateLabel: 'September 27, 2026',
    author: 'Vitalik Buterin',
  },
  chain: {
    value: 'Ethereum mainnet',
    chainId: 1,
    status: 'documented',
    evidenceUrl: null,
    evidenceLabel: null,
    checkedAt: null,
    note: 'Stated by this project. This is not an on-chain check until a contract address is published and reviewed.',
  },
  supply: unannounced(),
  buyTax: unannounced(),
  sellTax: unannounced(),
  vesting: unannounced(),
  allocations: null,
  liquidity: {
    kind: null,
    status: 'not_announced',
    pool: null,
    locker: null,
    shareCovered: null,
    unlockDate: null,
    scope: null,
    evidenceUrl: null,
    evidenceLabel: null,
    checkedAt: null,
    note: 'Liquidity is tracked separately from ownership. Nothing has been announced.',
  },
  adminPermissions: {
    ownership: unannounced(),
    upgradeability: unannounced(),
    privilegedRoles: unannounced(),
  },
  evidenceCheckedAt: null,
  marketData: {
    enabled: false,
    pairAddress: null,
    sourceUrl: null,
  },
  assetManifest: [
    {
      id: 'seal',
      title: 'Circular logo',
      description:
        'Full badge with “Vitalik-Inspired World Computer” around the rim. Use it where the lettering can be read. Do not crop the words off.',
      file: '/media/logo-seal.png',
      preview: '/media/logo-seal.webp',
      width: 768,
      height: 768,
      alt: 'Circular badge reading Vitalik-Inspired World Computer around a flexing purple computer mascot with a globe on its screen.',
      sizeLabel: '2.0 MB PNG',
    },
    {
      id: 'mascot',
      title: 'Mascot mark',
      description:
        'Inner artwork cropped from the seal for navigation, favicons, and other small sizes. A lettering-free master file was not supplied, so this crop is the small-size mark. It still has the mint circle, not a transparent character cutout.',
      file: '/media/mascot-mark.png',
      preview: '/media/mascot-mark.webp',
      width: 640,
      height: 640,
      alt: 'Mascot of Vitalik-Inspired World Computer: a smiling purple desktop computer with a globe on its screen, flexing both arms and wearing sneakers.',
      sizeLabel: '1.0 MB PNG',
    },
    {
      id: 'banner',
      title: 'Retro desktop banner',
      description:
        'Wide promotional artwork. The name is already painted into the picture, so do not place another title on top of it.',
      file: '/media/banner-retro.png',
      preview: '/media/banner-retro.webp',
      width: 1600,
      height: 534,
      alt: 'Retro desktop banner with the words Vitalik-Inspired World Computer in a window beside the flexing computer mascot.',
      sizeLabel: '2.1 MB PNG',
    },
  ],
  affiliation:
    'Independent community project. Not affiliated with or endorsed by Vitalik Buterin or the Ethereum Foundation.',
  risk: 'VITALIKWC is a speculative community memecoin. Its value can fall to zero. Buying it does not confer ownership of Ethereum infrastructure or rights in Vitalik Buterin’s work.',
}
