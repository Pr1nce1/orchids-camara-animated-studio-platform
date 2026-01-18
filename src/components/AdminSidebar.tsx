"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  LayoutDashboard,
  BarChart3,
  Image,
  Video,
  Youtube,
  Star,
  Palette,
  Briefcase,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: BarChart3, label: "Statistics", href: "/admin/statistics" },
  { icon: Image, label: "Photos", href: "/admin/portfolio/photos" },
  { icon: Video, label: "Videos", href: "/admin/portfolio/videos" },
  { icon: Youtube, label: "YouTube Videos", href: "/admin/youtube" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Palette, label: "Hero Section", href: "/admin/hero" },
  { icon: Briefcase, label: "Services", href: "/admin/services" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, logout } = useStore();

  useEffect(() => {
    if (!admin.isAuthenticated && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [admin.isAuthenticated, router, pathname]);

  if (!admin.isAuthenticated || pathname === "/admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-[#E0E0E0] flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-[#E0E0E0]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0288D1] to-[#4FC3F7] rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#01579B]">CAMARA</h1>
              <p className="text-xs text-[#607D8B]">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#0288D1] text-white"
                      : "text-[#607D8B] hover:bg-[#F8F9FA] hover:text-[#0288D1]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E0E0E0]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-[#B3E5FC] rounded-full flex items-center justify-center text-[#01579B] font-bold">
              {admin.adminUser?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#263238] truncate">{admin.adminUser?.name}</p>
              <p className="text-xs text-[#607D8B] truncate">{admin.adminUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[#EF5350] hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <div className="ml-64" />
    </>
  );
}
