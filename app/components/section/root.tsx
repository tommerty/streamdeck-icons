import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import * as TablerIcons from "@tabler/icons-react";
import html2canvas from "html2canvas";
import Preview from "~/components/preview/root";
import TextPositionControl, {
  type TextPosition,
} from "~/components/text-position-control/root";
import printStyles from '~/lib/print-styles.css?raw';
import { renderToStaticMarkup } from 'react-dom/server';


const iconNames = Object.keys(TablerIcons).filter((key) =>
  key.startsWith("Icon")
);

const Root: React.FC = () => {
  const [text, setText] = useState("Hello");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [selectedIcon, setSelectedIcon] = useState("IconHome");
  const [textPosition, setTextPosition] =
    useState<TextPosition>("bottom-center");
  const [textScale, setTextScale] = useState(1);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const node = previewRef.current;
    if (!node) return;

    const IconComponent = (TablerIcons as any)[selectedIcon] || TablerIcons.IconQuestionMark;
    const iconHTML = renderToStaticMarkup(<IconComponent size={128} />);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '256px';
    iframe.style.height = '256px';
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

    const textDiv = `<div style="${Object.entries(textStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(';')}"><div>${text}</div></div>`;
    const iconDiv = `<div style="color:${iconColor}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${iconHTML}</div>`;
    const containerDiv = `<div class="streamdeck-icon-print-container" style="${Object.entries(containerStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(';')}">${iconDiv}${textDiv}</div>`;

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
        }).then(canvas => {
            const link = document.createElement("a");
            link.download = "streamdeck-icon.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            document.body.removeChild(iframe);
        }).catch(err => {
            console.error('html2canvas error', err);
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
        width: '256px',
        height: '256px',
        backgroundColor: bg,
        borderRadius: '24px',
      };

      const textStyle: React.CSSProperties = {
        position: "absolute",
        width: "100%",
        padding: "0 20px",
        display: "flex",
        color: textC,
        fontSize: '32px',
        fontWeight: 'bold',
        wordBreak: 'break-word',
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
  }

  const IconComponent = (TablerIcons as any)[selectedIcon];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Stream Deck Icon Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label>Text</label>
                <Input value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div>
                <label>Icon</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>{selectedIcon}</span>
                      <TablerIcons.IconChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="h-64 overflow-y-auto">
                    {iconNames.map((iconName) => (
                      <DropdownMenuItem
                        key={iconName}
                        onSelect={() => setSelectedIcon(iconName)}
                      >
                        {iconName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
              <div>
                <label>Text Color</label>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
              <TextPositionControl
                value={textPosition}
                onValueChange={setTextPosition}
              />
              <div>
                <label>Text Scale</label>
                <Input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={textScale}
                  onChange={(e) => setTextScale(parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 flex flex-col items-center space-y-4">
          <div ref={previewRef}>
            <Preview
              icon={selectedIcon}
              text={text}
              textColor={textColor}
              backgroundColor={backgroundColor}
              iconColor={iconColor}
              textPosition={textPosition}
              textScale={textScale}
            />
          </div>
          <Button onClick={handleDownload}>Download Icon</Button>
        </div>
      </div>
    </div>
  );
};

export default Root;
