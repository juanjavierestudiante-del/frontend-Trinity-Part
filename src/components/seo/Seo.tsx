import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  jsonLd?: object | object[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    }
  }, [title, description]);

  useEffect(() => {
    if (!jsonLd) return;
    const data = document.createElement('script');
    data.type = 'application/ld+json';
    data.text = JSON.stringify(jsonLd);
    document.head.appendChild(data);
    return () => {
      document.head.removeChild(data);
    };
  }, [jsonLd]);

  return null;
}
