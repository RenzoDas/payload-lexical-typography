export type DeviceSettings = {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  fontFamily?: string;
  color?: string;
};

export type TextVariant = {
  name: string;
  mobile: DeviceSettings;
  tablet: DeviceSettings;
  desktop: DeviceSettings;
};

export type TextVariantFeatureProps = {
  variants: TextVariant[];
  hideAttribution?: boolean;
};
