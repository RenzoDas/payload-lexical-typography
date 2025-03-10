import { type LexicalEditor } from "@payloadcms/richtext-lexical/lexical";

import { useEffect, useState } from "react";

import { TextLineHeightPicker } from "./TextLineHeightPicker";

import { TEXT_LINE_HEIGHT_COMMAND } from "../command";

import type { TextLineHeightItem } from "../feature.client";

export const Dropdown = ({ editor, item }: { editor: LexicalEditor; item: TextLineHeightItem }) => {
  const [activeLineHeight, setActiveLineHeight] = useState<string>("");

  const onChange = (lineHeight: string) => {
    editor.dispatchCommand(TEXT_LINE_HEIGHT_COMMAND, { lineHeight });
    setActiveLineHeight(lineHeight || "");
  };

  useEffect(() => {
    editor.read(() => {
      const current = item.current ? item.current() : null;
      if (current) setActiveLineHeight(current);
    });
  }, [editor, item]);

  return <TextLineHeightPicker onChange={onChange} currentValue={activeLineHeight} item={item} />;
};
