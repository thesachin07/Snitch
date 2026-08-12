import React from "react";
import { Link } from "react-router";

const HomeHero = ({ hero }) => {
  if (!hero) return null;

  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden">

      <img
  src={hero.image}
  alt={hero.title}
  onError={(e) => { e.currentTarget.src = "/snitch_editorial_warm.png"}}
  className="absolute inset-0 w-full h-full object-cover"
/>

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="max-w-xl px-6">

          <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#3f3a34]">
            {hero.eyebrow}
          </p>

          <h1
            className="text-5xl md:text-7xl leading-[0.9] font-light text-[#1b1c1a]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {hero.title}
          </h1>

          <div className="mt-8 flex justify-center gap-3">

            <Link
              to={hero.primaryButton.link}
              className="bg-[#1b1c1a] text-white px-7 py-3 text-[10px] uppercase tracking-[0.18em] hover:bg-[#33312d] transition-colors"
            >
              {hero.primaryButton.label}
            </Link>

            <Link
              to={hero.secondaryButton.link}
              className="border border-[#1b1c1a] px-7 py-3 text-[10px] uppercase tracking-[0.18em] text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-white transition-colors"
            >
              {hero.secondaryButton.label}
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;