import React from "react";

const benefits = [
  {
    title: "Free Shipping",
    description: "Complimentary delivery on every order.",
  },
  {
    title: "Easy Returns",
    description: "Simple returns within 7 days.",
  },
  {
    title: "Secure Payments",
    description: "Your payment is always protected.",
  },
  {
    title: "Premium Quality",
    description: "Thoughtfully crafted pieces.",
  },
];

const HomeBenefits = () => {
  return (
    <section className="border-y border-[#e4e2df]">
      <div className="grid grid-cols-2 lg:grid-cols-4">

        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className={`
              px-6 py-10 text-center
              ${index < 3 ? "lg:border-r border-[#e4e2df]" : ""}
              ${index % 2 === 0 ? "border-r border-[#e4e2df] lg:border-r" : ""}
            `}
          >
            <h3
              className="text-xl text-[#1b1c1a]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {benefit.title}
            </h3>

            <p className="mt-2 text-[11px] leading-relaxed text-[#7A6E63]">
              {benefit.description}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
};

export default HomeBenefits;