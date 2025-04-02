import { type HTMLConverter } from "@payloadcms/richtext-lexical";
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  type SerializedTextNode,
} from "@payloadcms/richtext-lexical/lexical";

import escapeHTML from "escape-html";

export const TextVariantHTMLConverter: HTMLConverter<SerializedTextNode> = {
  converter({ node }) {
    let styles = "";
    let customAttributes = "";

    if (node.style) {
      // Standard styles
      let match = /(?:^|;)\s?color: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} color: ${match[1]};`;
      }

      match = /(?:^|;)\s?font-size: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} font-size: ${match[1]};`;
      }

      match = /(?:^|;)\s?letter-spacing: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} letter-spacing: ${match[1]};`;
      }

      match = /(?:^|;)\s?line-height: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} line-height: ${match[1]};`;
      }
      
      match = /(?:^|;)\s?font-family: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} font-family: ${match[1]};`;
      }

      // Responsive styles as CSS custom properties
      match = /(?:^|;)\s?--mobile-font-size: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --mobile-font-size: ${match[1]};`;
      }

      match = /(?:^|;)\s?--mobile-line-height: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --mobile-line-height: ${match[1]};`;
      }

      match = /(?:^|;)\s?--tablet-font-size: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --tablet-font-size: ${match[1]};`;
      }

      match = /(?:^|;)\s?--tablet-line-height: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --tablet-line-height: ${match[1]};`;
      }

      match = /(?:^|;)\s?--desktop-font-size: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --desktop-font-size: ${match[1]};`;
      }

      match = /(?:^|;)\s?--desktop-line-height: ([^;]+)/.exec(node.style);
      if (match) {
        styles = `${styles} --desktop-line-height: ${match[1]};`;
      }

      // Data attribute for the variant name
      match = /(?:^|;)\s?data-variant: ([^;]+)/.exec(node.style);
      if (match && match[1]) {
        customAttributes = ` data-variant="${match[1]}"`;
      }
    }

    // Add responsive styling with media queries
    if (styles.includes('--mobile-font-size') || styles.includes('--tablet-font-size')) {
      styles = `${styles}
        @media (max-width: 767px) {
          font-size: var(--mobile-font-size) !important;
          line-height: var(--mobile-line-height) !important;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          font-size: var(--tablet-font-size) !important;
          line-height: var(--tablet-line-height) !important;
        }
      `;
    }

    const styleAttr = styles ? ` style="${styles}"` : "";

    let html = escapeHTML(node.text);
    if (!html) {
      return "";
    }

    const formatters: Record<number, (content: string, styleAttribute: string) => string> = {
      [IS_BOLD]: (content) => `<strong>${content}</strong>`,
      [IS_ITALIC]: (content) => `<em>${content}</em>`,
      [IS_STRIKETHROUGH]: (content) => {
        return `<span style="text-decoration: line-through">${content}</span>`;
      },
      [IS_UNDERLINE]: (content) => {
        return `<span style="text-decoration: underline">${content}</span>`;
      },
      [IS_CODE]: (content) => `<code>${content}</code>`,
      [IS_SUBSCRIPT]: (content) => `<sub>${content}</sub>`,
      [IS_SUPERSCRIPT]: (content) => `<sup>${content}</sup>`,
    };

    html = styles || customAttributes 
      ? `<span${styleAttr}${customAttributes}>${html}</span>` 
      : html;

    Object.entries(formatters).forEach(([formatFlag, formatter]) => {
      if (node.format & Number(formatFlag)) {
        html = formatter(html, styleAttr);
      }
    });

    return html;
  },
  nodeTypes: ["text"],
};
