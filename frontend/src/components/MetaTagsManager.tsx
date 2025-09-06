import React from 'react';
import { useMetaTags } from '../hooks/useMetaTags';

interface MetaTagsManagerProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  telegramChannel?: string;
}

export const MetaTagsManager: React.FC<MetaTagsManagerProps> = (props) => {
  useMetaTags(props);
  return null; // Цей компонент не рендерить нічого
};