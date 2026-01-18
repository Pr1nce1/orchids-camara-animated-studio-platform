"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
];

const services = [
  "Wedding Photography",
  "Videography",
  "Pre-Wedding Shoots",
  "Corporate Events",
  "Candid Photography",
];

export function Footer() {
  const { siteSettings } = useStore();

  const socialLinks = [
    { icon: Instagram, href: siteSettings.socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: siteSettings.socialLinks.facebook, label: "Facebook" },
    { icon: Youtube, href: siteSettings.socialLinks.youtube, label: "YouTube" },
    { icon: Twitter, href: siteSettings.socialLinks.twitter, label: "Twitter" },
  ];

  return (
    <footer id="contact" className="bg-[#0A1628] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234FC3F7' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
<div className="flex items-center gap-2 mb-6">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/43991574-efa5-4c8e-b846-1cc07a4d6543/ColorLogo-1768739515083.png?width=8000&height=8000&resize=contain"
                  alt={siteSettings.siteName}
                  width={160}
                  height={64}
                  className="h-16 w-auto object-contain brightness-0 invert"
                />
              </div>
            <p className="text-[#90A4AE] leading-relaxed mb-6">
              Premium photography and videography studio capturing life&apos;s most precious moments with artistic excellence since 1992.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-display text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#4FC3F7] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-display text-xl font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors flex items-center gap-2 group cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-[#FFB300] rounded-full" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-display text-xl font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4FC3F7] flex-shrink-0 mt-0.5" />
                <span className="text-[#90A4AE]">
                  {siteSettings.address.split(",").map((part, i) => (
                    <span key={i}>
                      {part.trim()}
                      {i < siteSettings.address.split(",").length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4FC3F7] flex-shrink-0" />
                <a href={`tel:${siteSettings.contactPhone.replace(/\s/g, "")}`} className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors">
                  {siteSettings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4FC3F7] flex-shrink-0" />
                <a href={`mailto:${siteSettings.contactEmail}`} className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors">
                  {siteSettings.contactEmail}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#90A4AE] text-sm">
              © {new Date().getFullYear()} {siteSettings.siteName} Studio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[#90A4AE] hover:text-[#4FC3F7] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-[#4FC3F7] via-[#FFB300] to-[#4FC3F7]" />
    </footer>
  );
}
