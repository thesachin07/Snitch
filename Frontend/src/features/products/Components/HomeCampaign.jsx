import React from "react";
import { Link } from "react-router";

const HomeCampaign = () => {
  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 pb-20">
      <Link
        to="/products?sort=new"
        className="group relative block h-[420px] overflow-hidden"
      >
        <img
          src="/snitch_editorial_warm.png"
          alt="New season collection"
          className="
            absolute inset-0
            w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-4">
              Spring / Summer '26
            </p>

            <h2
              className="text-5xl md:text-6xl text-white font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              The New Season
            </h2>

            <span className="
              inline-block mt-7
              border-b border-white
              pb-2
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-white
            ">
              Explore Collection →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HomeCampaign;