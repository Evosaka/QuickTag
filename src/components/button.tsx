import React, { useState } from "react";
import Icon from "@utils/Icons";
import { colors } from "@utils/theme";

interface ButtonProps {
  children: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  className?: string;
  icon?: string;
  title?: string;
  tip?: string;
  mode?: "regular" | "outline";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  color = colors.primary,
  backgroundColor = colors.primary,
  className = "",
  icon,
  title = "",
  tip,
  disabled = false,
  mode = "regular",
  onClick,
}: ButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full relative inline-block">
      <button
        type="button"
        className={`rounded-md px-4 h-10 text-sm ${
          mode === "outline" ? "border" : ""
        } ${className} cursor-pointer`}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => (tip ? setShowTooltip(true) : null)}
        onMouseLeave={() => (tip ? setShowTooltip(false) : null)}
        style={{
          backgroundColor: mode === "regular" ? backgroundColor : "transparent",
          borderColor: mode === "outline" ? color : "transparent",
          color: mode === "regular" ? "white" : color,
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? "0.33" : "1",
        }}
      >
        <div className="flex justify-center items-center">
          {icon && (
            <Icon name={icon} color={color} size={20} className="mr-3" />
          )}
          <span>{children}</span>
        </div>
      </button>
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg">
          {title}
        </div>
      )}
    </div>
  );
}
