"use client";

// Homepage - hero section & widgets

import { PageLayout } from "@/components";
import { SpotifyWidget, ChessWidget, ClashWidget } from "@/components/widgets";

// home page
export default function Home() {
  return (
    <PageLayout>
      {/* hero section */}
      <section className="container medium section-hero">
        <div className="hero-content">
          <h1 className="h1 hero-title">
            I'm Will Hao — welcome to my website!
          </h1>
          <p className="body-1 hero-desc">
            I am a rising sophomore at UT Austin, and this website serves as my
            personal portfolio that contains my work, blog, projects, and more.
          </p>
          <div className="hero-widgets">
            <SpotifyWidget />
            <ChessWidget />
            <ClashWidget />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
