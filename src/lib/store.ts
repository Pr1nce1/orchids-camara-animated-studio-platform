import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Statistic {
  id: string;
  icon: string;
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  color: string;
  order: number;
  enabled: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: "photo" | "video";
  category: string[];
  mediaUrl: string;
  thumbnailUrl: string;
  description: string;
  clientName: string;
  location: string;
  dateTaken: string;
  photographer: string;
  featured: boolean;
  status: "published" | "draft";
  duration?: string;
  videoSource?: "uploaded" | "youtube";
  youtubeUrl?: string;
  createdAt: string;
}

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  thumbnail: string;
  description: string;
  category: string;
  duration: string;
  order: number;
  enabled: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientRole: string;
  clientPhoto: string;
  rating: number;
  reviewText: string;
  eventType: string;
  eventDate: string;
  videoUrl: string;
  featured: boolean;
  status: "published" | "draft";
  order: number;
  createdAt: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  color: string;
  order: number;
  enabled: boolean;
}

export interface HeroSettings {
  title: string;
  tagline: string[];
  backgroundImages: string[];
  animationStyle: string;
  animationSpeed: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
  };
}

interface AdminState {
  isAuthenticated: boolean;
  adminUser: { email: string; name: string } | null;
}

interface StoreState {
  statistics: Statistic[];
  portfolio: PortfolioItem[];
  youtubeVideos: YouTubeVideo[];
  reviews: Review[];
  services: Service[];
  heroSettings: HeroSettings;
  siteSettings: SiteSettings;
  admin: AdminState;

  setStatistics: (stats: Statistic[]) => void;
  addStatistic: (stat: Statistic) => void;
  updateStatistic: (id: string, stat: Partial<Statistic>) => void;
  deleteStatistic: (id: string) => void;

