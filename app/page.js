"use client";

/**
 * BASE SITE PAGE: Homepage
 *
 * The main landing page of the website.
 * Contains hero section, widgets, and basic layout
 */

import { NavigationBar, Footer } from "@/components";
import { SpotifyWidget, ChessWidget, ClashWidget } from "@/components/widgets";

// Main Home Page
export default function Home() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          {/* Hero Section - homepage-specific, inlined */}
          <section className="container medium section-hero">
            <div className="hero-content">
              <h1 className="h1 hero-title">
                I'm Will — welcome to my website!
              </h1>
              <p className="body-1 hero-desc">
                I am a rising sophomore at UT Austin, and this website serves as
                my personal portfolio that contains my work, blog, projects, and
                more.
              </p>
              <div className="hero-widgets">
                <SpotifyWidget />
                <ChessWidget />
                <ClashWidget />
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
