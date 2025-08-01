import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Toggle } from "~/components/ui/toggle";
import * as TablerIcons from "@tabler/icons-react";
import type { IconLayer } from "~/types/layer";
import { cn } from "~/lib/utils";

interface LayerManagerProps {
  layers: IconLayer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerRename: (layerId: string, name: string) => void;
  onLayerReorder: (layerId: string, direction: "up" | "down") => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerAdd,
  onLayerDelete,
  onLayerToggleVisibility,
  onLayerRename,
  onLayerReorder,
}) => {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Layers</h3>
          <Button size="sm" onClick={onLayerAdd}>
            <TablerIcons.IconPlus size={16} />
          </Button>
        </div>
      
      
        <div className="space-y-1">
          {layers
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((layer, index) => (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-accent/50",
                  activeLayerId === layer.id && "bg-accent border-primary"
                )}
                onClick={() => onLayerSelect(layer.id)}
              >
                {/* Show the layer's icon or image */}
                <div className="flex items-center justify-center w-8 h-8 ">
                  {layer.iconSource === "image" && layer.uploadedImage ? (
                    <img
                      src={layer.uploadedImage}
                      alt={layer.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : (
                    (() => {
                      const IconComponent = (TablerIcons as any)[layer.selectedIcon] || TablerIcons.IconQuestionMark;
                      return <IconComponent size={16} style={{ color: layer.color }} />;
                    })()
                  )}
                </div>

                <div className="flex gap-1 items-center ml-auto">
                <Toggle
                  pressed={layer.visible}
                  onPressedChange={() => onLayerToggleVisibility(layer.id)}
                  size="sm"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {layer.visible ? (
                    <TablerIcons.IconEye size={14} />
                  ) : (
                    <TablerIcons.IconEyeOff size={14} />
                  )}
                </Toggle>
                
                
                
                  <Button
                    size="sm"
                    variant="ghost"
                    // className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerReorder(layer.id, "up");
                    }}
                    disabled={index === 0}
                  >
                    <TablerIcons.IconChevronUp size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    // className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerReorder(layer.id, "down");
                    }}
                    disabled={index === layers.length - 1}
                  >
                    <TablerIcons.IconChevronDown size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                    disabled={layers.length <= 1}
                  >
                    <TablerIcons.IconTrash size={14} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      
    </div>
    
  );
};

export default LayerManager;
