import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAppStore from "../../../app/app.store";
import { getAllProducts } from "../service/product.api";

import HomeHero from "../Components/HomeHero";
import HomeCategories from "../Components/HomeCategories";
import HomeCampaign from "../Components/HomeCampaign";
import HomeBenefits from "../Components/HomeBenefits";
import BestOfSnitch from "../Components/BestOfSnitch";

const Home = () => {
const homepage = useAppStore((state) => state.homepage);
const homepageLoading = useAppStore(
  (state) => state.homepageLoading
);

const homepageError = useAppStore(
  (state) => state.homepageError
);

const [featuredProducts, setFeaturedProducts] = useState([]);
const [featuredLoading, setFeaturedLoading] = useState(true);

const handleGetHomepage = useAppStore(
  (state) => state.handleGetHomepage
);

 useEffect(() => {
  async function fetchFeaturedProducts() {
    try {
      const featuredData = await getAllProducts({ featured: true, limit: 8 });
      setFeaturedProducts(featuredData.products || []);
    } catch (error) {
      console.error("Failed to fetch featured products", error);
      setFeaturedProducts([]);
    } finally {
      setFeaturedLoading(false);
    }
  }

  fetchFeaturedProducts();
  handleGetHomepage();
}, []);
// console.log("HOMEPAGE DATA:", homepage);
if (homepageLoading) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen bg-[#fbf9f6] flex items-center justify-center"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E]">
          Loading...
        </p>
      </div>
    </>
  );
}

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <main
        className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >


      <HomeHero hero={homepage?.hero} />

      <HomeCategories categories={homepage?.categories} />

      <HomeCampaign campaign={homepage?.campaign} />

      {/* BENEFITS */}
      <HomeBenefits />

      {/* PRODUCTS FROM MONGODB */}
      <BestOfSnitch products={featuredLoading ? [] : featuredProducts} />

      {/* FOOTER */}
      <footer className="border-t border-[#e4e2df] px-6 md:px-10 lg:px-16 xl:px-24 py-14">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          <div>
            <Link
              to="/"
              className="text-xl tracking-[0.3em]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              SNITCH.
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#7A6E63]">
              Contemporary essentials designed for effortless everyday
              elegance.
            </p>
          </div>

          <div className="flex gap-12">

            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a]">
                Shop
              </p>

              <Link
                to="/products?category=men"
                className="text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Men
              </Link>

              <Link
                to="/products?category=women"
                className="text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Women
              </Link>

              <Link
                to="/products?category=kids"
                className="text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Kids
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1b1c1a]">
                Help
              </p>

              <Link
                to="/products"
                className="text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                All Products
              </Link>

              <Link
                to="/orders"
                className="text-xs text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Orders
              </Link>
            </div>

          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#e4e2df]">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#B5ADA3]">
            © {new Date().getFullYear()} Snitch. All rights reserved.
          </p>
        </div>

      </footer>

      </main>
    </>
  );
};

export default Home;