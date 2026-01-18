"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Camera, Users, PartyPopper, Building2 } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding Photography & Videography",
    description: "Capture every magical moment of your special day with cinematic excellence and timeless elegance.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    color: "#EF5350",
  },
  {
    icon: Camera,
    title: "Candid Photography & Videography",
    description: "Natural, unposed moments that tell your authentic story with artistic vision.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    color: "#4FC3F7",
  },
  {
    icon: Users,
    title: "Pre-Wedding Shoots",
    description: "Romantic sessions in stunning locations to celebrate your love story before the big day.",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    color: "#FFB300",
  },
  {
    icon: PartyPopper,
    title: "Event Photography & Videography",
    description: "From birthdays to anniversaries, we capture the energy and joy of every celebration.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    color: "#66BB6A",
  },
  {
    icon: Building2,
    title: "Corporate Photography & Videography",
    description: "Professional coverage for conferences, product launches, and corporate events.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80",
    color: "#7E57C2",
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230288D1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-[#0288D1]/10 text-[#0288D1] text-sm font-medium mb-4"
          >
            WHAT WE OFFER
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#01579B] mb-4">
            Our Services
          </h2>
          <p className="text-[#607D8B] text-lg max-w-2xl mx-auto">
            Premium photography and videography services tailored to capture your most precious moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-transparent hover:border-[#0288D1]/20">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: service.color }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-[#01579B] mb-3 group-hover:text-[#0288D1] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#607D8B] leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-[#0288D1] font-medium flex items-center gap-2 group/btn"
                  >
                    Learn More
                    <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                  </motion.button>
                </div>

                <motion.div
                  className="h-1 w-full origin-left"
                  style={{ backgroundColor: service.color }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
