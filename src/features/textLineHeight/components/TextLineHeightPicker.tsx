import { useState, useEffect, useRef, type ChangeEvent } from "react";

import type { TextLineHeightFeatureProps } from "../feature.client";

export const TextLineHeightPicker = ({
  currentValue,
  onChange,
  item,
}: {
  currentValue: string;
  onChange: (lineHeight: string) => void;
  item: TextLineHeightFeatureProps & { current?: () => string | null };
}) => {
  const isEditingRef = useRef(false);

  const defaultLineHeights = [
    { value: "1", label: "1" },
    { value: "1.5", label: "1.5" },
    { value: "2", label: "2" },
    { value: "2.5", label: "2.5" },
  ];

  // Always replace defaults with provided lineHeights if they exist
  const options = item.lineHeights ?? defaultLineHeights;

  const [displayValue, setDisplayValue] = useState(currentValue || "");
  const [appliedValue, setAppliedValue] = useState(currentValue || "");
  const [customValue, setCustomValue] = useState(currentValue || "");

  useEffect(() => {
    if (isEditingRef.current) return;

    if (!currentValue) {
      setDisplayValue("");
      setAppliedValue("");
      setCustomValue("");
      return;
    }

    setDisplayValue(currentValue);
    setAppliedValue(currentValue);
    setCustomValue(currentValue);
  }, [currentValue]);

  const handleLineHeightSelect = (value: string) => {
    setDisplayValue(value);
    setAppliedValue(value);
    onChange(value);
    setCustomValue(value);
  };

  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    isEditingRef.current = true;
    const newValue = e.target.value;
    setCustomValue(newValue);
    setDisplayValue(newValue);
  };

  const applyCustomLineHeight = () => {
    isEditingRef.current = false;
    setAppliedValue(displayValue);
    onChange(displayValue);
  };

  const handleReset = () => {
    isEditingRef.current = false;
    setDisplayValue("");
    setAppliedValue("");
    setCustomValue("");
    onChange("");
  };

  return (
    <div
      style={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          maxHeight: item.scroll && options.length > 4 ? "64px" : "none",
          overflowY: item.scroll && options.length > 4 ? "auto" : "visible",
          paddingRight: item.scroll && options.length > 4 ? "8px" : "0",
        }}
      >
        {options.map((option, index) => (
          <button
            key={`${option.value}-${index}`}
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            style={{
              cursor: "pointer",
              margin: "0",
              border:
                appliedValue === option.value
                  ? "1px solid var(--theme-elevation-900)"
                  : "1px solid transparent",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLineHeightSelect(option.value);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {item.customLineHeight !== false && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "8px" }}>Custom: </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "140px",
            }}
          >
            <div
              className="field-type text"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ flex: 1 }}
            >
              <input
                style={{
                  width: "100%",
                  margin: "8px 0",
                  height: "25px",
                  paddingTop: "0",
                  paddingBottom: "1px",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                }}
                type="text"
                value={customValue}
                onChange={handleCustomChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
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
        {item.customLineHeight !== false && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              applyCustomLineHeight();
            }}
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            style={{ marginLeft: "auto", margin: "0", cursor: "pointer", flex: 1 }}
          >
            Apply
          </button>
        )}
      </div>

      {!item.hideAttribution && (
        <p
          style={{
            color: "var(--theme-elevation-650)",
            fontSize: "10px",
            textAlign: "center",
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
