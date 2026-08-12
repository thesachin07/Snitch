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
    <nav className="relative z-50 bg-[#fbf9f6] border-b border-[#e4e2df]">
      <div className="h-20 px-6 sm:px-8 lg:px-16 xl:px-24 flex items-center justify-between">

        {/* LEFT NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/products?category=men"
            className="text-[10px] uppercase tracking-[0.2em] font-medium
            text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
          >
            Men
          </Link>

          <Link
            to="/products?category=women"
            className="text-[10px] uppercase tracking-[0.2em] font-medium
            text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
          >
            Women
          </Link>

          <Link
            to="/products?sort=new"
            className="text-[10px] uppercase tracking-[0.2em] font-medium
            text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
          >
            New In
          </Link>
        </div>

        {/* LOGO */}
        <Link
          to="/"
          className="
            absolute left-1/2 -translate-x-1/2
            text-lg sm:text-xl
            tracking-[0.35em]
            font-medium
            text-[#1b1c1a]
            hover:opacity-70
            transition-opacity
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          SNITCH.
        </Link>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-5">

          {/* SEARCH */}
          <button
            type="button"
            aria-label="Search"
            className="text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>

          {/* USER */}
          {user ? (
            <div ref={profileRef} className="relative">

              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-expanded={isProfileOpen}
                aria-label="Account"
                className="text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
                </svg>
              </button>

              {/* PROFILE DROPDOWN */}
              <div
                className={`
                  absolute right-0 top-full pt-3 z-50
                  transition-all duration-200
                  ${
                    isProfileOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                `}
              >
                <div className="
                  w-[210px]
                  rounded-xl
                  border border-[#e4e2df]
                  bg-white
                  shadow-[0_16px_40px_rgba(0,0,0,0.08)]
                  p-5
                ">

                  <div className="pb-4 border-b border-[#e4e2df]">
                    <p className="text-sm font-medium text-[#1b1c1a]">
                      Hello {user.fullname}
                    </p>

                    <p className="mt-1 text-xs text-[#7A6E63]">
                      {user.contact || user.mobile || ""}
                    </p>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="
                      block mt-4 rounded-lg px-4 py-3
                      text-[10px] uppercase tracking-[0.15em]
                      text-[#1b1c1a]
                      hover:bg-[#f5f3f0]
                      transition-colors
                    "
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
                    className="
                      block mt-1 w-full text-left
                      rounded-lg px-4 py-3
                      text-[10px] uppercase tracking-[0.15em]
                      text-[#1b1c1a]
                      hover:bg-[#f5f3f0]
                      transition-colors
                    "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-[10px] uppercase tracking-[0.2em]
                text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="hidden sm:block text-[10px] uppercase tracking-[0.2em]
                text-[#7A6E63] hover:text-[#1b1c1a]"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* SELLER */}
          {user?.role === "seller" && (
            <Link
              to="/seller/dashboard"
              className="hidden lg:block text-[10px] uppercase tracking-[0.15em]
              text-[#7A6E63] hover:text-[#1b1c1a]"
            >
              Seller
            </Link>
          )}

          {/* CART */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative text-[#7A6E63] hover:text-[#1b1c1a] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {cartItems?.length > 0 && (
              <span
                className="
                  absolute -top-2 -right-2
                  flex items-center justify-center
                  rounded-full bg-[#C9A96E] text-white
                  w-4 h-4 text-[9px] font-semibold
                "
              >
                {cartItems.length > 9 ? "9+" : cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;