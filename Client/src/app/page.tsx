import HeroSection from "@/components/landing/hero-section";
import ServicesSection from "@/components/landing/services-section";
import MembersSection from "@/components/landing/members-section";
import EventsSection from "@/components/landing/events-section";
import GuidesSection from "@/components/landing/guides-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <MembersSection />
      <EventsSection />
      <GuidesSection />
    </>
  );
}
