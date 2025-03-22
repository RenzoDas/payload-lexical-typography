import { type LexicalEditor } from "@payloadcms/richtext-lexical/lexical";

import { useEffect, useState } from "react";

import { FontFamilyPicker } from "./TextFontFamilyPicker";

import { type TextFontFamilyItem } from "../feature.client";

export const Dropdown = ({ editor, item }: { editor: LexicalEditor; item: TextFontFamilyItem }) => {
  const [activeFontFamily, setActiveFontFamily] = useState<string>("");

  const onChange = (fontFamily: string) => {
    editor.dispatchCommand(item.command, { fontFamily });
    setActiveFontFamily(fontFamily || "");
  };

  useEffect(() => {
    editor.read(() => {
      const current = item.current ? item.current() : null;
      if (current) setActiveFontFamily(current);
    });
  }, [editor, item]);

  return (
    <FontFamilyPicker
      fontFamily={activeFontFamily}
      onChange={onChange}
      hideAttribution={item.hideAttribution}
      method={item.method}
      scroll={item.scroll}
      fontFamilies={item.fontFamilies}
      customFontFamily={item.customFontFamily}
    />
  );
};