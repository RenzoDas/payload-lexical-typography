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

export const TextHTMLConverter: HTMLConverter<SerializedTextNode> = {
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
      if (match?.[1]) {
        customAttributes = ` data-variant="${match[1]}"`;
      }
    }

    // Add responsive styling with media queries
    if (styles.includes("--mobile-font-size") || styles.includes("--tablet-font-size")) {
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
    const allAttributes = `${styleAttr}${customAttributes}`;

    let html = escapeHTML(node.text);
    if (!html) {
      return "";
    }

    // Apply text formatting while preserving style attributes
    // We'll do this by applying the format flags one by one, outside-in
    // This way we ensure styles are correctly preserved at each level

    // First, create the initial element with all styles
    html = styles || customAttributes ? `<span${allAttributes}>${html}</span>` : html;

    // Now apply formats in a non-destructive way
    if (node.format & IS_BOLD) {
      html = `<strong>${html}</strong>`;
    }

    if (node.format & IS_ITALIC) {
      html = `<em>${html}</em>`;
    }

    if (node.format & IS_STRIKETHROUGH) {
      html = `<span style="text-decoration: line-through">${html}</span>`;
    }

    if (node.format & IS_UNDERLINE) {
      html = `<span style="text-decoration: underline">${html}</span>`;
    }

    if (node.format & IS_CODE) {
      html = `<code>${html}</code>`;
    }

    if (node.format & IS_SUBSCRIPT) {
      html = `<sub>${html}</sub>`;
    }

    if (node.format & IS_SUPERSCRIPT) {
      html = `<sup>${html}</sup>`;
    }

    return html;
  },
  nodeTypes: ["text"],
};
