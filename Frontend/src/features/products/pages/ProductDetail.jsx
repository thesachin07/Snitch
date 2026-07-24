import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const availableAttributes = React.useMemo(() => {
    if (!product?.variants) return {};

    const attrs = {};

    product.variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!attrs[key]) {
          attrs[key] = [];
        }

        if (!attrs[key].includes(value)) {
          attrs[key].push(value);
        }
      });
    });

    return attrs;
  }, [product]);

  const activeVariant = React.useMemo(() => {
    if (!product?.variants) return null;

    return (
      product.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([key, value]) => variant.attributes[key] === value,
        ),
      ) || product.variants[0]
    );
  }, [product, selectedAttributes]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      console.log(
        "Setting selected attributes:",
        product.variants[0].attributes,
      );

      setSelectedAttributes(product.variants[0].attributes);
    }
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  const { handleGetProductById } = useProduct();

  async function fetchProductDetails() {
    try {
      setLoading(true);
      const data = await handleGetProductById(productId);
      setProduct(data);

      if (data?.variants && data.variants.length > 0) {
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const displayImages =
    activeVariant?.images?.length > 0
      ? activeVariant.images
      : product?.images || [{ url: "/snitch_editorial_warm.png" }];

  const displayPrice = activeVariant?.price ||
    product?.price || { currency: "INR", amount: 0 };

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };

    // Find if an exact match exists for this combination
    const exactMatch = product.variants.find((v) => {
      const vAttrs = v.attributes || {};
      return (
        Object.keys(newAttrs).every((k) => newAttrs[k] === vAttrs[k]) &&
        Object.keys(vAttrs).every((k) => newAttrs[k] === vAttrs[k])
      );
    });

    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      
      const fallbackVariant = product.variants.find(
        (v) => v.attributes && v.attributes[attrName] === value,
      );
      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      } else {
        setSelectedAttributes(newAttrs);
      }
    }
  };

  const handleAddItem = (item) => {
    console.log("Item added to cart:", item);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fbf9f6" }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] animate-pulse">
          Loading Piece Archive...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fbf9f6" }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-red-700">
          Product Archive Not Found
        </span>
      </div>
    );
  }
  console.log("Available Attributes:", availableAttributes);
  console.log("Selected Attributes:", selectedAttributes);
  console.log("Active Variant:", activeVariant);

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
              {displayImages.length > 1 && (
                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? "opacity-100 ring-1 ring-[#C9A96E] ring-offset-2" : "opacity-50 hover:opacity-100"}`}
                      style={{
                        backgroundColor: "#f5f3f0",
                        "--tw-ring-offset-color": "#fbf9f6",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div
                className="relative w-full aspect-[4/5] overflow-hidden group"
                style={{ backgroundColor: "#f5f3f0" }}
              >
                <img
                  src={
                    displayImages[selectedImage]?.url || displayImages[0].url
                  }
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? displayImages.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                      style={{
                        backgroundColor: "rgba(251,249,246,0.8)",
                        borderColor: "#e4e2df",
                        color: "#1b1c1a",
                      }}
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === displayImages.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-4 lg:left-auto lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                      style={{
                        backgroundColor: "rgba(251,249,246,0.8)",
                        borderColor: "#e4e2df",
                        color: "#1b1c1a",
                      }}
                      aria-label="Next image"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1b1c1a",
                }}
              >
                {product.title}
              </h1>

              <div className="mb-8">
                <span
                  className="text-sm uppercase tracking-[0.2em] font-medium"
                  style={{ color: "#1b1c1a" }}
                  
                >
                  {displayPrice?.currency}{" "}
                  {displayPrice?.amount?.toLocaleString()}
                </span>
              </div>

              <div
                className="h-px w-full mb-8"
                style={{ backgroundColor: "#e4e2df" }}
              />

             
              {Object.entries(availableAttributes).map(([attrName, values]) => (
                <div key={attrName} className="mb-6">
                  <h3
                    className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3"
                    style={{ color: "#C9A96E" }}
                  >
                    {attrName}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => {
                      const isSelected = selectedAttributes[attrName] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeChange(attrName, val)}
                          className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? "border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]" : "border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]"}`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Stock Information */}
              {activeVariant && activeVariant.stock !== undefined && (
                <div className="mb-6">
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    {activeVariant.stock > 0
                      ? `${activeVariant.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              <div className="mb-12">
                <h3
                  className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4"
                  style={{ color: "#C9A96E" }}
                >
                  The Details
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7A6E63" }}
                >
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-auto">
                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                  style={{
                    backgroundColor: "#1b1c1a",
                    color: "#fbf9f6",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onClick={() =>
                    handleAddItem({
                      productId: product._id,
                      variantId: activeVariant?._id,
                    })
                  }
                >
                  Add to Cart
                </button>

                <button
                  className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#d0c5b5",
                    color: "#1b1c1a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
