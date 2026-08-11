import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import useAppStore from "../../../app/app.store";

const Nav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
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

  useEffect(() => {
  const handleOutsideClick = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setIsProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

  return (
    <nav
      className="bg-[#fbf9f6] px-8 lg:px-16 xl:px-24 pt-8 pb-6 flex items-center justify-between border-b"
      style={{ borderColor: "#e4e2df" }}
    >
      <Link
        to="/"
        className="text-sm font-bold tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
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
            <div ref={profileRef} className="relative group font-['Inter',sans-serif]">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                // onBlur={() => setIsProfileOpen(false)}
                aria-expanded={isProfileOpen}
                className="flex items-center justify-center text-[#7A6E63] hover:text-[#745a27] transition-colors"
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
                className={`absolute right-0 top-full pt-2 transition-all duration-200 z-50
  ${
    isProfileOpen
      ? "opacity-100 scale-100 pointer-events-auto"
      : "opacity-0 scale-95 pointer-events-none"
  }
  group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
`}
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
                    onClick={async () => {
                      const result = await logoutUser();

                      if (result?.success) {
                        toast.success("You have been logged out");
                        navigate("/login");
                      } else {
                        toast.error("Couldn't log out. Please try again.");
                      }
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
            <Link to="/cart"className="relative flex items-center text-[#7A6E63] hover:text-[#745a27] transition-colors"
                    aria-label="Shopping cart">
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
  );
};

export default Nav;
