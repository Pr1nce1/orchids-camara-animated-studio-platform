"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Phone, Mail, MapPin, Globe, Instagram, Facebook, Youtube, Twitter, Search, FileText } from "lucide-react";
import { useStore, SiteSettings } from "@/lib/store";

const defaultSeo = {
  metaTitle: "CAMARA Studio - Premium Photography & Videography",
  metaDescription: "Premium photography and videography studio capturing life's most precious moments with artistic excellence since 1992.",
  metaKeywords: "photography, videography, wedding photography, pre-wedding shoots, candid photography, corporate events",
  ogImage: "",
};

export default function SettingsPage() {
  const { siteSettings, setSiteSettings } = useStore();
  const [settings, setSettings] = useState<SiteSettings>({
    ...siteSettings,
    whatsappNumber: siteSettings.whatsappNumber || "+919845374999",
    seo: siteSettings.seo || defaultSeo,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings({
      ...siteSettings,
      whatsappNumber: siteSettings.whatsappNumber || "+919845374999",
      seo: siteSettings.seo || defaultSeo,
    });
  }, [siteSettings]);

  const handleSave = () => {
    setSaving(true);
    setSiteSettings(settings);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  const updateSettings = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const updateSeo = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#01579B]">Settings</h1>
          <p className="text-[#607D8B] mt-1">Configure your website settings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white rounded-xl font-medium shadow-lg shadow-[#0288D1]/20 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#0288D1]" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#263238]">Contact Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSettings("contactEmail", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="hello@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => updateSettings("contactPhone", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => updateSettings("whatsappNumber", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="+919876543210"
              />
              <p className="text-xs text-[#90A4AE] mt-1">Include country code without spaces (e.g., +919876543210)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => updateSettings("address", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all resize-none"
                placeholder="Your studio address"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FCE4EC] rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#E91E63]" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#263238]">Social Links</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Instagram className="w-4 h-4 inline mr-2" />
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Facebook className="w-4 h-4 inline mr-2" />
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Youtube className="w-4 h-4 inline mr-2" />
                YouTube
              </label>
              <input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) => updateSocialLink("youtube", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <Twitter className="w-4 h-4 inline mr-2" />
                Twitter / X
              </label>
              <input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E0E0]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#263238]">SEO Settings</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Meta Title
              </label>
              <input
                type="text"
                value={settings.seo.metaTitle}
                onChange={(e) => updateSeo("metaTitle", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="Your Website Title"
              />
              <p className="text-xs text-[#90A4AE] mt-1">{settings.seo.metaTitle.length}/60 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                Meta Description
              </label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => updateSeo("metaDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all resize-none"
                placeholder="Brief description of your website"
              />
              <p className="text-xs text-[#90A4AE] mt-1">{settings.seo.metaDescription.length}/160 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={settings.seo.metaKeywords}
                onChange={(e) => updateSeo("metaKeywords", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-[#90A4AE] mt-1">Separate keywords with commas</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#607D8B] mb-2">
                OG Image URL
              </label>
              <input
                type="url"
                value={settings.seo.ogImage}
                onChange={(e) => updateSeo("ogImage", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none transition-all"
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-xs text-[#90A4AE] mt-1">Image shown when your site is shared on social media (1200x630px recommended)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
