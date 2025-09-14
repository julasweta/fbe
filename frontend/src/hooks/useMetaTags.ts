// hooks/useMetaTags.ts
import { useEffect } from "react";

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterCard?: string;
  telegramChannel?: string;
}

export const useMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    const {
      title,
      description,
      image,
      url,
      type = "website",
      siteName,
      twitterCard = "summary_large_image",
      telegramChannel,
    } = config;

    // Функція для оновлення або створення meta тегу
    const setMetaTag = (property: string, content: string, isName = false) => {
      if (!content) return;

      const attribute = isName ? "name" : "property";
      const selector = `meta[${attribute}="${property}"]`;

      let metaTag = document.querySelector(selector) as HTMLMetaElement;

      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(attribute, property);
        document.head.appendChild(metaTag);
      }

      metaTag.content = content;
    };

    // Оновлюємо title
    if (title) {
      document.title = title;
    }

    // Основні meta теги
    setMetaTag("description", description || "", true);

    // Open Graph теги (для Telegram, Facebook тощо)
    setMetaTag("og:title", title || "");
    setMetaTag("og:description", description || "");
    setMetaTag("og:image", image || "");
    setMetaTag("og:url", url || window.location.href);
    setMetaTag("og:type", type);

    if (siteName) {
      setMetaTag("og:site_name", siteName);
    }

    // Twitter теги
    setMetaTag("twitter:card", twitterCard, true);
    setMetaTag("twitter:title", title || "", true);
    setMetaTag("twitter:description", description || "", true);
    setMetaTag("twitter:image", image || "", true);

    // Telegram специфічні теги
    if (telegramChannel) {
      setMetaTag("telegram:channel", telegramChannel);
    }
  }, [config]);
};
