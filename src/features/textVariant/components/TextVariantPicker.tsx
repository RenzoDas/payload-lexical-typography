import { useState, useEffect } from "react";

import { type TextVariant, type TextVariantFeatureProps } from "../types";

export const TextVariantPicker = ({
  variant,
  onChange,
  variants = [],
  hideAttribution = false,
}: {
  variant: string;
  onChange: (variant: string) => void;
} & TextVariantFeatureProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>(variant || "");

  useEffect(() => {
    setSelectedVariant(variant || "");
  }, [variant]);

  const handleVariantSelect = (variantName: string) => {
    setSelectedVariant(variantName);
    onChange(variantName);
  };

  const handleReset = () => {
    setSelectedVariant("");
    onChange("");
  };

  // Function to shorten device settings for display
  const formatDeviceSettings = (variant: TextVariant, device: "mobile" | "tablet" | "desktop") => {
    const settings = variant[device];
    return `${settings.fontSize} / ${settings.lineHeight}`;
  };

  return (
    <div
      style={{
        width: "300px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxHeight: "280px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {variants.map((variantOption) => (
          <button
            key={variantOption.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleVariantSelect(variantOption.name);
            }}
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            style={{
              cursor: "pointer",
              margin: 0,
              fontWeight: selectedVariant === variantOption.name ? "bold" : "normal",
              border:
                selectedVariant === variantOption.name
                  ? "1px solid var(--theme-elevation-900)"
                  : "1px solid transparent",
              display: "flex",
              flexDirection: "column",
              padding: "8px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{variantOption.name}</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                width: "100%",
                fontSize: "11px",
                marginTop: "4px",
                color: "var(--theme-elevation-700)",
              }}
            >
              <div>📱 {formatDeviceSettings(variantOption, "mobile")}</div>
              <div>📱 {formatDeviceSettings(variantOption, "tablet")}</div>
              <div>💻 {formatDeviceSettings(variantOption, "desktop")}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleReset();
          }}
          className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
          style={{ marginLeft: "auto", margin: "0", cursor: "pointer", flex: 1 }}
        >
          Reset
        </button>
      </div>

      {!hideAttribution && (
        <p
          style={{
            color: "var(--theme-elevation-650)",
            fontSize: "10px",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Made with ❤️ by{" "}
          <a target="_blank" href="https://github.com/AdrianMaj">
            @AdrianMaj
          </a>
        </p>
      )}
    </div>
  );
};
