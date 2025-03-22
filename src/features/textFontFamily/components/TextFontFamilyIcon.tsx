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
    <div>
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
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" x2="15" y1="20" y2="20" />
        <line x1="12" x2="12" y1="4" y2="20" />
      </svg>
    </div>
  );
};
