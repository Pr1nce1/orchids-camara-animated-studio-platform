"use client";

import { useState } from "react";
import { IntroAnimation } from "@/components/IntroAnimation";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/Statistics";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { YouTubeVideos } from "@/components/YouTubeVideos";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { DynamicSEO } from "@/components/DynamicSEO";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      <DynamicSEO />
      <IntroAnimation onComplete={() => setShowContent(true)} />
      
      {showContent && (
        <div className="min-h-screen">
          <Header />
          <main>
            <Hero />
            <Statistics />
            <Services />
            <Portfolio />
            <YouTubeVideos />
            <Reviews />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      )}
    </>
  );
}
