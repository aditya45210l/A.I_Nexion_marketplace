import ContactSection from "@/components/contact";
import FeaturesSection from "@/components/features-8";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import { decryptAPIKey, encryptAPIKey } from "@/lib/actions/EncryptDecript";

const Home = () => {
  const incryptedKey = encryptAPIKey(
    "0x25BBe47DfDA88AA7BF153110736633d0c344B3e2"
  );
  console.log("incrypted key: ", incryptedKey);
  const decryptedKey = decryptAPIKey(incryptedKey);
  console.log("decrypted key: ", decryptedKey);
  return (
    <div className="">
      {/* <ModeToggle/>
        <ThirdWebConnectButton/> */}

      <HeroSection />
      <FeaturesSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};
export default Home;
