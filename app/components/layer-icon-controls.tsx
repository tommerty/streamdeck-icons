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
import IconPositionControl from "./icon-position-control";
import type { IconLayer } from "~/types/layer";

interface LayerIconControlsProps {
  layer: IconLayer;
  onLayerUpdate: (layerId: string, updates: Partial<IconLayer>) => void;
}

const LayerIconControls: React.FC<LayerIconControlsProps> = ({
  layer,
  onLayerUpdate,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const acceptedTypes = ["image/png", "image/jpeg"];
      if (acceptedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onLayerUpdate(layer.id, {
            uploadedImage: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid file type. Please select a PNG or JPEG image.");
        e.target.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
        Options
      </div>
      
      {/* Source Toggle */}
      <div className="flex gap-2">
        <Toggle
          pressed={layer.iconSource === "icon"}
          onPressedChange={() =>
            onLayerUpdate(layer.id, { iconSource: "icon" })
          }
          className="w-full"
        >
          <TablerIcons.IconPhoto size={16} className="mr-2" />
          Icon
        </Toggle>
        <Toggle
          pressed={layer.iconSource === "image"}
          onPressedChange={() =>
            onLayerUpdate(layer.id, { iconSource: "image" })
          }
          className="w-full"
        >
          <TablerIcons.IconUpload size={16} className="mr-2" />
          Image
        </Toggle>
      </div>

      {/* Icon/Image Selection */}
      {layer.iconSource === "icon" ? (
        <div>
          <label>Icon</label>
          <IconPicker
            value={layer.selectedIcon}
            onValueChange={(icon) =>
              onLayerUpdate(layer.id, { selectedIcon: icon })
            }
          />
        </div>
      ) : (
        <div>
          <label>Upload Image</label>
          <Input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
        </div>
      )}

      {/* Position Control */}
      <IconPositionControl
        value={layer.position}
        onValueChange={(position) =>
          onLayerUpdate(layer.id, { position })
        }
        offsetX={layer.offsetX}
        offsetY={layer.offsetY}
        onOffsetXChange={(offsetX) =>
          onLayerUpdate(layer.id, { offsetX })
        }
        onOffsetYChange={(offsetY) =>
          onLayerUpdate(layer.id, { offsetY })
        }
      />

      {/* Color Control */}
      {layer.iconSource === "icon" && (
        <div>
          <label>Icon Color</label>
          <Input
            type="color"
            value={layer.color}
            onChange={(e) =>
              onLayerUpdate(layer.id, { color: e.target.value })
            }
          />
        </div>
      )}

      {/* Scale Control */}
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
                      layer.scale !== 1 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onLayerUpdate(layer.id, { scale: 1 })}
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
              value={layer.scale}
              aria-label="Enter value"
              onChange={(e) =>
                onLayerUpdate(layer.id, { scale: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            className="grow"
            min={0.1}
            max={3}
            step={0.1}
            value={[layer.scale]}
            onValueChange={(value) =>
              onLayerUpdate(layer.id, { scale: value[0] })
            }
          />
        </div>
      </div>

      {/* Rotation Control */}
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
                      layer.rotation !== 0 ? "opacity-100" : "opacity-0"
                    )}
                    aria-label="Reset"
                    onClick={() => onLayerUpdate(layer.id, { rotation: 0 })}
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
              value={layer.rotation}
              aria-label="Enter value"
              onChange={(e) =>
                onLayerUpdate(layer.id, { rotation: Number(e.target.value) })
              }
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
            value={[layer.rotation]}
            onValueChange={(value) =>
              onLayerUpdate(layer.id, { rotation: value[0] })
            }
            aria-label="Rotation"
          />
        </div>
      </div>
    </div>
  );
};

export default LayerIconControls;
