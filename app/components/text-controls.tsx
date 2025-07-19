import React from "react";
import { Input } from "~/components/ui/input";
import TextPositionControl, {
  type TextPosition,
} from "~/components/text-position-control";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface TextControlsProps {
  text: string;
  onTextChange: (text: string) => void;
  textPosition: TextPosition;
  onTextPositionChange: (position: TextPosition) => void;
  textScale: number;
  onTextScaleChange: (scale: number) => void;
}

export const TextControls: React.FC<TextControlsProps> = ({
  text,
  onTextChange,
  textPosition,
  onTextPositionChange,
  textScale,
  onTextScaleChange,
}) => {
  return (
    <>
      <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
        Text Controls
      </div>
      <div className="group relative">
        <label
          htmlFor={"text"}
          className="bg-card text-muted-foreground group-focus-within:text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
        >
          Text
        </label>
        <Input
          id={"text"}
          className="h-10 !bg-card"
          placeholder="My button"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>
      <TextPositionControl
        value={textPosition}
        onValueChange={onTextPositionChange}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Text Scale</Label>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-7 transition-opacity",
                      textScale !== 1 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onTextScaleChange(1)}
                  >
                    <TablerIcons.IconRestore size={16} aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  Reset to default
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              className="h-7 w-12 px-2 py-0"
              type="text"
              inputMode="decimal"
              value={textScale}
              aria-label="Enter value"
              onChange={(e) => onTextScaleChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={0.5}
            max={3}
            step={0.1}
            value={[textScale]}
            onValueChange={(value) => onTextScaleChange(value[0])}
          />
        </div>
      </div>
    </>
  );
};

export default TextControls;
