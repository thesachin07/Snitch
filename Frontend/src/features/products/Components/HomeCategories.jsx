import React from "react";
import { Link } from "react-router";

const categories = [
  {
    name: "Men",
    description: "Precision tailoring and elevated essentials.",
    image: "/snitch_editorial_warm.png",
    link: "/products?category=men",
  },
  {
    name: "Women",
    description: "Fluid silhouettes and timeless curation.",
    image: "/snitch_editorial_warm.png",
    link: "/products?category=women",
  },
  {
    name: "Kids",
    description: "Miniature classics for the next generation.",
    image: "/snitch_editorial_warm.png",
    link: "/products?category=kids",
  },
];

const HomeCategories = ({ categories }) => {
  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.link}
            className="group"
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#f5f3f0]">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="mt-5">
              <h2
                className="text-2xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {category.name}
              </h2>

              <p className="mt-1 text-xs text-[#7A6E63]">
                {category.description}
              </p>

              <span className="inline-block mt-3 text-[10px] uppercase tracking-[0.15em] border-b border-[#1b1c1a]">
                Shop {category.name} →
              </span>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
};
export default HomeCategories;