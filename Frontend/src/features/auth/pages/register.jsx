import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';


export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    isSeller: false,
  });

  const [success, setSuccess] = useState(false);
  const { loading, error, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({
      fullname: formData.fullName,
      email: formData.email,
      contact: formData.phone,
      password: formData.password,
      isSeller: formData.isSeller,
    });

    if (result.success) {
      setSuccess(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:grid lg:grid-cols-12 font-sans antialiased select-none">

      {/* LEFT COLUMN: BRAND SHOWCASE (Desktop only) */}
      <section className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Zoom on Hover */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/men_fashion_banner.png"
            alt="Snitch Fashion Showcase"
            className="w-full h-full object-cover object-center opacity-40 transition-transform duration-10000 ease-out scale-105 hover:scale-100"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-[#0A0A0A] z-10" />
        </div>

        {/* Top Branding */}
        <div className="relative z-20 flex items-center gap-3">
          <span className="text-[26px] font-black tracking-[0.25em] text-[#FFD700] drop-shadow-md">
            SNITCH
          </span>
        </div>

        {/* Centered Dynamic Content based on isSeller */}
        <div className="relative z-20 my-auto max-w-[380px] space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">
              {formData.isSeller ? 'Seller Network' : 'Exclusive Access'}
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-[36px] font-bold leading-tight tracking-tight text-white transition-all duration-500">
              {formData.isSeller ? (
                <>Scale Your<br />Fashion Business</>
              ) : (
                <>Unlimit Your<br />Style Persona</>
              )}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed transition-all duration-500">
              {formData.isSeller ? (
                "Join India's fastest-growing trend-first fashion marketplace. Access millions of customers, enjoy fast payouts, and build your digital storefront."
              ) : (
                "Step into the future of streetwear. Register today to receive first access to weekly drops, members-only pricing, and personalized collections."
              )}
            </p>
          </div>

          {/* Interactive features list */}
          <ul className="space-y-3 pt-4 border-t border-white/10">
            {formData.isSeller ? (
              <>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6w-3m3-3h3m2 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Fast Setup & Cataloging Assistance</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Millions of Daily Active Buyers</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secured Logistics & Settlements</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Early Access to Drops & Collections</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Shipping on all Pre-paid Orders</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-neutral-300">
                  <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hassle-Free 7-Day Returns & Exchanges</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Footer info (Left Panel) */}
        <div className="relative z-20 flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-widest">
          <span>&copy; Snitch Squad {new Date().getFullYear()}</span>
          <span>Crafted for Trends</span>
        </div>
      </section>

      {/* RIGHT COLUMN: REGISTRATION FORM */}
      <section className="lg:col-span-7 flex flex-col justify-between min-h-screen">

        {/* Top Header/Navbar - Hidden on Desktop, Visible on Mobile */}
        <header className="w-full border-b border-[#1A1A1A] lg:border-0 bg-[#0A0A0A]/85 backdrop-blur-md sticky top-0 z-50 lg:relative lg:bg-transparent lg:backdrop-blur-none">
          <div className="max-w-[1200px] mx-auto px-6 h-20 flex justify-between items-center lg:h-24 lg:px-12">
            <span className="text-[22px] font-bold tracking-widest text-[#FFD700] lg:hidden">
              SNITCH
            </span>
            <span className="text-[12px] font-semibold tracking-[0.2em] text-neutral-400 uppercase hidden lg:inline">
              Create Account
            </span>
          </div>
        </header>

        {/* Main Content Form Area */}
        <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-16">
          <div className="w-full max-w-[440px] space-y-8">

            {success ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-[#FFD700]/10 border border-[#FFD700] rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-[24px] font-medium tracking-tight text-white">Registration Successful!</h2>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Welcome to Snitch. Your account has been successfully created. {formData.isSeller && "You have registered as an authorized Seller."}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest bg-[#FFD700] text-black hover:bg-[#FFE16D] transition-all duration-200 active:scale-95"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="text-left space-y-2">
                  <h1 className="text-[28px] font-semibold tracking-tight text-white">
                    {formData.isSeller ? 'Partner with Snitch' : 'Join the Snitch Squad'}
                  </h1>
                  <p className="text-[14px] text-neutral-400 leading-relaxed">
                    {formData.isSeller
                      ? 'Create your merchant account and access our backend dashboard.'
                      : 'Create your account to unlock early drops and premium benefits.'
                    }
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm transition-all duration-200">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full bg-[#121212] border border-[#262626] text-white rounded-lg px-5 py-4 text-sm placeholder-neutral-600 focus:border-[#FFD700] focus:bg-[#151515] focus:ring-1 focus:ring-[#FFD700] focus:outline-none transition-all duration-200 ease-in-out"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-[#121212] border border-[#262626] text-white rounded-lg px-5 py-4 text-sm placeholder-neutral-600 focus:border-[#FFD700] focus:bg-[#151515] focus:ring-1 focus:ring-[#FFD700] focus:outline-none transition-all duration-200 ease-in-out"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase" htmlFor="phone">
                      Contact Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9999999999"
                      className="w-full bg-[#121212] border border-[#262626] text-white rounded-lg px-5 py-4 text-sm placeholder-neutral-600 focus:border-[#FFD700] focus:bg-[#151515] focus:ring-1 focus:ring-[#FFD700] focus:outline-none transition-all duration-200 ease-in-out"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-[#121212] border border-[#262626] text-white rounded-lg px-5 py-4 text-sm placeholder-neutral-600 focus:border-[#FFD700] focus:bg-[#151515] focus:ring-1 focus:ring-[#FFD700] focus:outline-none transition-all duration-200 ease-in-out"
                    />
                  </div>

                  {/* Register as Seller Checkbox */}
                  <div className="flex items-center pt-2">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        id="isSeller"
                        name="isSeller"
                        type="checkbox"
                        checked={formData.isSeller}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 bg-[#121212] border border-[#262626] rounded-md peer-checked:bg-[#FFD700] peer-checked:border-[#FFD700] flex items-center justify-center transition-all duration-200">
                        {formData.isSeller && (
                          <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-3 text-[14px] text-neutral-300 hover:text-white transition-colors duration-200 select-none">
                        Register as Seller
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#FFD700] text-black py-4 px-6 rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-[#FFE16D] transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        'Create Account'
                      )}
                    </button>

<ContinueWithGoogle />
                    <p className="text-center text-[13px] text-neutral-400 mt-2">
    Already have an account?{' '}
   
    <button 
      type="button"
      onClick={() => {
      navigate('/login')
      }}
      className="text-[#FFD700] hover:text-[#FFE16D] transition-colors duration-200 underline underline-offset-4 font-medium focus:outline-none"
    >
      Sign in
    </button>
  </p>
  
                  </div>
                </form>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-[#1A1A1A] py-6 bg-[#0A0A0A] lg:px-12">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <span>&copy; {new Date().getFullYear()} Snitch. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#FFD700] transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-[#FFD700] transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-[#FFD700] transition-colors duration-200">Support</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

