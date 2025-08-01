import React from "react";
import { Input } from "~/components/ui/input";

interface ColorControlsProps {
  textColor: string;
  onTextColorChange: (color: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  iconColor: string;
  onIconColorChange: (color: string) => void;
  iconSource: "icon" | "image";
}

const ColorControls: React.FC<ColorControlsProps> = ({
  textColor,
  onTextColorChange,
  backgroundColor,
  onBackgroundColorChange,
  iconColor,
  onIconColorChange,
  iconSource,
}) => {
  return (
    <>
      <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
        Colors
      </div>
      <div>
        <label>Text Color</label>
        <Input
          type="color"
          value={textColor}
          onChange={(e) => onTextColorChange(e.target.value)}
        />
      </div>

      {/* Background Controls */}
      <div>
        <label>Background Color</label>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
        />
      </div>
      {/* {iconSource === "icon" && (
        <div>
          <label>Icon Color</label>
          <Input
            type="color"
            value={iconColor}
            onChange={(e) => onIconColorChange(e.target.value)}
          />
        </div>
      )} */}
    </>
  );
};

export default ColorControls;
