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
import { type JSXConverters } from "@payloadcms/richtext-lexical/react";

// Extended CSS Properties that support custom properties
type ExtendedCSSProperties = React.CSSProperties & {
  [key: `--${string}`]: string;
  cssText?: string;
};

export const TextVariantJSXConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }: { node: SerializedTextNode }) => {
    const styles: ExtendedCSSProperties = {};
    const customProps: Record<string, string> = {};

    if (node.style) {
      // Standard styles
      let match = /(?:^|;)\s?color: ([^;]+)/.exec(node.style);
      if (match) styles.color = match[1];

      match = /(?:^|;)\s?font-size: ([^;]+)/.exec(node.style);
      if (match) styles.fontSize = match[1];

      match = /(?:^|;)\s?letter-spacing: ([^;]+)/.exec(node.style);
      if (match) styles.letterSpacing = match[1];

      match = /(?:^|;)\s?line-height: ([^;]+)/.exec(node.style);
      if (match) styles.lineHeight = match[1];

      match = /(?:^|;)\s?font-family: ([^;]+)/.exec(node.style);
      if (match) styles.fontFamily = match[1];

      // Responsive styles as CSS custom properties
      match = /(?:^|;)\s?--mobile-font-size: ([^;]+)/.exec(node.style);
      if (match) styles["--mobile-font-size"] = match[1];

      match = /(?:^|;)\s?--mobile-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--mobile-line-height"] = match[1];

      match = /(?:^|;)\s?--tablet-font-size: ([^;]+)/.exec(node.style);
      if (match) styles["--tablet-font-size"] = match[1];

      match = /(?:^|;)\s?--tablet-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--tablet-line-height"] = match[1];

      match = /(?:^|;)\s?--desktop-font-size: ([^;]+)/.exec(node.style);
      if (match) styles["--desktop-font-size"] = match[1];

      match = /(?:^|;)\s?--desktop-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--desktop-line-height"] = match[1];

      // Data attribute for variant
      match = /(?:^|;)\s?data-variant: ([^;]+)/.exec(node.style);
      if (match) customProps["data-variant"] = match[1];
    }

    // Add the custom CSS for responsive behavior
    if (styles["--mobile-font-size"] || styles["--tablet-font-size"]) {
      styles.cssText = `
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

    // Apply formatters to the text content first
    let textContent: React.ReactNode = node.text;

    // Create the formatted content without styling
    if (node.format) {
      if (node.format & IS_BOLD) {
        textContent = <strong>{textContent}</strong>;
      }
      if (node.format & IS_ITALIC) {
        textContent = <em>{textContent}</em>;
      }
      if (node.format & IS_STRIKETHROUGH) {
        textContent = <span style={{ textDecoration: "line-through" }}>{textContent}</span>;
      }
      if (node.format & IS_UNDERLINE) {
        textContent = <span style={{ textDecoration: "underline" }}>{textContent}</span>;
      }
      if (node.format & IS_CODE) {
        textContent = <code>{textContent}</code>;
      }
      if (node.format & IS_SUBSCRIPT) {
        textContent = <sub>{textContent}</sub>;
      }
      if (node.format & IS_SUPERSCRIPT) {
        textContent = <sup>{textContent}</sup>;
      }
    }

    // Only wrap in a styled span if we have styles or custom props
    if (Object.keys(styles).length > 0 || Object.keys(customProps).length > 0) {
      return (
        <span style={styles as React.CSSProperties} {...customProps}>
          {textContent}
        </span>
      );
    }

    // Otherwise just return the formatted content
    return textContent;
  },
};
