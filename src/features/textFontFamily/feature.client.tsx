"use client";

import { type ToolbarGroup, type ToolbarGroupItem } from "@payloadcms/richtext-lexical";
import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { COMMAND_PRIORITY_CRITICAL, type BaseSelection } from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@payloadcms/richtext-lexical/lexical/selection";

import { useEffect } from "react";

import { TEXT_FONT_FAMILY_COMMAND } from "./command";
import { Dropdown } from "./components/TextFontFamilyDropdown";
import { TextFontFamilyIcon } from "./components/TextFontFamilyIcon";

import { getSelection } from "../../utils/getSelection";

export type TextFontFamilyFeatureProps = {
  hideAttribution?: boolean;
  fontFamilies?: { value: string; label: string }[];
  method?: "replace" | "combine";
  customFontFamily?: boolean;
  scroll?: boolean;
};

export type TextFontFamilyItem = ToolbarGroupItem & {
  command: Record<string, unknown>;
  current: () => string | null;
} & TextFontFamilyFeatureProps;

export const TextFontFamilyClientFeature = createClientFeature<TextFontFamilyFeatureProps, TextFontFamilyItem>(({ props }) => {
  const DropdownComponent: ToolbarGroup = {
    type: "dropdown",
    ChildComponent: TextFontFamilyIcon,
    isEnabled({ selection }: { selection: BaseSelection }) {
      return !!getSelection(selection);
    },
    items: [
      {
        Component: () => {
          const [editor] = useLexicalComposerContext();
          return Dropdown({
            editor,
            item: {
              command: TEXT_FONT_FAMILY_COMMAND,
              current() {
                const selection = getSelection();
                return selection ? $getSelectionStyleValueForProperty(selection, "font-family", "") : null;
              },
              hideAttribution: props?.hideAttribution,
              fontFamilies: props?.fontFamilies,
              method: props?.method,
              scroll: props?.scroll,
              customFontFamily: props?.customFontFamily,
              key: "textFontFamily",
            },
          });
        },
        key: "textFontFamily",
      },
    ],
    key: "textFontFamilyDropdown",
    order: 65,
  };

  return {
    plugins: [
      {
        Component: () => {
          const [editor] = useLexicalComposerContext();

          useEffect(() => {
            return editor.registerCommand(
              TEXT_FONT_FAMILY_COMMAND,
              (payload) => {
                editor.update(() => {
                  const selection = getSelection();
                  if (selection) {
                    $patchStyleText(selection, { "font-family": payload.fontFamily || "" });
                  }
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
});