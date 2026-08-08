import "./home.css";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { TrustStrip } from "./trust-strip";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { Testimonial } from "./testimonial";
import { Pricing } from "./pricing";
import { FinalCta } from "./final-cta";
import { Footer } from "./footer";

export default function Home5() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Features />
      <HowItWorks />
      <Testimonial />
      {/* <Pricing /> */}
      <FinalCta />
      <Footer />
    </div>
  );
}
