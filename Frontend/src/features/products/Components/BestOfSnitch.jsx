import React from "react";
import { Link, useNavigate } from "react-router";

const BestOfSnitch = ({ products = [] }) => {
  const navigate = useNavigate();

  const featuredProducts = products.filter((p) => p.isFeatured);   

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3">
            The Collection
          </p>
          <h2
            className="text-4xl md:text-5xl font-light text-[#1b1c1a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Best of Snitch
          </h2>
        </div>

        <Link
          to="/products"
          className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a] border-b border-[#1b1c1a] pb-1"
        >
          View All →
        </Link>
      </div>

      {/* PRODUCTS — HORIZONTAL SCROLL */}
      {featuredProducts.length > 0 ? (
        <div className="flex gap-5 md:gap-7 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {featuredProducts.map((product) => {
            const imageUrl =
              product.images?.length > 0
                ? product.images[0].url
                : "/snitch_editorial_warm.png";

            return (
              <article
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] snap-start"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#f5f3f0]">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="pt-5">
                  <h3
                    className="text-lg md:text-xl text-[#1b1c1a] group-hover:text-[#C9A96E] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.title}
                  </h3>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#7A6E63]">
                    {product.price?.currency}{" "}
                    {product.price?.amount?.toLocaleString()}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-sm text-[#7A6E63]">
          No products available.
        </div>
      )}

      {/* MOBILE VIEW ALL */}
      <div className="mt-10 text-center sm:hidden">
        <Link
          to="/products"
          className="text-[10px] uppercase tracking-[0.2em] border-b border-[#1b1c1a] pb-1"
        >
          View All →
        </Link>
      </div>
    </section>
  );
};

export default BestOfSnitch;