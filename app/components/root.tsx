import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import html2canvas from "html2canvas";
import Preview from "~/components/preview";
import { type TextPosition } from "~/components/text-position-control";
import printStyles from "~/lib/print-styles.css?raw";
import { renderToStaticMarkup } from "react-dom/server";
import ActionButtons from "./action-buttons";
import TextControls from "./text-controls";
import ColorControls from "./color-controls";
import LayerManager from "./layer-manager";
import LayerIconControls from "./layer-icon-controls";
import type { IconLayer } from "~/types/layer";
import { createDefaultLayer } from "~/types/layer";
import TabPicker from "./tabs";

const Root: React.FC = () => {
    const [text, setText] = useState("");
    const [textColor, setTextColor] = useState("#ffffff");
    const [backgroundColor, setBackgroundColor] = useState("#000000");
    const [textPosition, setTextPosition] =
        useState<TextPosition>("bottom-center");
    const [textScale, setTextScale] = useState(1);

    // Layer management state
    const [layers, setLayers] = useState<IconLayer[]>([
        createDefaultLayer("layer-1", "Icon Layer 1"),
    ]);
    const [activeLayerId, setActiveLayerId] = useState<string>("layer-1");

    const previewRef = useRef<HTMLDivElement>(null);

    // Layer management functions
    const handleLayerAdd = () => {
        const newLayerId = `layer-${Date.now()}`;
        const newLayer = createDefaultLayer(newLayerId, `Icon Layer ${layers.length + 1}`);
        newLayer.zIndex = layers.length;
        setLayers([...layers, newLayer]);
        setActiveLayerId(newLayerId);
    };

    const handleLayerDelete = (layerId: string) => {
        if (layers.length <= 1) return;
        const newLayers = layers.filter((layer) => layer.id !== layerId);
        setLayers(newLayers);
        if (activeLayerId === layerId) {
            setActiveLayerId(newLayers[0]?.id || "");
        }
    };

    const handleLayerToggleVisibility = (layerId: string) => {
        setLayers(layers.map(layer =>
            layer.id === layerId
                ? { ...layer, visible: !layer.visible }
                : layer
        ));
    };

    const handleLayerRename = (layerId: string, name: string) => {
        setLayers(layers.map(layer =>
            layer.id === layerId
                ? { ...layer, name }
                : layer
        ));
    };

    const handleLayerReorder = (layerId: string, direction: "up" | "down") => {
        const layerIndex = layers.findIndex(layer => layer.id === layerId);
        if (layerIndex === -1) return;

        const newLayers = [...layers];
        if (direction === "up" && layerIndex > 0) {
            // Swap zIndex values
            const temp = newLayers[layerIndex].zIndex;
            newLayers[layerIndex].zIndex = newLayers[layerIndex - 1].zIndex;
            newLayers[layerIndex - 1].zIndex = temp;
        } else if (direction === "down" && layerIndex < layers.length - 1) {
            // Swap zIndex values
            const temp = newLayers[layerIndex].zIndex;
            newLayers[layerIndex].zIndex = newLayers[layerIndex + 1].zIndex;
            newLayers[layerIndex + 1].zIndex = temp;
        }
        setLayers(newLayers);
    };

    const handleLayerUpdate = (layerId: string, updates: Partial<IconLayer>) => {
        setLayers(layers.map(layer =>
            layer.id === layerId
                ? { ...layer, ...updates }
                : layer
        ));
    };

    const activeLayer = layers.find(layer => layer.id === activeLayerId);

    const handleDownload = () => {
        const node = previewRef.current;
        if (!node) return;

        // Create iframe for rendering
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.left = "-9999px";
        iframe.style.width = "256px";
        iframe.style.height = "256px";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            document.body.removeChild(iframe);
            return;
        }

        // Generate HTML for all visible layers
        const layerDivs = layers
            .filter((layer) => layer.visible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((layer) => {
                const IconComponent =
                    layer.iconSource === "icon" && (TablerIcons as any)[layer.selectedIcon]
                        ? (TablerIcons as any)[layer.selectedIcon]
                        : TablerIcons.IconQuestionMark;

                const iconHTML = renderToStaticMarkup(<IconComponent size={128} />);

                // Position styles for icon with offsets
                const edgeDistance = 10;
                let positionStyles = "position: absolute;";

                if (layer.position.startsWith("top")) {
                    positionStyles += `top: ${edgeDistance + layer.offsetY}px;`;
                } else if (layer.position.startsWith("middle")) {
                    positionStyles += "top: 50%;";
                } else if (layer.position.startsWith("bottom")) {
                    positionStyles += `bottom: ${edgeDistance - layer.offsetY}px;`;
                }

                if (layer.position.endsWith("left")) {
                    positionStyles += `left: ${edgeDistance + layer.offsetX}px;`;
                } else if (layer.position.endsWith("center")) {
                    positionStyles += "left: 50%;";
                } else if (layer.position.endsWith("right")) {
                    positionStyles += `right: ${edgeDistance - layer.offsetX}px;`;
                }

                // Transform styles with offsets
                let transforms = [];
                if (layer.position.startsWith("middle")) {
                    transforms.push(`translateY(calc(-50% + ${layer.offsetY}px))`);
                }
                if (layer.position.endsWith("center")) {
                    transforms.push(`translateX(calc(-50% + ${layer.offsetX}px))`);
                }
                transforms.push(`scale(${layer.scale})`);
                transforms.push(`rotate(${layer.rotation}deg)`);

                const transformStyle = `transform: ${transforms.join(" ")};`;

                if (layer.iconSource === "image" && layer.uploadedImage) {
                    return `<div style="${positionStyles}${transformStyle}z-index:${layer.zIndex};"><img src="${layer.uploadedImage}" style="width: 128px; height: auto;" /></div>`;
                } else {
                    return `<div style="color:${layer.color};${positionStyles}${transformStyle}z-index:${layer.zIndex};">${iconHTML}</div>`;
                }
            });

        // Text styles
        const { textStyle, containerStyle } = getPreviewStyles(
            textPosition,
            textScale,
            backgroundColor,
            textColor
        );

        const textDiv = `<div style="${Object.entries(textStyle)
            .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
            .join(";")}"><div>${text}</div></div>`;

        const containerDiv = `<div class="streamdeck-icon-print-container" style="${Object.entries(
            containerStyle
        )
            .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
            .join(";")}">${layerDivs.join("")}${textDiv}</div>`;

        doc.open();
        doc.write(`
        <html>
            <head>
                <style>${printStyles}</style>
            </head>
            <body>
                ${containerDiv}
            </body>
        </html>
    `);
        doc.close();

        setTimeout(() => {
            html2canvas(doc.body, {
                width: 256,
                height: 256,
                backgroundColor: null,
            })
                .then((canvas) => {
                    const link = document.createElement("a");
                    link.download = "streamdeck-icon.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                    document.body.removeChild(iframe);
                })
                .catch((err) => {
                    console.error("html2canvas error", err);
                    document.body.removeChild(iframe);
                });
        }, 100);
    };

    const getPreviewStyles = (
        position: TextPosition,
        scale: number,
        bg: string,
        textC: string
    ) => {
        const containerStyle: React.CSSProperties = {
            width: "256px",
            height: "256px",
            backgroundColor: bg,
            borderRadius: "24px",
        };

        const textStyle: React.CSSProperties = {
            position: "absolute",
            width: "100%",
            padding: "0 20px",
            display: "flex",
            color: textC,
            fontSize: "32px",
            fontWeight: "bold",
            wordBreak: "break-word",
            transform: `scale(${scale})`,
            zIndex: 1000,
        };

        // Vertical alignment
        if (position.startsWith("top")) {
            textStyle.top = "20px";
            textStyle.alignItems = "flex-start";
        } else if (position.startsWith("middle")) {
            textStyle.top = "50%";
            textStyle.transform += " translateY(-50%)";
        } else if (position.startsWith("bottom")) {
            textStyle.bottom = "20px";
            textStyle.alignItems = "flex-end";
        }

        // Horizontal alignment
        if (position.endsWith("left")) {
            textStyle.justifyContent = "flex-start";
            textStyle.textAlign = "left";
        } else if (position.endsWith("center")) {
            textStyle.justifyContent = "center";
            textStyle.textAlign = "center";
        } else if (position.endsWith("right")) {
            textStyle.justifyContent = "flex-end";
            textStyle.textAlign = "right";
        }

        return { textStyle, containerStyle };
    };

    return (
        <div className="container w-full mx-auto p-4 min-h-dvh h-dvh">
            <div className="flex items-start gap-8 h-full">
                <div className="w-1/3 h-full min-h-full">
                    <Card className="min-h-full h-full p-0 gap-0 overflow-hidden flex flex-col">
                        <CardHeader className="p-3 bg-accent">
                            <CardTitle>Stream Deck Icon</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 overflow-auto pb-3 px-0 flex-grow">
                            <TabPicker icons={<><LayerManager
                                layers={layers}
                                activeLayerId={activeLayerId}
                                onLayerSelect={setActiveLayerId}
                                onLayerAdd={handleLayerAdd}
                                onLayerDelete={handleLayerDelete}
                                onLayerToggleVisibility={handleLayerToggleVisibility}
                                onLayerRename={handleLayerRename}
                                onLayerReorder={handleLayerReorder}
                            />

                                {activeLayer && (
                                    <LayerIconControls
                                        layer={activeLayer}
                                        onLayerUpdate={handleLayerUpdate}
                                    />
                                )}</>}
                                text={<TextControls
                                    text={text}
                                    onTextChange={setText}
                                    textPosition={textPosition}
                                    onTextPositionChange={setTextPosition}
                                    textScale={textScale}
                                    onTextScaleChange={setTextScale}
                                />} colors={<ColorControls
                                    textColor={textColor}
                                    onTextColorChange={setTextColor}
                                    backgroundColor={backgroundColor}
                                    onBackgroundColorChange={setBackgroundColor}
                                    iconColor={"#ffffff"} // Legacy prop, not used anymore
                                    onIconColorChange={() => { }} // Legacy prop, not used anymore
                                    iconSource={"icon"} // Legacy prop, not used anymore
                                />} />
                        </CardContent>
                        <ActionButtons onDownload={handleDownload} />
                    </Card>
                </div>
                <div className="flex flex-col items-center w-2/3 mt-auto mb-auto gap-3">
                    <div ref={previewRef}>
                        <Preview
                            layers={layers}
                            text={text}
                            textColor={textColor}
                            backgroundColor={backgroundColor}
                            textPosition={textPosition}
                            textScale={textScale}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Root;
