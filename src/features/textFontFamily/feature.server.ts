import { createServerFeature } from "@payloadcms/richtext-lexical";

import { type TextFontFamilyFeatureProps } from "./feature.client";

export const TextFontFamilyFeature = createServerFeature<
  TextFontFamilyFeatureProps,
  TextFontFamilyFeatureProps,
  TextFontFamilyFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: "payload-lexical-typography/client#TextFontFamilyClientFeature",
      clientFeatureProps: {
        hideAttribution: props?.hideAttribution,
        fontFamilies: props?.fontFamilies,
        method: props?.method,
        scroll: props?.scroll,
        customFontFamily: props?.customFontFamily,
      },
    };
  },
  key: "textFontFamily",
});