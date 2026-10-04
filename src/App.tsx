import { BuyGuide } from './components/BuyGuide.tsx'
import { Community } from './components/Community.tsx'
import { Desktop } from './components/Desktop.tsx'
import { Footer } from './components/Footer.tsx'
import { Hero } from './components/Hero.tsx'
import { Navigation } from './components/Navigation.tsx'
import { Section } from './components/Section.tsx'
import { TokenDetails } from './components/TokenDetails.tsx'

export default function App() {
  return (
    <>
      <Navigation />
      <main id="content">
        <Hero />
        <Desktop />
        <Section id="token" kicker="Tokenomics" title="Tokenomics">
          <TokenDetails />
        </Section>
        <BuyGuide />
        <Community />
      </main>
      <Footer />
    </>
  )
}
