import { createServerFeature } from "@payloadcms/richtext-lexical";

import { type TextVariantFeatureProps } from "./types";

export const TextVariantFeature = createServerFeature<
  TextVariantFeatureProps,
  TextVariantFeatureProps,
  TextVariantFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: "payload-lexical-typography-plus/client#TextVariantClientFeature",
      clientFeatureProps: {
        variants: props?.variants || [],
        hideAttribution: props?.hideAttribution,
      },
    };
  },
  key: "textVariant",
});
