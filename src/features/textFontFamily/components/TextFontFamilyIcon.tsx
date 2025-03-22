import { COMMAND_PRIORITY_CRITICAL } from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@payloadcms/richtext-lexical/lexical/selection";

import { useEffect } from "react";

import { getSelection } from "../../../utils/getSelection";
import { TEXT_FONT_FAMILY_COMMAND } from "../command";

export const TextFontFamilyIcon = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      TEXT_FONT_FAMILY_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = getSelection();
          if (selection) $patchStyleText(selection, { "font-family": payload.fontFamily || "" });
        });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16" />
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    </svg>
  );
};