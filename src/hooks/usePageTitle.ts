// src/hooks/usePageTitle.ts
import { useEffect } from "react";

interface SEOOptions {
  title?: string;
  description?: string;
}

export function usePageTitle({ title, description }: SEOOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');

      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);
}