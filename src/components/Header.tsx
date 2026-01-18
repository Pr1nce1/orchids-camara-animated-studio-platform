"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Image, Video, Youtube, LayoutGrid, Phone } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const portfolioSubmenu = [
  { name: "All Portfolio", href: "/portfolio", icon: LayoutGrid },
  { name: "Photos", href: "/portfolio/photos", icon: Image },
  { name: "Videos", href: "/portfolio/videos", icon: Video },
  { name: "YouTube Videos", href: "/portfolio/youtube", icon: Youtube },
];

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Portfolio", href: "/portfolio", hasDropdown: true },
  { name: "Reviews", href: "/#reviews" },
  { name: "Contact", href: "/#contact" },
];

export function Header() {
  const pathname = usePathname();
  const { siteSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );

  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 30px rgba(0, 0, 0, 0.1)"]
  );

  const headerHeight = useTransform(scrollY, [0, 100], ["5rem", "4rem"]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isPortfolioPage = pathname?.startsWith("/portfolio");
  const phoneNumber = siteSettings.contactPhone.replace(/\s/g, "");

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          height: headerHeight,
        }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
<Link href="/">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative"
                  >
                    <NextImage
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43991574-efa5-4c8e-b846-1cc07a4d6543/ColorLogo-1768739515083.png?width=8000&height=8000&resize=contain"
                      alt={siteSettings.siteName}
                      width={140}
                      height={56}
                      className="h-14 w-auto object-contain mix-blend-multiply"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setPortfolioOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setPortfolioOpen(false)}
                >
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        className={`flex items-center gap-1 font-medium transition-colors duration-300 group ${
                          isPortfolioPage ? "text-[#0288D1]" : "text-[#263238] hover:text-[#0288D1]"
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${portfolioOpen ? "rotate-180" : ""}`} />
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0288D1] transition-all duration-300 ${
                          isPortfolioPage ? "w-full" : "w-0 group-hover:w-full"
                        }`} />
                      </button>

                      <AnimatePresence>
                        {portfolioOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E0E0E0] overflow-hidden"
                          >
                            {portfolioSubmenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                                  pathname === subItem.href
                                    ? "bg-[#E3F2FD] text-[#0288D1]"
                                    : "text-[#263238] hover:bg-[#F8F9FA] hover:text-[#0288D1]"
                                }`}
                              >
                                <subItem.icon className="w-5 h-5" />
                                <span className="font-medium">{subItem.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative font-medium transition-colors duration-300 group ${
                        pathname === item.href ? "text-[#0288D1]" : "text-[#263238] hover:text-[#0288D1]"
                      }`}
                    >
                      {item.name}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0288D1] transition-all duration-300 ${
                        pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                      }`} />
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <motion.a
                href={`tel:${phoneNumber}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-full font-medium shadow-lg shadow-[#0288D1]/25 hover:shadow-xl hover:shadow-[#0288D1]/30 transition-shadow flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </motion.a>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#263238]"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl"
            >
              <div className="pt-24 px-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
                          className="flex items-center justify-between w-full py-4 text-lg font-medium text-[#263238] border-b border-gray-100"
                        >
                          {item.name}
                          <ChevronDown className={`w-5 h-5 transition-transform ${mobilePortfolioOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {mobilePortfolioOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-[#F8F9FA] rounded-lg mb-2"
                            >
                              {portfolioSubmenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-[#263238] hover:text-[#0288D1]"
                                >
                                  <subItem.icon className="w-5 h-5" />
                                  <span>{subItem.name}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-4 text-lg font-medium text-[#263238] hover:text-[#0288D1] border-b border-gray-100"
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                
                <motion.a
                  href={`tel:${phoneNumber}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 w-full py-3 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#0288D1]/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
