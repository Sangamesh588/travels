import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import PopularRoutes from "@/components/PopularRoutes";
import Fleet from "@/components/Fleet";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <PopularRoutes />
      <Fleet />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}