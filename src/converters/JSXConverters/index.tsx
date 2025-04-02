import { TextJSXConverter } from "./TextJSXConverter";
import { TextVariantJSXConverter } from "./TextVariantJSXConverter";

export const TypographyJSXConverters = { 
  ...TextJSXConverter,
  ...TextVariantJSXConverter 
};
