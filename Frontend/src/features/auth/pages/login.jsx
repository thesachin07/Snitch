import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { toast } from "sonner";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await handleLogin({
        email: formData.email,
        password: formData.password,
      });

      if (!result?.success) {
        toast.error("Login failed. Please try again.");
        return;
      }

      toast.success("Signed in successfully");

      const user = result?.data?.user;

      if (user?.role === "buyer") {
        navigate("/");
      } else if (user?.role === "seller") {
        navigate("/seller/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 sm:p-6 selection:bg-[#C9A96E]/30"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
        onClick={() => navigate(-1)}
      >
        <div
          className="relative flex w-full max-w-5xl max-h-[calc(100vh-1.5rem)] flex-col overflow-y-auto rounded-xl shadow-2xl sm:max-h-[calc(100vh-3rem)] lg:h-[min(90vh,800px)] lg:max-h-[calc(100vh-3rem)] lg:overflow-hidden lg:flex-row"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate(-1)}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-[#1b1c1a] shadow-sm transition-colors hover:bg-white"
          >
            ×
          </button>

        <div
          className="relative flex min-h-40 w-full shrink-0 overflow-hidden lg:h-full lg:min-h-0 lg:w-[46%]"
          style={{ backgroundColor: "#f5f3f0" }}
        >
          <img
            src="\Banner.png"
            alt="Snitch Fashion Editorial"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.97)" }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(27,24,20,0.62) 0%, rgba(27,24,20,0.08) 45%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 p-14 flex flex-col justify-between z-10">
            Snitch
            <span
              className="text-sm font-medium tracking-[0.35em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
                letterSpacing: "0.35em",
              }}
            >
              Snitch.
            </span>
            <div>
              <p
                className="text-5xl xl:text-6xl font-light leading-[1.08] text-white mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Welcome
                <br />
                <em>back.</em>
              </p>
              <p
                className="text-sm font-light leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Sign in to explore the latest exclusive drops and manage your
                aesthetic.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex w-full items-start justify-center overflow-y-auto px-8 py-12 sm:px-14 sm:py-16 lg:h-full lg:w-[54%] lg:px-16"
          style={{ backgroundColor: "#fbf9f6" }}
        >
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-14">
              <span
                className="text-sm tracking-[0.35em] uppercase"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#C9A96E",
                }}
              >
                Snitch.
              </span>
            </div>

            <div className="mb-14">
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4 font-medium"
                style={{ color: "#C9A96E" }}
              >
                Sign in to Snitch
              </p>
              <h1
                className="text-[2.6rem] xl:text-5xl font-light leading-[1.1]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1b1c1a",
                }}
              >
                Enter the Vault
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-email"
                  className="text-[10px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: "#7A6E63" }}
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={{
                    color: "#1b1c1a",
                    borderBottom: "1px solid #d0c5b5",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "#C9A96E")
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = "#d0c5b5")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-[10px] uppercase tracking-[0.18em] font-medium"
                    style={{ color: "#7A6E63" }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] transition-colors duration-200"
                    style={{ color: "#B5ADA3" }}
                    onMouseEnter={(e) => (e.target.style.color = "#C9A96E")}
                    onMouseLeave={(e) => (e.target.style.color = "#B5ADA3")}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300"
                  style={{
                    color: "#1b1c1a",
                    borderBottom: "1px solid #d0c5b5",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "#C9A96E")
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = "#d0c5b5")}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 mt-2"
                style={{
                  backgroundColor: "#1b1c1a",
                  color: "#fbf9f6",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#C9A96E";
                  e.currentTarget.style.color = "#1b1c1a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1b1c1a";
                  e.currentTarget.style.color = "#fbf9f6";
                }}
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "#B5ADA3" }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
              </div>

              <ContinueWithGoogle />

              <p
                className="text-center text-[11px]"
                style={{ color: "#B5ADA3" }}
              >
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="transition-colors duration-200"
                  style={{
                    color: "#7A6E63",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#C9A96E")}
                  onMouseLeave={(e) => (e.target.style.color = "#7A6E63")}
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;
