import { type LexicalEditor } from "@payloadcms/richtext-lexical/lexical";

import { useEffect, useState } from "react";

import { TextColorPicker } from "./TextColorPicker";

import { type TextColorItem } from "../feature.client";

export const TextColorDropdown = ({ editor, item }: { editor: LexicalEditor; item: TextColorItem }) => {
  const [activeColor, setActiveColor] = useState<string>("");

  const onChange = (color: string) => {
    editor.dispatchCommand(item.command, { color });
    setActiveColor(color || "");
  };

  useEffect(() => {
    editor.read(() => {
      const current = item.current ? item.current() : null;
      if (current) setActiveColor(current);
    });
  }, [editor, item]);

  return (
    <TextColorPicker
      color={activeColor}
      onChange={onChange}
      colors={item.colors}
      hideAttribution={item.hideAttribution}
      colorPicker={item.colorPicker}
      listView={item.listView}
    />
  );
};
