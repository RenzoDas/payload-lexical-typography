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

export const TextVariantJSXConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }: { node: SerializedTextNode }) => {
    const styles: React.CSSProperties = {};
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
      if (match) styles["--mobile-font-size" as any] = match[1];

      match = /(?:^|;)\s?--mobile-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--mobile-line-height" as any] = match[1];

      match = /(?:^|;)\s?--tablet-font-size: ([^;]+)/.exec(node.style);
      if (match) styles["--tablet-font-size" as any] = match[1];

      match = /(?:^|;)\s?--tablet-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--tablet-line-height" as any] = match[1];

      match = /(?:^|;)\s?--desktop-font-size: ([^;]+)/.exec(node.style);
      if (match) styles["--desktop-font-size" as any] = match[1];

      match = /(?:^|;)\s?--desktop-line-height: ([^;]+)/.exec(node.style);
      if (match) styles["--desktop-line-height" as any] = match[1];

      // Data attribute for variant
      match = /(?:^|;)\s?data-variant: ([^;]+)/.exec(node.style);
      if (match && match[1]) customProps["data-variant"] = match[1];
    }

    const formatters: Record<number, (element: React.ReactElement) => React.ReactElement> = {
      [IS_BOLD]: (el) => <strong>{el}</strong>,
      [IS_ITALIC]: (el) => <em>{el}</em>,
      [IS_STRIKETHROUGH]: (el) => <span style={{ textDecoration: "line-through" }}>{el}</span>,
      [IS_UNDERLINE]: (el) => <span style={{ textDecoration: "underline" }}>{el}</span>,
      [IS_CODE]: (el) => <code>{el}</code>,
      [IS_SUBSCRIPT]: (el) => <sub>{el}</sub>,
      [IS_SUPERSCRIPT]: (el) => <sup>{el}</sup>,
    };

    // Add the custom CSS for responsive behavior
    if (styles["--mobile-font-size" as any] || styles["--tablet-font-size" as any]) {
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

    let textElement = <span style={styles} {...customProps}>{node.text}</span>;

    Object.entries(formatters).forEach(([formatFlag, formatter]) => {
      if (node.format & Number(formatFlag)) {
        textElement = formatter(textElement);
      }
    });

    return textElement;
  },
};
