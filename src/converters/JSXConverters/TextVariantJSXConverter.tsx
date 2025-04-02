// src/converters/JSXConverters/TextVariantJSXConverter.tsx
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

// Extended CSS Properties that properly support custom properties and media queries
type ExtendedCSSProperties = React.CSSProperties &
  Record<`--${string}`, string> & {
    cssText?: string;
  };
export const TextVariantJSXConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }: { node: SerializedTextNode }) => {
    // Extract all styles and properties
    const styles: ExtendedCSSProperties = {};
    const customProps: Record<string, string> = {};

    if (node.style) {
      // Extract standard styles
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

      // Extract responsive styles
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

      // Extract data variant attribute
      match = /(?:^|;)\s?data-variant: ([^;]+)/.exec(node.style);
      if (match) customProps["data-variant"] = match[1];
    }

    // Create text content with appropriate formatting
    let textContent: React.ReactNode = node.text;

    // Apply formatting transforms in the correct order
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

    // Determine if this is a variant with responsive styles
    const hasResponsiveStyles =
      styles["--mobile-font-size"] || styles["--tablet-font-size"] || styles["--desktop-font-size"];

    // Only wrap with styled span if necessary
    if (Object.keys(styles).length > 0 || Object.keys(customProps).length > 0) {
      if (hasResponsiveStyles) {
        // Add responsive style class to enable media queries
        return (
          <span
            className="typography-variant-text"
            data-has-responsive-typography="true"
            style={styles}
            {...customProps}
          >
            {textContent}
          </span>
        );
      } else {
        // Regular styling without responsive features
        return (
          <span style={styles} {...customProps}>
            {textContent}
          </span>
        );
      }
    }

    // Return just the formatted content if no styles needed
    return textContent;
  },
};
