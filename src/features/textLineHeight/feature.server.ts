import { createServerFeature } from "@payloadcms/richtext-lexical";

import type { TextLineHeightFeatureProps } from "./feature.client";

export const TextLineHeightFeature = createServerFeature<
  TextLineHeightFeatureProps,
  TextLineHeightFeatureProps,
  TextLineHeightFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: "payload-lexical-typography-plus/client#TextLineHeightClientFeature",
      clientFeatureProps: {
        hideAttribution: props?.hideAttribution,
        lineHeights: props?.lineHeights,
        scroll: props?.scroll,
        customLineHeight: props?.customLineHeight,
        method: props?.method,
      },
    };
  },
  key: "textLineHeight",
});
