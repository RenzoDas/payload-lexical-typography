import { createServerFeature } from "@payloadcms/richtext-lexical";

import { type TextSizeFeatureProps } from "./feature.client";

export const TextSizeFeature = createServerFeature<
  TextSizeFeatureProps,
  TextSizeFeatureProps,
  TextSizeFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: "payload-lexical-typography/client#TextSizeClientFeature",
      clientFeatureProps: {
        hideAttribution: props?.hideAttribution,
        sizes: props?.sizes,
        method: props?.method,
        scroll: props?.scroll,
      },
    };
  },
  key: "textSize",
});
