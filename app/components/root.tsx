import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import html2canvas from "html2canvas";
import Preview from "~/components/preview";
import { type TextPosition } from "~/components/text-position-control";
import printStyles from "~/lib/print-styles.css?raw";
import { renderToStaticMarkup } from "react-dom/server";
import ActionButtons from "./action-buttons";
import IconControls from "./icon-controls";
import TextControls from "./text-controls";
import ColorControls from "./color-controls";

const Root: React.FC = () => {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [selectedIcon, setSelectedIcon] = useState("IconHome");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageType, setUploadedImageType] = useState<string | null>(
    null
  );
  const [iconSource, setIconSource] = useState<"icon" | "image">("icon");
  const [textPosition, setTextPosition] =
    useState<TextPosition>("bottom-center");
  const [textScale, setTextScale] = useState(1);
  const [iconScale, setIconScale] = useState(1);
  const [iconRotation, setIconRotation] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const node = previewRef.current;
    if (!node) return;

    if (iconSource === "image" && uploadedImage) {
      const link = document.createElement("a");

      link.href = uploadedImage;
      link.click();
      return;
    }

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
    const iconDiv =
      iconSource === "image" && uploadedImage
        ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${iconScale}) rotate(${iconRotation}deg);"><img src="${uploadedImage}" style="width: 128px; height: auto;" /></div>`
        : `<div style="color:${iconColor}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${iconScale}) rotate(${iconRotation}deg);">${iconHTML}</div>`;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container w-full mx-auto p-4 min-h-dvh h-dvh">
      <div className="flex items-start gap-8 h-full">
        <div className="w-1/3 h-full min-h-full">
          <Card className="min-h-full h-full p-0 gap-0 overflow-hidden flex flex-col">
            <CardHeader className="p-3 bg-accent">
              <CardTitle>Stream Deck Icon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-auto py-3 px-3 flex-grow">
              <IconControls
                iconSource={iconSource}
                onIconSourceChange={setIconSource}
                selectedIcon={selectedIcon}
                onSelectedIconChange={setSelectedIcon}
                onImageUpload={handleImageUpload}
                iconScale={iconScale}
                onIconScaleChange={setIconScale}
                iconRotation={iconRotation}
                onIconRotationChange={setIconRotation}
              />
              <TextControls
                text={text}
                onTextChange={setText}
                textPosition={textPosition}
                onTextPositionChange={setTextPosition}
                textScale={textScale}
                onTextScaleChange={setTextScale}
              />
              <ColorControls
                textColor={textColor}
                onTextColorChange={setTextColor}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={setBackgroundColor}
                iconColor={iconColor}
                onIconColorChange={setIconColor}
                iconSource={iconSource}
              />
            </CardContent>
            <ActionButtons onDownload={handleDownload} />
          </Card>
        </div>
        <div className="flex flex-col items-center w-2/3 mt-auto mb-auto gap-3">
          <div ref={previewRef}>
            <Preview
              icon={iconSource === "icon" ? selectedIcon : undefined}
              image={iconSource === "image" ? uploadedImage : undefined}
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
        </div>
      </div>
    </div>
  );
};

export default Root;
