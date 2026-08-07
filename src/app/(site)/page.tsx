import { Reveal } from "@/components/site/Reveal";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Problem } from "@/components/site/Problem";
import { HowItWorks } from "@/components/site/HowItWorks";
import { DayOne } from "@/components/site/DayOne";
import { Panel } from "@/components/site/Panel";
import { Features } from "@/components/site/Features";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Reveal />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <DayOne />
        <Panel />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
