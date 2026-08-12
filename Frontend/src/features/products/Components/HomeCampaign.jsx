import React from "react";
import { Link } from "react-router";

const HomeCampaign = ({ campaign }) => {
  if (!campaign) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-20">
      <Link
        to={campaign.link}
        className="relative block h-[420px] overflow-hidden group"
      >
        <img
          src={campaign.image}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-5">
              {campaign.eyebrow}
            </p>

            <h2
              className="text-5xl md:text-6xl font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {campaign.title}
            </h2>

            <span className="inline-block mt-7 text-[10px] uppercase tracking-[0.2em] border-b border-white pb-1">
              Explore Collection →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HomeCampaign;