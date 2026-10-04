import { BuyGuide } from './components/BuyGuide.tsx'
import { Community } from './components/Community.tsx'
import { Desktop } from './components/Desktop.tsx'
import { FAQ } from './components/FAQ.tsx'
import { Footer } from './components/Footer.tsx'
import { Hero } from './components/Hero.tsx'
import { MemeMaker } from './components/MemeMaker.tsx'
import { Navigation } from './components/Navigation.tsx'
import { Section } from './components/Section.tsx'
import { Story } from './components/Story.tsx'
import { TokenDetails } from './components/TokenDetails.tsx'

export default function App() {
  return (
    <>
      <Navigation />
      <main id="content">
        <Hero />
        <Story />
        <Desktop />
        <Section
          id="meme"
          kicker="Meme maker"
          title="Make a meme. Keep it on your machine."
          lede="Three compositions, a top caption, a bottom caption, and a 1080 × 1080 PNG. No wallet, no upload, and no account."
        >
          <MemeMaker />
        </Section>
        <Section id="token" kicker="Token details" title="Open the case. Check the details.">
          <TokenDetails />
        </Section>
        <BuyGuide />
        <Community />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
