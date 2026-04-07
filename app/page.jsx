import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import OrderForm from '@/components/OrderForm'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import AIAssistant from '@/components/AIAssistant'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <OrderForm />
      <FAQ />
      <CTA />
      <Footer />
      <AIAssistant />
    </>
  )
}
