import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import OrderForm from '@/components/ui/OrderForm'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/layout/Footer'

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
    </>
  )
}
