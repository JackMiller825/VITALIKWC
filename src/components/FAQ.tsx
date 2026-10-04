import { addressPresentation } from '../config/guards.ts'
import { site } from '../config/site.ts'
import { Section } from './Section.tsx'

const publishedAddress = addressPresentation(site)

const faqs = [
  {
    q: 'What is VITALIKWC?',
    a: 'An independent Ethereum community memecoin and a mascot called Vitalik-Inspired World Computer. The site is a story, a tiny desktop, and a meme maker. It is not an Ethereum upgrade and it does not run network infrastructure.',
  },
  {
    q: 'Is Vitalik involved?',
    a: site.affiliation,
  },
  {
    q: 'What inspired it?',
    a: `The essay “${site.sourceArticle.title},” published ${site.sourceArticle.dateLabel} by ${site.sourceArticle.author}. It discusses verification, privacy, and distributed computation as directions for Ethereum. The token does not provide those capabilities.`,
  },
  {
    q: 'Which network is it on?',
    a:
      publishedAddress.kind === 'published'
        ? 'Ethereum mainnet, and a contract address is published on this page. Matching the address in a wallet is still your own check. This site is not an audit.'
        : 'Ethereum mainnet. That is the project’s stated network. A contract address has not been announced, so this is not an on-chain confirmation.',
  },
  {
    q: 'Where is the confirmed contract address?',
    a:
      publishedAddress.kind === 'published'
        ? `The full address is in the introduction: ${publishedAddress.address}. Copy it from this page and compare it before any swap. Do not trust an address pasted from a reply or a different site.`
        : 'It has not been announced. When it is, the full address will be shown on this page with a copy button and an evidence link. Do not trust an address pasted from a reply or a different site.',
  },
  {
    q: 'How can I buy when live?',
    a: 'Only through the official swap link on this page, after the launch state, contract, and swap destination are all confirmed. Compare the full address. This site does not ask you to connect a wallet. Never share your seed phrase.',
  },
  {
    q: 'Does the meme maker require a wallet?',
    a: 'No. Captions stay in your browser. You can download a PNG without an account, a wallet, or a purchase.',
  },
  {
    q: 'Where can I check token details?',
    a: 'In the Token Details section on this page. Each fact is labeled Documented, Not announced, or Unverified. Missing facts stay blank until evidence is published.',
  },
]

export function FAQ() {
  return (
    <Section id="faq" kicker="FAQ" title="Questions the desktop can answer">
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
