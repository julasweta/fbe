// src/entry-server.tsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App'; // Adjust the import path to your main App component

export function render() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    console.warn('Server render function called in browser environment');
    return '';
  }

  try {
    const html = renderToString(React.createElement(App));
    return html;
  } catch (error) {
    console.error('Error during server-side rendering:', error);
    return '';
  }
}