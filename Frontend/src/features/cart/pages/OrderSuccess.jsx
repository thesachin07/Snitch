import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useLocation, Link } from "react-router";

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#eae8e5",
  surfaceHighest: "#e4e2df",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#4d463a",
  secondary: "#7A6E63",
  muted: "#B5ADA3",
  primary: "#C9A96E",
  primaryDark: "#745a27",
  outlineVariant: "#d0c5b5",
  outline: "#7f7668",
};

const OrderSuccess = () => {
  const location = useLocation();
  const { handleGetOrderById } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;

        const response = await handleGetOrderById(orderId);

        if (response?.success) {
          setOrder(response.order);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatCurrency = (amount, currency = "INR") => {
    return `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: tokens.muted }}
        >
          Loading order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h1
          className="text-4xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: tokens.onSurface,
          }}
        >
          Order not found
        </h1>

        <Link
          to="/"
          className="px-8 py-4 text-[10px] uppercase tracking-[0.2em]"
          style={{
            backgroundColor: tokens.primaryDark,
            color: "#fff",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const orderItems = order.orderItems || [];

  const totalAmount = order.price?.amount || 0;
  const currency = order.price?.currency || "INR";

  return (
    <div
      className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
      style={{
        backgroundColor: tokens.surface,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-16 lg:pt-24">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7">

            <div className="space-y-6 mb-12">
              <span
                className="uppercase tracking-[0.2em] text-[10px]"
                style={{ color: tokens.secondary }}
              >
                Transaction Complete
              </span>

              <h1
                className="text-5xl md:text-7xl leading-tight font-light tracking-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: tokens.onSurface,
                }}
              >
                A piece of our
                <br />
                Atelier is yours.
              </h1>

              <div className="pt-4">
                <p
                  className="text-sm uppercase tracking-widest"
                  style={{ color: tokens.outline }}
                >
                  Order Reference
                </p>

                <p
                  className="text-2xl mt-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: tokens.primaryDark,
                  }}
                >
                  #{orderId}
                </p>
              </div>

              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: tokens.muted }}
              >
                Payment Status:{" "}
                <span style={{ color: tokens.primaryDark }}>
                  {order.status}
                </span>
              </p>
            </div>

            {/* ORDER SUMMARY */}
            <section
              className="p-8 md:p-12 space-y-8"
              style={{ backgroundColor: tokens.surfaceLow }}
            >
              <h3
                className="text-xl pb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  borderBottom: `1px solid ${tokens.outlineVariant}`,
                }}
              >
                Order Summary
              </h3>

              {/* ORDER ITEMS */}
              <div className="space-y-8">
                {orderItems.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex gap-6 items-center"
                  >
                    <div
                      className="w-24 h-32 flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: tokens.surfaceHigh }}
                    >
                      {item.images?.[0]?.url ? (
                        <img
                          className="w-full h-full object-cover grayscale-[20%]"
                          src={item.images[0].url}
                          alt={item.title}
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>

                    <div className="flex-grow space-y-1">
                      <h4
                        className="text-lg"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {item.title}
                      </h4>

                      <p
                        className="text-sm uppercase tracking-tighter"
                        style={{ color: tokens.outline }}
                      >
                        Quantity: {item.quantity}
                      </p>

                      <p
                        className="text-sm"
                        style={{ color: tokens.secondary }}
                      >
                        {formatCurrency(
                          item.price?.amount,
                          item.price?.currency
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div
                className="space-y-4 pt-4"
                style={{
                  borderTop: `1px solid ${tokens.outlineVariant}`,
                }}
              >
                <div
                  className="flex justify-between text-sm uppercase tracking-widest"
                  style={{ color: tokens.secondary }}
                >
                  <span>Subtotal</span>

                  <span>
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>

                <div
                  className="flex justify-between text-sm uppercase tracking-widest"
                  style={{ color: tokens.secondary }}
                >
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>

                <div
                  className="flex justify-between text-lg pt-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  <span>Total</span>

                  <span style={{ color: tokens.primaryDark }}>
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12 mt-12 lg:mt-0">

            <div className="space-y-10">

              {/* ARRIVAL */}
              <div className="space-y-4">
                <h3
                  className="text-xl italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Arrival Estimate
                </h3>

                <p
                  className="leading-relaxed"
                  style={{ color: tokens.onSurfaceVariant }}
                >
                  Your curated selection is being prepared for transit.
                  Your order will be processed shortly.
                </p>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="space-y-4">
                <h3
                  className="text-xl italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Shipping Address
                </h3>

                <p
                  className="leading-relaxed uppercase tracking-tighter text-sm"
                  style={{ color: tokens.onSurfaceVariant }}
                >
                  Shipping information will be available once
                  delivery details are added to the order.
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-4 pt-8">

                <Link
                  to="/orders"
                  className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                  style={{
                    backgroundColor: tokens.primaryDark,
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  View Order Status
                </Link>

                <Link
                  to="/"
                  className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] transition-all duration-300"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${tokens.outline}`,
                    color: tokens.onSurface,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      tokens.surfaceLow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "transparent";
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div
              className="pt-12"
              style={{
                borderTop: `1px solid ${tokens.outlineVariant}40`,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest leading-loose"
                style={{ color: tokens.outline }}
              >
                Your payment has been successfully processed.
                For bespoke alterations or inquiries, please contact
                our private concierge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;