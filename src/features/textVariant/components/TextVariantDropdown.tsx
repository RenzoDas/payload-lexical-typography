import { type LexicalEditor } from "@payloadcms/richtext-lexical/lexical";
import { useEffect, useState } from "react";

import { TextVariantPicker } from "./TextVariantPicker";
import { type TextVariantItem } from "../feature.client";

export const TextVariantDropdown = ({ editor, item }: { editor: LexicalEditor; item: TextVariantItem }) => {
  const [activeVariant, setActiveVariant] = useState<string>("");

  const onChange = (variant: string) => {
    editor.dispatchCommand(item.command, { variant });
    setActiveVariant(variant || "");
  };

  useEffect(() => {
    editor.read(() => {
      const current = item.current ? item.current() : null;
      if (current) setActiveVariant(current);
    });
  }, [editor, item]);

  return (
    <TextVariantPicker
      variant={activeVariant}
      onChange={onChange}
      variants={item.variants}
      hideAttribution={item.hideAttribution}
    />
  );
};
