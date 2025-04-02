import { createServerFeature } from "@payloadcms/richtext-lexical";

import { type TextColorFeatureProps } from "./feature.client";

export const TextColorFeature = createServerFeature<
  TextColorFeatureProps,
  TextColorFeatureProps,
  TextColorFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: "@renzodas/payload-lexical-typography/client#TextColorClientFeature",
      clientFeatureProps: {
        colors: props?.colors ?? [],
        colorPicker: props?.colorPicker,
        hideAttribution: props?.hideAttribution ?? false,
        listView: props?.listView,
      },
    };
  },
  key: "textColor",
});
