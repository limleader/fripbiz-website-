"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "서비스 소개", href: "#services" },
  { label: "프로그램", href: "#services" },
  { label: "프로세스", href: "#process" },
  { label: "문의", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 로고 */}
        <a href="#" className="text-2xl font-bold text-[#FF6B35]">
          Frip<span className="text-[#7C3AED]">Biz</span>
        </a>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#1A1A2E] hover:text-[#FF6B35] font-medium transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA 버튼 */}
        <a
          href="#contact"
          className="bg-[#FF6B35] hover:bg-[#e55a24] text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          견적 문의하기
        </a>
      </div>
    </motion.header>
  );
}
