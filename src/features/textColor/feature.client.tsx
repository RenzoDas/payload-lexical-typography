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

import { TEXT_COLOR_COMMAND } from "./command";
import { TextColorDropdown } from "./components/TextColorDropdown";
import { TextColorIcon } from "./components/TextColorIcon";

import { getSelection } from "../../utils/getSelection";

export type TextColorFeatureProps = {
  colors?: string[] | { value: string; label: string }[];
  colorPicker?: boolean;
  hideAttribution?: boolean;
  listView?: boolean;
};

export type TextColorItem = ToolbarGroupItem & {
  command: Record<string, unknown>;
  current: () => string | null;
} & TextColorFeatureProps;

export const TextColorClientFeature = createClientFeature<TextColorFeatureProps, TextColorItem>(
  ({ props }) => {
    const colors =
      props?.colors && props?.colors.length > 0
        ? props.colors
        : ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];

    const DropdownComponent: ToolbarGroup = {
      type: "dropdown",
      ChildComponent: TextColorIcon,
      isEnabled({ selection }: { selection: BaseSelection }) {
        return !!getSelection(selection);
      },
      items: [
        {
          Component: () => {
            const [editor] = useLexicalComposerContext();
            return TextColorDropdown({
              editor,
              item: {
                command: TEXT_COLOR_COMMAND,
                current() {
                  const selection = getSelection();
                  return selection ? $getSelectionStyleValueForProperty(selection, "color", "") : null;
                },
                colors,
                listView: props?.listView,
                hideAttribution: props?.hideAttribution,
                colorPicker: props?.colorPicker,
                key: "textColor",
              },
            });
          },
          key: "textColor",
        },
      ],
      key: "textColorDropdown",
      order: 60,
    };

    return {
      plugins: [
        {
          Component: () => {
            const [editor] = useLexicalComposerContext();

            useEffect(() => {
              return editor.registerCommand(
                TEXT_COLOR_COMMAND,
                (payload) => {
                  editor.update(() => {
                    const selection = getSelection();
                    if (selection) {
                      $patchStyleText(selection, { color: payload.color || "" });
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
  },
);
