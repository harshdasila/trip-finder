"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import tripBuddyLogo from "../public/assets/LOGO.png";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  rightContent?: React.ReactNode;
  gradient?: "blue" | "purple" | "green" | "orange" | "teal" | "black";
}

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  backUrl,
  rightContent,
  gradient = "blue",
}: PageHeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const gradientClasses = {
    blue: "from-blue-500 via-blue-600 to-blue-700",
    purple: "from-purple-500 via-purple-600 to-purple-700",
    green: "bg-[#285936]",
    orange: "from-orange-500 via-orange-600 to-orange-700",
    teal: "from-teal-500 via-teal-600 to-teal-700",
    black: "from-gray-800 via-gray-900 to-black",
  };

  const handleBack = () => {
    if (backUrl) router.push(backUrl);
    else router.push("/trips");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  return (
    <header
      className={`bg-gradient-to-r ${gradientClasses[gradient]} rounded-b-xl shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!showBackButton && (
              <div className="w-10 h-10 sm:w-14 sm:h-14">
                <img
                  src={tripBuddyLogo.src}
                  alt="TripBuddy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}

            <div>
              <h1 className="text-xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/80 text-xs sm:text-base mt-0.5 sm:mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="relative flex items-center gap-3 sm:gap-4">
            {rightContent && (
              <div className="hidden xs:flex items-center gap-2 sm:gap-3">
                {rightContent}
              </div>
            )}

            {session?.user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white/30"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-xs sm:text-sm transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
