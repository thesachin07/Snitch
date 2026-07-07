import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { loading, error, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({
      email: formData.email,
      password: formData.password,
    });
    
    if (result.success) {
      // Redirect to home page on successful login
      navigate('/');
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

        {/* Centered Dynamic Content */}
        <div className="relative z-20 my-auto max-w-[380px] space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">
              Welcome Back
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-[36px] font-bold leading-tight tracking-tight text-white transition-all duration-500">
              Elevate Your<br />Everyday Look
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed transition-all duration-500">
              Sign in to your exclusive Snitch account. Access your curated collections, track pending drops, and manage your custom style profile.
            </p>
          </div>

          {/* Interactive features list */}
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-3 text-xs text-neutral-300">
              <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Track Orders & Manage Returns Easily</span>
            </li>
            <li className="flex items-center gap-3 text-xs text-neutral-300">
              <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Exclusive Member-Only Discounts & Perks</span>
            </li>
            <li className="flex items-center gap-3 text-xs text-neutral-300">
              <svg className="w-4 h-4 text-[#FFD700] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure, Quick Checkout Experience</span>
            </li>
          </ul>
        </div>

        {/* Footer info (Left Panel) */}
        <div className="relative z-20 flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-widest">
          <span>&copy; Snitch Squad {new Date().getFullYear()}</span>
          <span>Crafted for Trends</span>
        </div>
      </section>

      {/* RIGHT COLUMN: LOGIN FORM */}
      <section className="lg:col-span-7 flex flex-col justify-between min-h-screen">
        
        {/* Top Header/Navbar - Hidden on Desktop, Visible on Mobile */}
        <header className="w-full border-b border-[#1A1A1A] lg:border-0 bg-[#0A0A0A]/85 backdrop-blur-md sticky top-0 z-50 lg:relative lg:bg-transparent lg:backdrop-blur-none">
          <div className="max-w-[1200px] mx-auto px-6 h-20 flex justify-between items-center lg:h-24 lg:px-12">
            <span className="text-[22px] font-bold tracking-widest text-[#FFD700] lg:hidden" onClick={() => navigate('/')}>
              SNITCH
            </span>
            <span className="text-[12px] font-semibold tracking-[0.2em] text-neutral-400 uppercase hidden lg:inline">
              Sign In
            </span>
          </div>
        </header>

        {/* Main Content Form Area */}
        <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-16">
          <div className="w-full max-w-[440px] space-y-8">
            
            <div className="text-left space-y-2">
              <h1 className="text-[28px] font-semibold tracking-tight text-white">
                Sign In to Snitch
              </h1>
              <p className="text-[14px] text-neutral-400 leading-relaxed">
                Enter your registered email and password to access your account.
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

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-semibold text-[#FFD700] hover:text-[#FFE16D] transition-colors duration-200">
                    Forgot Password?
                  </a>
                </div>
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
                    'Sign In'
                  )}
                </button>
              <ContinueWithGoogle/>
                <p className="text-center text-[13px] text-neutral-400 mt-2">
                  Don't have an account?{' '}
                  <span 
                    onClick={() => navigate('/register')}
                    className="text-[#FFD700] hover:text-[#FFE16D] transition-colors duration-200 underline underline-offset-4 font-medium cursor-pointer"
                  >
                    Register
                  </span>
                </p>
              </div>
            </form>
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
