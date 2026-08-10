import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../hooks/useCart";

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { handleGetMyOrders } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await handleGetMyOrders();

        // console.log("Orders response:", response);

        if (response?.success) {
          setOrders(response.orders || []);
        }
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div
        className="min-h-screen pb-24"
        style={{
          backgroundColor: tokens.surface,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <main className="max-w-6xl mx-auto px-8 lg:px-16 pt-16 lg:pt-24">

          {/* Header */}
          <div className="mb-12">
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-4"
              style={{ color: tokens.secondary }}
            >
              Your Collection
            </p>

            <h1
              className="font-light leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: tokens.onSurface,
                fontSize: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              Your Orders
            </h1>

            <p
              className="mt-5 text-sm"
              style={{ color: tokens.muted }}
            >
              A record of your curated selections.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <section
              className="py-24 flex items-center justify-center"
              style={{
                backgroundColor: tokens.surfaceLow,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: tokens.muted }}
              >
                Loading your orders...
              </p>
            </section>
          ) : orders.length === 0 ? (

            /* Empty Orders */
            <section
              className="py-24 px-8 flex flex-col items-center justify-center text-center"
              style={{
                backgroundColor: tokens.surfaceLow,
              }}
            >
              <p
                className="text-4xl md:text-5xl font-light mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: tokens.onSurface,
                }}
              >
                No orders yet.
              </p>

              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-8"
                style={{ color: tokens.muted }}
              >
                Your collection awaits
              </p>

              <Link
                to="/"
                className="px-10 py-4 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                style={{
                  backgroundColor: tokens.onSurface,
                  color: tokens.surface,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.primary;
                  e.currentTarget.style.color = tokens.onSurface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.onSurface;
                  e.currentTarget.style.color = tokens.surface;
                }}
              >
                Explore the Archive
              </Link>
            </section>

          ) : (

            /* Orders */
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const orderId = order?.razorpay?.orderId || order?._id || order?.id;
                const amount = order?.price?.amount ?? 0;
                const currency = order?.price?.currency ?? "INR";

                const formattedDate = order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—";

                return (
                  <section
                    key={order._id}
                    className="p-6 md:p-8"
                    style={{
                      backgroundColor: tokens.surfaceLow,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                      {/* Order Info */}
                      <div>
                        <p
                          className="text-[9px] uppercase tracking-[0.2em] mb-2"
                          style={{ color: tokens.muted }}
                        >
                          Order Reference
                        </p>

                        <h2
                          className="text-2xl"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: tokens.primaryDark,
                          }}
                        >
                          #{order._id}
                        </h2>

                        <p
                          className="mt-2 text-[10px] uppercase tracking-[0.15em]"
                          style={{ color: tokens.secondary }}
                        >
                          {formattedDate}
                        </p>
                      </div>

                      {/* Payment */}
                      <div>
                        <p
                          className="text-[9px] uppercase tracking-[0.2em] mb-2"
                          style={{ color: tokens.muted }}
                        >
                          Payment
                        </p>

                        <span
                          className="text-[10px] uppercase tracking-[0.15em] font-medium"
                          style={{
                            color:
                              order.status === "paid"
                                ? "#5a7a5a"
                                : tokens.secondary,
                          }}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>

                      {/* Total */}
                      <div>
                        <p
                          className="text-[9px] uppercase tracking-[0.2em] mb-2"
                          style={{ color: tokens.muted }}
                        >
                          Total
                        </p>

                        <p
                          className="text-lg"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: tokens.onSurface,
                          }}
                        >
                          {currency}{" "}
                          {Number(amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    {(order.orderItems || []).length > 0 && (
                      <div className="mt-6 space-y-4">
                        {(order.orderItems || []).map((item, itemIndex) => {
                          const itemPrice = item.price?.amount || 0;
                          const itemCurrency = item.price?.currency || currency;
                          const itemTotal = itemPrice * (item.quantity || 0);

                          return (
                            <div
                              key={item._id || itemIndex}
                              className="grid grid-cols-[72px_1fr] gap-4 items-center p-4"
                              style={{
                                backgroundColor: tokens.surfaceHighest,
                              }}
                            >
                              <div className="w-18 h-24 overflow-hidden bg-white">
                                {item.images?.[0]?.url ? (
                                  <img
                                    src={item.images[0].url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full" />
                                )}
                              </div>

                              <div className="space-y-2 text-sm">
                                <p
                                  className="font-medium"
                                  style={{ color: tokens.onSurface }}
                                >
                                  {item.title}
                                </p>

                                {item.variant && (
                                  <p style={{ color: tokens.outline }}>
                                    {item.variant}
                                  </p>
                                )}

                                <p style={{ color: tokens.secondary }}>
                                  Quantity: {item.quantity}
                                </p>

                                <p style={{ color: tokens.onSurface }}>
                                  {itemCurrency} {Number(itemPrice).toLocaleString("en-IN")}
                                </p>

                                <p style={{ color: tokens.muted }}>
                                  Total: {itemCurrency} {Number(itemTotal).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Details */}
                    <Link
                        to={`/order/${orderId}`}
                        className="px-6 py-3 text-center text-[9px] uppercase tracking-[0.2em] transition-all duration-300"
                        style={{
                          border: `1px solid ${tokens.outline}`,
                          color: tokens.onSurface,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            tokens.onSurface;
                          e.currentTarget.style.color = tokens.surface;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "transparent";
                          e.currentTarget.style.color =
                            tokens.onSurface;
                        }}
                      >
                        View Details
                      </Link>
                  </section>
                );
              })}
            </div>
          )}

          {/* Footer Note */}
          <div
            className="mt-16 pt-8"
            style={{
              borderTop: `1px solid ${tokens.surfaceHighest}`,
            }}
          >
            <p
              className="text-[9px] uppercase tracking-[0.18em] leading-loose"
              style={{ color: tokens.muted }}
            >
              Every purchase is carefully prepared and authenticated before
              dispatch.
            </p>
          </div>

        </main>
      </div>
    </>
  );
};

export default Orders;