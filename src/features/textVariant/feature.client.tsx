"use client";

import { type ToolbarGroup, type ToolbarGroupItem } from "@payloadcms/richtext-lexical";
import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { COMMAND_PRIORITY_CRITICAL, type BaseSelection } from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@payloadcms/richtext-lexical/lexical/selection";

import { useEffect } from "react";

import { TEXT_VARIANT_COMMAND } from "./command";
import { TextVariantDropdown } from "./components/TextVariantDropdown";
import { TextVariantIcon } from "./components/TextVariantIcon";
import { type TextVariantFeatureProps } from "./types";

import { getSelection } from "../../utils/getSelection";

export type TextVariantItem = ToolbarGroupItem & {
  command: Record<string, unknown>;
  current: () => string | null;
} & TextVariantFeatureProps;

export const TextVariantClientFeature = createClientFeature<TextVariantFeatureProps, TextVariantItem>(
  ({ props }) => {
    const defaultVariants = props?.variants || [];

    const DropdownComponent: ToolbarGroup = {
      type: "dropdown",
      ChildComponent: TextVariantIcon,
      isEnabled({ selection }: { selection: BaseSelection }) {
        return !!getSelection(selection);
      },
      items: [
        {
          Component: () => {
            const [editor] = useLexicalComposerContext();
            return TextVariantDropdown({
              editor,
              item: {
                command: TEXT_VARIANT_COMMAND,
                current() {
                  // Get the current variant based on data-variant attribute
                  const selection = getSelection();
                  if (!selection) return null;

                  // Use $getSelectionStyleValueForProperty to get the data-variant value
                  return $getSelectionStyleValueForProperty(selection, "data-variant", "");
                },
                variants: defaultVariants,
                hideAttribution: props?.hideAttribution,
                key: "textVariant",
              },
            });
          },
          key: "textVariant",
        },
      ],
      key: "textVariantDropdown",
      order: 70, // Position after other typography features
    };

    return {
      plugins: [
        {
          Component: () => {
            const [editor] = useLexicalComposerContext();

            useEffect(() => {
              return editor.registerCommand(
                TEXT_VARIANT_COMMAND,
                (payload) => {
                  const selectedVariant = payload.variant;

                  editor.update(() => {
                    const selection = getSelection();
                    if (!selection) return;

                    // Find the variant in our list
                    const variantConfig = defaultVariants.find((v) => v.name === selectedVariant);

                    if (!variantConfig) {
                      // Clear styles if no variant selected
                      $patchStyleText(selection, {
                        "font-size": "",
                        "line-height": "",
                        "letter-spacing": "",
                        "font-family": "",
                        color: "",
                        "--mobile-font-size": "",
                        "--mobile-line-height": "",
                        "--tablet-font-size": "",
                        "--tablet-line-height": "",
                        "--desktop-font-size": "",
                        "--desktop-line-height": "",
                        "data-variant": "",
                      });
                      return;
                    }

                    // No need to maintain current styles here as $patchStyleText will preserve
                    // any other styles that are not being explicitly overwritten

                    // Apply desktop styles directly and store responsive values as CSS variables
                    const { mobile, tablet, desktop } = variantConfig;

                    $patchStyleText(selection, {
                      // Base styles (desktop)
                      "font-size": desktop.fontSize,
                      "line-height": desktop.lineHeight,
                      "letter-spacing": desktop.letterSpacing ?? "",
                      "font-family": desktop.fontFamily ?? "",
                      color: desktop.color ?? "",

                      // Responsive styles as CSS variables
                      "--mobile-font-size": mobile.fontSize,
                      "--mobile-line-height": mobile.lineHeight,
                      "--tablet-font-size": tablet.fontSize,
                      "--tablet-line-height": tablet.lineHeight,
                      "--desktop-font-size": desktop.fontSize,
                      "--desktop-line-height": desktop.lineHeight,

                      // Variant identifier
                      "data-variant": selectedVariant,
                    });
                  });
                  return true;
                },
                COMMAND_PRIORITY_CRITICAL,
              );
            }, [editor]);

            return null;
          },
          position: "normal",
        },
      ],
      toolbarFixed: {
        groups: [DropdownComponent],
      },
      toolbarInline: {
        groups: [DropdownComponent],
      },
    };
  },
);
