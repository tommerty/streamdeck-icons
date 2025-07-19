import React from "react";
import { Input } from "~/components/ui/input";
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
import IconPicker from "./icon-picker";
import { Toggle } from "./ui/toggle";

interface IconControlsProps {
  iconSource: "icon" | "image";
  onIconSourceChange: (source: "icon" | "image") => void;
  selectedIcon: string;
  onSelectedIconChange: (icon: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconScale: number;
  onIconScaleChange: (scale: number) => void;
  iconRotation: number;
  onIconRotationChange: (rotation: number) => void;
}

const IconControls: React.FC<IconControlsProps> = ({
  iconSource,
  onIconSourceChange,
  selectedIcon,
  onSelectedIconChange,
  onImageUpload,
  iconScale,
  onIconScaleChange,
  iconRotation,
  onIconRotationChange,
}) => {
  return (
    <>
      <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
        Icon Controls
      </div>
      <div className="flex gap-2">
        <Toggle
          pressed={iconSource === "icon"}
          onPressedChange={() => onIconSourceChange("icon")}
          className="w-full"
        >
          <TablerIcons.IconPhoto size={16} className="mr-2" />
          Icon
        </Toggle>
        <Toggle
          pressed={iconSource === "image"}
          onPressedChange={() => onIconSourceChange("image")}
          className="w-full"
        >
          <TablerIcons.IconUpload size={16} className="mr-2" />
          Image
        </Toggle>
      </div>
      {iconSource === "icon" ? (
        <div>
          <label>Icon</label>
          <IconPicker
            value={selectedIcon}
            onValueChange={onSelectedIconChange}
          />
        </div>
      ) : (
        <div>
          <label>Upload Image</label>
          <Input
            type="file"
            accept="image/png, image/jpeg"
            onChange={onImageUpload}
          />
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Icon Scale</Label>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-7 transition-opacity",
                      iconScale !== 1 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onIconScaleChange(1)}
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
              value={iconScale}
              aria-label="Enter value"
              onChange={(e) => onIconScaleChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={0.5}
            max={3}
            step={0.1}
            value={[iconScale]}
            onValueChange={(value) => onIconScaleChange(value[0])}
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Icon Rotation</Label>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-7 transition-opacity",
                      iconRotation !== 0 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onIconRotationChange(0)}
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
              value={iconRotation}
              aria-label="Enter value"
              onChange={(e) => onIconRotationChange(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={-360}
            max={360}
            defaultValue={[0]}
            step={10}
            value={[iconRotation]}
            onValueChange={(value) => onIconRotationChange(value[0])}
            aria-label="Rotation"
          />
        </div>
      </div>
    </>
  );
};

export default IconControls;
