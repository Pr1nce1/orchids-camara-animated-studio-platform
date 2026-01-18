"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  Image,
  Video,
  Youtube,
  Star,
  TrendingUp,
  Users,
  Eye,
  Calendar,
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdminDashboard() {
  const { statistics, portfolio, youtubeVideos, reviews } = useStore();

  const photos = portfolio.filter((p) => p.type === "photo");
  const videos = portfolio.filter((p) => p.type === "video");

  const quickStats = [
    { icon: BarChart3, label: "Statistics", value: statistics.length, color: "#0288D1", href: "/admin/statistics" },
    { icon: Image, label: "Photos", value: photos.length, color: "#66BB6A", href: "/admin/portfolio/photos" },
    { icon: Video, label: "Videos", value: videos.length, color: "#7E57C2", href: "/admin/portfolio/videos" },
    { icon: Youtube, label: "YouTube Videos", value: youtubeVideos.length, color: "#EF5350", href: "/admin/youtube" },
    { icon: Star, label: "Reviews", value: reviews.length, color: "#FFB300", href: "/admin/reviews" },
  ];

  const recentActivity = [
    { icon: Image, text: "New photo added to Wedding category", time: "2 hours ago" },
    { icon: Star, text: "New 5-star review from Priya & Rahul", time: "5 hours ago" },
    { icon: Video, text: "Corporate event video published", time: "1 day ago" },
    { icon: Users, text: "Statistics updated: 1000+ Happy Clients", time: "2 days ago" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#01579B]">Dashboard</h1>
        <p className="text-[#607D8B] mt-1">Welcome back! Here&apos;s an overview of your content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-[#E0E0E0]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-bold text-[#263238]">{stat.value}</p>
              <p className="text-[#607D8B] text-sm">{stat.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-[#01579B]">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/portfolio/photos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-[#66BB6A] to-[#81C784] text-white rounded-xl font-medium flex items-center gap-3"
              >
                <Image className="w-5 h-5" />
                Add Photos
              </motion.button>
            </Link>
            <Link href="/admin/portfolio/videos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-[#7E57C2] to-[#9575CD] text-white rounded-xl font-medium flex items-center gap-3"
              >
                <Video className="w-5 h-5" />
                Add Videos
              </motion.button>
            </Link>
            <Link href="/admin/youtube">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-[#EF5350] to-[#E57373] text-white rounded-xl font-medium flex items-center gap-3"
              >
                <Youtube className="w-5 h-5" />
                Add YouTube
              </motion.button>
            </Link>
            <Link href="/admin/reviews">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-[#FFB300] to-[#FFCA28] text-white rounded-xl font-medium flex items-center gap-3"
              >
                <Star className="w-5 h-5" />
                Add Review
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-[#01579B]">Recent Activity</h2>
            <Calendar className="w-5 h-5 text-[#607D8B]" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#B3E5FC] flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-5 h-5 text-[#0288D1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#263238] text-sm">{activity.text}</p>
                  <p className="text-[#90A4AE] text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-[#01579B] to-[#0288D1] rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">View Live Website</h2>
            <p className="text-[#B3E5FC]">See how your changes look on the live website</p>
          </div>
          <Link href="/" target="_blank">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-[#0288D1] rounded-xl font-semibold flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Website
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
