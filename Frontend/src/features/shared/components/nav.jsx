import React from "react";
import { useNavigate, Link } from "react-router";
import useAppStore from "../../../app/app.store";

const Nav = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const logoutUser = useAppStore((state) => state.logoutUser);
  const cartItems = useAppStore((state) => state.cart.items);

  const token = {
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
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <nav
        className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b"
        style={{ borderColor: "#e4e2df" }}
      >
        <Link
          to="/"
          className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C9A96E",
          }}
        >
          Snitch.
        </Link>
        <div
          className="flex gap-6 items-center text-[10px] uppercase tracking-[0.2em] font-medium"
          style={{ color: "#7A6E63" }}
        >
          {user ? (
            <>
              <div className="relative group font-['Inter',sans-serif]">
                <button
                  type="button"
                  className="flex items-center justify-center text-[#eef2ea] hover:text-[#745a27] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.35"
                    />
                    <path
                      d="M3.75 21C4.35 16.95 7.35 14.25 12 14.25C16.65 14.25 19.65 16.95 20.25 21"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div
                  className="
      absolute right-0 top-full pt-2
      opacity-0 scale-95 pointer-events-none
      group-hover:opacity-100
      group-hover:scale-100
      group-hover:pointer-events-auto
      transition-all duration-200
      z-50
    "
                >
                  <div className=" w-[200px] rounded-xl border border-[#e4e2df] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-5">
                    <div className="pb-4 border-b border-[#e4e2df]">
                      <p className="text-sm font-medium text-[#1b1c1a]">
                        Hello {user.fullname}
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#7A6E63]">
                        {user.contact || user.mobile || ""}
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      className="flex items-center justify-start mt-4 w-full rounded-lg px-4 py-3 text-left whitespace-nowrap text-[11px]
            uppercase tracking-[0.15em] text-[#1b1c1a] hover:bg-[#f5f3f0] hover:text-[#745a27] transition-all duration-200"
                    >
                      View Orders
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        navigate("/login");
                      }}
                      className="flex items-center justify-start mt-1 w-full rounded-lg px-4 py-3 text-left whitespace-nowrap text-[11px]
            uppercase tracking-[0.15em] text-[#1b1c1a] hover:bg-[#f5f3f0] hover:text-[#745a27] transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              {user.role === "seller" && (
                <Link
                  to="/seller/dashboard"
                  className="transition-colors hover:text-[#C9A96E]"
                >
                  Seller Dashboard
                </Link>
              )}
              <Link
                to="/cart"
                className="relative flex items-center hover:opacity-70 transition-opacity"
                style={{ color: "#FAF9F6" }}
                aria-label="Shopping cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartItems?.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                    style={{
                      backgroundColor: "#C9A96E",
                      width: "16px",
                      height: "16px",
                      fontSize: "9px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      letterSpacing: 0,
                    }}
                  >
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition-colors hover:text-[#C9A96E]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="transition-colors hover:text-[#C9A96E]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
