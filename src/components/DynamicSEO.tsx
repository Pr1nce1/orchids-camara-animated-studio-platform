"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function DynamicSEO() {
  const { siteSettings } = useStore();
  const seo = siteSettings.seo || {
    metaTitle: "CAMARA Studio - Premium Photography & Videography",
    metaDescription: "Premium photography and videography studio capturing life's most precious moments with artistic excellence since 1992.",
    metaKeywords: "photography, videography, wedding photography",
    ogImage: "",
  };

  useEffect(() => {
    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMetaTag("description", seo.metaDescription);
    updateMetaTag("keywords", seo.metaKeywords);
    updateMetaTag("og:title", seo.metaTitle, true);
    updateMetaTag("og:description", seo.metaDescription, true);
    if (seo.ogImage) {
      updateMetaTag("og:image", seo.ogImage, true);
    }
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", seo.metaTitle);
    updateMetaTag("twitter:description", seo.metaDescription);
    if (seo.ogImage) {
      updateMetaTag("twitter:image", seo.ogImage);
    }
  }, [seo]);

  return null;
}
