import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import html2canvas from "html2canvas";
import Preview from "~/components/preview";
import TextPositionControl, {
  type TextPosition,
} from "~/components/text-position-control";
import printStyles from "~/lib/print-styles.css?raw";
import { renderToStaticMarkup } from "react-dom/server";
import IconPicker from "~/components/icon-picker";
import { Link } from "react-router";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "~/lib/utils";

const Root: React.FC = () => {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [selectedIcon, setSelectedIcon] = useState("IconHome");
  const [textPosition, setTextPosition] =
    useState<TextPosition>("bottom-center");
  const [textScale, setTextScale] = useState(1);
  const [iconScale, setIconScale] = useState(1);
  const [iconRotation, setIconRotation] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const node = previewRef.current;
    if (!node) return;

    const IconComponent =
      (TablerIcons as any)[selectedIcon] || TablerIcons.IconQuestionMark;
    const iconHTML = renderToStaticMarkup(<IconComponent size={128} />);

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

    const { textStyle, containerStyle } = getPreviewStyles(
      textPosition,
      textScale,
      backgroundColor,
      textColor,
      iconColor
    );

    const textDiv = `<div style="${Object.entries(textStyle)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
      .join(";")}"><div>${text}</div></div>`;
    const iconDiv = `<div style="color:${iconColor}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${iconScale}) rotate(${iconRotation}deg);">${iconHTML}</div>`;
    const containerDiv = `<div class="streamdeck-icon-print-container" style="${Object.entries(
      containerStyle
    )
      .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
      .join(";")}">${iconDiv}${textDiv}</div>`;

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
    }, 100); // Timeout to ensure iframe content is fully rendered
  };

  const getPreviewStyles = (
    position: TextPosition,
    scale: number,
    bg: string,
    textC: string,
    iconC: string
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
          <Card className="min-h-full h-full p-0 gap-0 overflow-hidden">
            <CardHeader className="p-3 bg-accent">
              <CardTitle>Stream Deck Icon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-auto py-3 px-3">
              {/* Icon Controls */}
              <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
                Icon Controls
              </div>
              <div>
                <label>Icon</label>
                <IconPicker
                  value={selectedIcon}
                  onValueChange={setSelectedIcon}
                />
              </div>
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
                            onClick={() => setIconScale(1)}
                          >
                            <TablerIcons.IconRestore
                              size={16}
                              aria-hidden="true"
                            />
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
                      onChange={(e) => setIconScale(Number(e.target.value))}
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
                    onValueChange={(value) => setIconScale(value[0])}
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
                            onClick={() => setIconRotation(0)}
                          >
                            <TablerIcons.IconRestore
                              size={16}
                              aria-hidden="true"
                            />
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
                      onChange={(e) => setIconRotation(Number(e.target.value))}
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
                    onValueChange={(value) => setIconRotation(value[0])}
                    aria-label="Rotation"
                  />
                </div>
              </div>

              {/* Text Controls */}
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
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <TextPositionControl
                value={textPosition}
                onValueChange={setTextPosition}
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
                            onClick={() => setTextScale(1)}
                          >
                            <TablerIcons.IconRestore
                              size={16}
                              aria-hidden="true"
                            />
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
                      onChange={(e) => setTextScale(Number(e.target.value))}
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
                    onValueChange={(value) => setTextScale(value[0])}
                  />
                </div>
              </div>
              <div className="py-1 flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6">
                Colors
              </div>
              <div>
                <label>Text Color</label>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>

              {/* Background Controls */}
              <div>
                <label>Background Color</label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
              <div>
                <label>Icon Color</label>
                <Input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                />
              </div>
            </CardContent>
            <div className="mt-auto px-3 py-3 flex flex-col gap-3 bg-accent rounded-b-md">
              <Button className="w-full justify-start" onClick={handleDownload}>
                <TablerIcons.IconDownload />
                Download Icon
              </Button>
              <Link to="https://github.com/tommerty/streamdeck-icons">
                <Button variant={"outline"} className="w-full justify-start">
                  <TablerIcons.IconBrandGithub />
                  GitHub
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <div className="flex flex-col items-center w-2/3 mt-auto mb-auto gap-3">
          <div ref={previewRef}>
            <Preview
              icon={selectedIcon}
              text={text}
              textColor={textColor}
              backgroundColor={backgroundColor}
              iconColor={iconColor}
              textPosition={textPosition}
              textScale={textScale}
              iconScale={iconScale}
              iconRotation={iconRotation}
            />
          </div>
          {/* <Button onClick={handleDownload}>Download Icon</Button> */}
        </div>
      </div>
    </div>
  );
};

export default Root;
