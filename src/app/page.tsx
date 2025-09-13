import ContactSection from "@/components/contact"
import Features from "@/components/features-11"
import FeaturesSection from "@/components/features-8"
import FooterSection from "@/components/footer"
import HeroSection from "@/components/hero-section"

const Home = () => {
  return (
    <div>
      {/* <ModeToggle/>
        <ThirdWebConnectButton/> */}

        <HeroSection/>
        <FeaturesSection/>
        <ContactSection/>
        <FooterSection/>

    </div>
  )
}
export default Home