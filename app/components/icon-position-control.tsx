import React from "react";
import { Toggle } from "~/components/ui/toggle";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  IconLayoutAlignLeft,
  IconLayoutAlignCenter,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
  IconLayoutAlignMiddle,
  IconLayoutAlignBottom,
} from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { type IconPosition } from "~/types/layer";

interface IconPositionControlProps {
  value: IconPosition;
  onValueChange: (value: IconPosition) => void;
  offsetX: number;
  offsetY: number;
  onOffsetXChange: (offsetX: number) => void;
  onOffsetYChange: (offsetY: number) => void;
}

const positions: IconPosition[] = [
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

const positionIcons: Record<IconPosition, React.ReactNode> = {
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

const IconPositionControl: React.FC<IconPositionControlProps> = ({
  value,
  onValueChange,
  offsetX,
  offsetY,
  onOffsetXChange,
  onOffsetYChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label>Icon Position Preset</label>
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

      {/* Fine-tune position with sliders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Horizontal Offset</Label>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-7 transition-opacity",
                      offsetX !== 0 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onOffsetXChange(0)}
                  >
                    <TablerIcons.IconRestore size={16} aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  Reset to center
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              className="h-7 w-12 px-2 py-0"
              type="text"
              inputMode="decimal"
              value={offsetX}
              aria-label="Enter horizontal offset"
              onChange={(e) => onOffsetXChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={-120}
            max={120}
            step={10}
            value={[offsetX]}
            onValueChange={(value) => onOffsetXChange(value[0])}
            aria-label="Horizontal position offset"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Vertical Offset</Label>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-7 transition-opacity",
                      offsetY !== 0 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onOffsetYChange(0)}
                  >
                    <TablerIcons.IconRestore size={16} aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  Reset to center
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              className="h-7 w-12 px-2 py-0"
              type="text"
              inputMode="decimal"
              value={offsetY}
              aria-label="Enter vertical offset"
              onChange={(e) => onOffsetYChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={-120}
            max={120}
            step={10}
            value={[offsetY]}
            onValueChange={(value) => onOffsetYChange(value[0])}
            aria-label="Vertical position offset"
          />
        </div>
      </div>
    </div>
  );
};

export default IconPositionControl;
