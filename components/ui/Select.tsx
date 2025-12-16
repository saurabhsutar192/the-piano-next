"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import "./select.scss";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value?: Option;
  onChange?: (value: Option | null) => void;
  placeholder?: string;
  id?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  borderRadius?: string;
  color?: string;
  hideIcons?: boolean;
  centeredOptions?: boolean;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  id,
  isDisabled = false,
  isClearable = false,
  borderRadius = "4px",
  color = "#000",
  hideIcons = false,
  centeredOptions = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const hasValue = value?.label && value.label !== "";
  const selectedIndex = options.findIndex((opt) => opt.value === value?.value);

  return (
    <div
      ref={selectRef}
      id={id}
      aria-disabled={isDisabled}
      className={`select ${isDisabled ? "disabled" : ""}`}
    >
      <div
        role="combobox"
        aria-controls={`${id}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={selectedIndex >= 0 ? `${id}-option-${selectedIndex}` : undefined}
        tabIndex={isDisabled ? -1 : 0}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !isDisabled && setIsOpen(!isOpen);
          }
        }}
        className={`select-trigger ${isDisabled ? "disabled" : ""}`}
        style={{ borderRadius, color }}
      >
        <div className={`select-value ${!hasValue ? "placeholder" : ""}`} style={{ color: hasValue ? color : undefined }}>
          {value?.label || placeholder}
        </div>
        {!hideIcons && (
          <div className="select-icons">
            {isClearable && hasValue && (
              <X
                onClick={handleClear}
                size={16}
                color={color}
                className="select-clear"
              />
            )}
            <ChevronDown
              size={18}
              color={color}
              className={`select-arrow ${isOpen ? "open" : ""}`}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-label={placeholder}
          className="select-dropdown"
          style={{ borderRadius }}
        >
          {options.length === 0 ? (
            <div aria-disabled="true" className="select-option empty">
              No options
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                tabIndex={0}
                aria-selected={value?.value === option.value}
                data-selected={value?.value === option.value}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(option);
                  }
                }}
                className={`select-option ${centeredOptions ? "centered" : ""}`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
