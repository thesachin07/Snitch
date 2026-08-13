import React from "react";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const imageUrl =
    product.images?.length > 0
      ? product.images[0].url
      : "/snitch_editorial_warm.png";

  return (
    <article
      onClick={() => navigate(`/product/${product._id}`)}
      className="group cursor-pointer"
    >
      {/* IMAGE */}
      <div className="aspect-[4/5] overflow-hidden bg-[#f5f3f0]">
        <img
          src={imageUrl}
          alt={product.title}
          className="
            w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />
      </div>

      {/* INFO */}
      <div className="pt-5">
        <h3
          className="
            text-lg md:text-xl
            text-[#1b1c1a]
            group-hover:text-[#C9A96E]
            transition-colors
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
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
};

export default ProductCard;