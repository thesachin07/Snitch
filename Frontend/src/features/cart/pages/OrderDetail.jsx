import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useCart } from "../hooks/useCart";

const tokens = {
  surface: "#fbf9f6",
  surfaceLow: "#f5f3f0",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#4d463a",
  secondary: "#7A6E63",
  muted: "#B5ADA3",
  primaryDark: "#745a27",
  outlineVariant: "#d0c5b5",
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { handleGetOrderById } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await handleGetOrderById(orderId);

        if (response?.success) {
          setOrder(response.order);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: tokens.surface }}
      >
        <p className="text-xs uppercase tracking-[0.2em]">
          Loading order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: tokens.surface }}
      >
        <h1
          className="text-4xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Order not found
        </h1>

        <Link
          to="/orders"
          className="px-6 py-3 text-xs uppercase tracking-[0.2em]"
          style={{
            backgroundColor: tokens.primaryDark,
            color: "white",
          }}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const items = order.orderItems || [];

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundColor: tokens.surface,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <main className="max-w-6xl mx-auto px-8 lg:px-16 pt-16 lg:pt-24">

        <Link
          to="/orders"
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: tokens.secondary }}
        >
          ← Back to Orders
        </Link>

        <div className="mt-10 mb-12">
          <p
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{ color: tokens.secondary }}
          >
            Order Details
          </p>

          <h1
            className="text-5xl md:text-7xl font-light"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: tokens.onSurface,
            }}
          >
            #{order._id}
          </h1>

          <p
  className="mt-4 text-xs uppercase tracking-[0.15em]"
  style={{ color: tokens.muted }}
>
  {order?._id
    ? new Date(parseInt(order._id.substring(0, 8), 16) * 1000).toLocaleDateString()
    : "No Date"}
</p>
        </div>

        <section
          className="p-8 md:p-12"
          style={{ backgroundColor: tokens.surfaceLow }}
        >
          <div className="flex justify-between items-center pb-6 border-b"
            style={{ borderColor: tokens.outlineVariant }}
          >
            <h2
              className="text-2xl"
              style={{
                color: "#5a7a5a",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Order Summary
            </h2>

            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "#5a7a5a" }}
            >
              {order.status || "Paid"}
            </span>
          </div>

          <div className="mt-8 space-y-8">
            {items.map((item, index) => (
              <div
                key={item._id || index}
                className="flex gap-6 items-center"
              >
                <div className="w-24 h-28 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="mt-1 text-xs uppercase tracking-[0.15em]"
                    style={{ color: tokens.secondary }}
                  >
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-3">
                    ₹{item.price?.amount ?? item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10 pt-6 border-t"
            style={{ borderColor: tokens.outlineVariant }}
          >
            <div className="flex justify-between">
              <span
                className="text-xs uppercase tracking-[0.15em]"
                style={{ color: tokens.secondary }}
              >
                Total
              </span>

              <span
                className="text-xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: tokens.primaryDark,
                }}
              >
                ₹{order.price?.amount ?? order.total ?? 0}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 flex gap-4">
          <Link
            to="/orders"
            className="px-8 py-4 text-[10px] uppercase tracking-[0.2em]"
            style={{
              backgroundColor: tokens.primaryDark,
              color: "white",
            }}
          >
            View All Orders
          </Link>

          <Link
            to="/"
            className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] border"
            style={{
              borderColor: tokens.outlineVariant,
              color: tokens.onSurface,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;