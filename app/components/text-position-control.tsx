import React from "react";
import { Toggle } from "~/components/ui/toggle";
import {
  IconLayoutAlignLeft,
  IconLayoutAlignCenter,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
  IconLayoutAlignMiddle,
  IconLayoutAlignBottom,
} from "@tabler/icons-react";

export type TextPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface TextPositionControlProps {
  value: TextPosition;
  onValueChange: (value: TextPosition) => void;
}

const positions: TextPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const positionIcons: Record<TextPosition, React.ReactNode> = {
  "top-left": <IconLayoutAlignTop size={16} />,
  "top-center": <IconLayoutAlignCenter size={16} />,
  "top-right": <IconLayoutAlignRight size={16} />,
  "middle-left": <IconLayoutAlignLeft size={16} />,
  "middle-center": (
    <div className="w-4 h-4 flex items-center justify-center">
      <div className="w-2 h-2 bg-foreground rounded-full" />
    </div>
  ),
  "middle-right": <IconLayoutAlignRight size={16} />,
  "bottom-left": <IconLayoutAlignBottom size={16} />,
  "bottom-center": <IconLayoutAlignCenter size={16} />,
  "bottom-right": <IconLayoutAlignRight size={16} />,
};

const TextPositionControl: React.FC<TextPositionControlProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <div>
      <label>Text Position</label>
      <div className="grid grid-cols-3 gap-1 w-32">
        {positions.map((position) => (
          <Toggle
            key={position}
            variant="outline"
            size="sm"
            pressed={value === position}
            onPressedChange={() => onValueChange(position)}
          >
            {positionIcons[position]}
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default TextPositionControl;