  setPortfolio: (items: PortfolioItem[]) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  setYoutubeVideos: (videos: YouTubeVideo[]) => void;
  addYoutubeVideo: (video: YouTubeVideo) => void;
  updateYoutubeVideo: (id: string, video: Partial<YouTubeVideo>) => void;
  deleteYoutubeVideo: (id: string) => void;

  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  setHeroSettings: (settings: HeroSettings) => void;
  setSiteSettings: (settings: SiteSettings) => void;

  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const defaultStatistics: Statistic[] = [
  { id: "1", icon: "Trophy", label: "Years of Experience", value: 32, suffix: "+", prefix: "", color: "#FFB300", order: 1, enabled: true },
  { id: "2", icon: "Heart", label: "Happy Clients", value: 1000, suffix: "+", prefix: "", color: "#EF5350", order: 2, enabled: true },
  { id: "3", icon: "PartyPopper", label: "Events Covered", value: 5000, suffix: "+", prefix: "", color: "#4FC3F7", order: 3, enabled: true },
  { id: "4", icon: "Globe", label: "Cities Served", value: 50, suffix: "+", prefix: "", color: "#66BB6A", order: 4, enabled: true },
  { id: "5", icon: "Star", label: "Client Satisfaction", value: 100, suffix: "%", prefix: "", color: "#FFB300", order: 5, enabled: true },
];

const defaultPortfolio: PortfolioItem[] = [
  {
    id: "p1", title: "Sarah & Michael's Wedding", type: "video", category: ["Wedding"], 
    mediaUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    description: "A beautiful beach wedding ceremony", clientName: "Sarah & Michael", location: "Goa, India",
    dateTaken: "2024-02-15", photographer: "CAMARA Team", featured: true, status: "published",
    duration: "4:32", videoSource: "youtube", youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", createdAt: new Date().toISOString()
  },
  {
    id: "p2", title: "Beachside Romance", type: "photo", category: ["Pre-Wedding"],
    mediaUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    description: "Pre-wedding shoot at sunset beach", clientName: "Priya & Rahul", location: "Kerala, India",
    dateTaken: "2024-01-20", photographer: "CAMARA Team", featured: true, status: "published",
    createdAt: new Date().toISOString()
  },
  {
    id: "p3", title: "Corporate Annual Meet", type: "video", category: ["Corporate"],
    mediaUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    description: "Annual corporate event coverage", clientName: "Tech Corp", location: "Mumbai, India",
    dateTaken: "2024-03-10", photographer: "CAMARA Team", featured: false, status: "published",
    duration: "5:45", videoSource: "youtube", youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", createdAt: new Date().toISOString()
  },
  {
    id: "p4", title: "Maya's Birthday Bash", type: "photo", category: ["Event"],
    mediaUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    description: "Colorful birthday celebration", clientName: "Maya", location: "Chennai, India",
    dateTaken: "2024-02-28", photographer: "CAMARA Team", featured: false, status: "published",
    createdAt: new Date().toISOString()
  },
  {
    id: "p5", title: "Garden Wedding Ceremony", type: "video", category: ["Wedding"],
    mediaUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    description: "Elegant garden wedding", clientName: "Anita & Vikram", location: "Bangalore, India",
    dateTaken: "2024-01-15", photographer: "CAMARA Team", featured: true, status: "published",
    duration: "6:12", videoSource: "youtube", youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", createdAt: new Date().toISOString()
  },
  {
    id: "p6", title: "Candid Love Story", type: "photo", category: ["Candid"],
    mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    description: "Natural moments captured beautifully", clientName: "Sneha & Arjun", location: "Delhi, India",
    dateTaken: "2024-03-05", photographer: "CAMARA Team", featured: false, status: "published",
    createdAt: new Date().toISOString()
  },
];

const defaultYoutubeVideos: YouTubeVideo[] = [
  { id: "yt1", youtubeId: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Royal Wedding Highlights 2024", thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", description: "Complete wedding highlights", category: "Wedding", duration: "8:45", order: 1, enabled: true, createdAt: new Date().toISOString() },
  { id: "yt2", youtubeId: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Pre-Wedding in Mountains", thumbnail: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80", description: "Romantic pre-wedding shoot", category: "Pre-Wedding", duration: "5:30", order: 2, enabled: true, createdAt: new Date().toISOString() },
  { id: "yt3", youtubeId: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Corporate Event Coverage", thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", description: "Professional event documentation", category: "Corporate", duration: "12:20", order: 3, enabled: true, createdAt: new Date().toISOString() },
];

const defaultReviews: Review[] = [
  { id: "r1", clientName: "Priya & Rahul", clientRole: "Wedding Clients", clientPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", rating: 5, reviewText: "CAMARA captured our wedding day so beautifully. Every photo tells a story, and the video makes us cry happy tears every time we watch it. Absolutely magical!", eventType: "Wedding", eventDate: "2024-02-15", videoUrl: "", featured: true, status: "published", order: 1, createdAt: new Date().toISOString() },
  { id: "r2", clientName: "Ananya Sharma", clientRole: "Pre-Wedding Shoot", clientPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", rating: 5, reviewText: "The pre-wedding shoot exceeded all our expectations. The team knew exactly how to make us comfortable, and the photos are straight out of a fairytale!", eventType: "Pre-Wedding", eventDate: "2024-01-20", videoUrl: "", featured: true, status: "published", order: 2, createdAt: new Date().toISOString() },
  { id: "r3", clientName: "Vikram Industries", clientRole: "Corporate Client", clientPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", rating: 5, reviewText: "Professional, punctual, and incredibly talented. Our corporate event coverage was outstanding. We've made them our official photography partner.", eventType: "Corporate", eventDate: "2024-03-10", videoUrl: "", featured: false, status: "published", order: 3, createdAt: new Date().toISOString() },
  { id: "r4", clientName: "Maya & Arjun", clientRole: "Destination Wedding", clientPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", rating: 5, reviewText: "Flying CAMARA to Goa for our beach wedding was the best decision. They captured the sunset ceremony perfectly. Pure artistry!", eventType: "Wedding", eventDate: "2024-01-10", videoUrl: "", featured: false, status: "published", order: 4, createdAt: new Date().toISOString() },
  { id: "r5", clientName: "Neha Kapoor", clientRole: "Birthday Celebration", clientPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", rating: 5, reviewText: "My daughter's first birthday was made even more special with CAMARA's candid photography. They captured pure joy in every frame.", eventType: "Event", eventDate: "2024-02-28", videoUrl: "", featured: false, status: "published", order: 5, createdAt: new Date().toISOString() },
];

const defaultServices: Service[] = [
  { id: "s1", icon: "Heart", title: "Wedding Photography & Videography", description: "Capture every magical moment of your special day with cinematic excellence and timeless elegance.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", color: "#EF5350", order: 1, enabled: true },
  { id: "s2", icon: "Camera", title: "Candid Photography & Videography", description: "Natural, unposed moments that tell your authentic story with artistic vision.", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", color: "#4FC3F7", order: 2, enabled: true },
  { id: "s3", icon: "Users", title: "Pre-Wedding Shoots", description: "Romantic sessions in stunning locations to celebrate your love story before the big day.", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80", color: "#FFB300", order: 3, enabled: true },
  { id: "s4", icon: "PartyPopper", title: "Event Photography & Videography", description: "From birthdays to anniversaries, we capture the energy and joy of every celebration.", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", color: "#66BB6A", order: 4, enabled: true },
  { id: "s5", icon: "Building2", title: "Corporate Photography & Videography", description: "Professional coverage for conferences, product launches, and corporate events.", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80", color: "#7E57C2", order: 5, enabled: true },
];

const defaultHeroSettings: HeroSettings = {
  title: "CAMARA",
  tagline: ["Moments", "to", "Memories"],
  backgroundImages: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=80",
  ],
  animationStyle: "typewriter",
  animationSpeed: "medium",
};

const defaultSiteSettings: SiteSettings = {
  siteName: "CAMARA",
  tagline: "Moments to Memories",
  logoUrl: "",
  contactEmail: "hello@camara.studio",
  contactPhone: "+91 98453 74999",
  whatsappNumber: "+919845374999",
  address: "123 Creative Studio Lane, Mumbai, Maharashtra 400001",
  socialLinks: { instagram: "#", facebook: "#", youtube: "#", twitter: "#" },
  seo: {
    metaTitle: "CAMARA Studio - Premium Photography & Videography",
    metaDescription: "Premium photography and videography studio capturing life's most precious moments with artistic excellence since 1992.",
    metaKeywords: "photography, videography, wedding photography, pre-wedding shoots, candid photography, corporate events",
    ogImage: "",
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      statistics: defaultStatistics,
      portfolio: defaultPortfolio,
      youtubeVideos: defaultYoutubeVideos,
      reviews: defaultReviews,
      services: defaultServices,
      heroSettings: defaultHeroSettings,
      siteSettings: defaultSiteSettings,
      admin: { isAuthenticated: false, adminUser: null },

      setStatistics: (stats) => set({ statistics: stats }),
      addStatistic: (stat) => set((state) => ({ statistics: [...state.statistics, stat] })),
      updateStatistic: (id, stat) => set((state) => ({ statistics: state.statistics.map((s) => (s.id === id ? { ...s, ...stat } : s)) })),
      deleteStatistic: (id) => set((state) => ({ statistics: state.statistics.filter((s) => s.id !== id) })),

      setPortfolio: (items) => set({ portfolio: items }),
      addPortfolioItem: (item) => set((state) => ({ portfolio: [...state.portfolio, item] })),
      updatePortfolioItem: (id, item) => set((state) => ({ portfolio: state.portfolio.map((p) => (p.id === id ? { ...p, ...item } : p)) })),
      deletePortfolioItem: (id) => set((state) => ({ portfolio: state.portfolio.filter((p) => p.id !== id) })),

      setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
      addYoutubeVideo: (video) => set((state) => ({ youtubeVideos: [...state.youtubeVideos, video] })),
      updateYoutubeVideo: (id, video) => set((state) => ({ youtubeVideos: state.youtubeVideos.map((v) => (v.id === id ? { ...v, ...video } : v)) })),
      deleteYoutubeVideo: (id) => set((state) => ({ youtubeVideos: state.youtubeVideos.filter((v) => v.id !== id) })),

      setReviews: (reviews) => set({ reviews }),
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      updateReview: (id, review) => set((state) => ({ reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)) })),
      deleteReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      setServices: (services) => set({ services }),
      addService: (service) => set((state) => ({ services: [...state.services, service] })),
      updateService: (id, service) => set((state) => ({ services: state.services.map((s) => (s.id === id ? { ...s, ...service } : s)) })),
      deleteService: (id) => set((state) => ({ services: state.services.filter((s) => s.id !== id) })),

      setHeroSettings: (settings) => set({ heroSettings: settings }),
      setSiteSettings: (settings) => set({ siteSettings: settings }),

      login: (email, password) => {
        if (email === "admin@camara.studio" && password === "admin123") {
          set({ admin: { isAuthenticated: true, adminUser: { email, name: "Admin" } } });
          return true;
        }
        return false;
      },
      logout: () => set({ admin: { isAuthenticated: false, adminUser: null } }),
    }),
    { name: "camara-store" }
  )
);
