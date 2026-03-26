import { AboutSection } from "@/components/home/AboutSection";
import { Categories } from "@/components/home/Categories";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedPlants } from "@/components/home/FeaturedPlants";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Categories />
        <FeaturedPlants />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
