import React from "react";
import * as TablerIcons from "@tabler/icons-react";
import { type TextPosition } from "~/components/text-position-control";
import type { IconLayer, IconPosition } from "~/types/layer";

interface PreviewProps {
  layers: IconLayer[];
  text: string;
  textColor: string;
  backgroundColor: string;
  textPosition: TextPosition;
  textScale: number;
}

const getTextPositionStyles = (position: TextPosition): React.CSSProperties => {
  const styles: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    padding: "0 10px",
    boxSizing: "border-box",
    display: "flex",
    textAlign: "center",
  };

  // Vertical alignment
  if (position.startsWith("top")) {
    styles.top = "20px";
    styles.alignItems = "flex-start";
  } else if (position.startsWith("middle")) {
    styles.top = "50%";
    styles.transform = "translateY(-50%)";
    styles.alignItems = "center";
  } else if (position.startsWith("bottom")) {
    styles.bottom = "20px";
    styles.alignItems = "flex-end";
  }

  // Horizontal alignment
  if (position.endsWith("left")) {
    styles.justifyContent = "flex-start";
    styles.textAlign = "left";
  } else if (position.endsWith("center")) {
    styles.justifyContent = "center";
    styles.textAlign = "center";
  } else if (position.endsWith("right")) {
    styles.justifyContent = "flex-end";
    styles.textAlign = "right";
  }

  return styles;
};

const getIconPositionStyles = (position: IconPosition, offsetX: number = 0, offsetY: number = 0): React.CSSProperties => {
  const styles: React.CSSProperties = {
    position: "absolute",
  };

  // Start with base positions - closer to edges (reduced from 20px to 10px)
  const edgeDistance = 10;

  // Vertical alignment
  if (position.startsWith("top")) {
    styles.top = `${edgeDistance + offsetY}px`;
  } else if (position.startsWith("middle")) {
    styles.top = "50%";
  } else if (position.startsWith("bottom")) {
    styles.bottom = `${edgeDistance - offsetY}px`;
  }

  // Horizontal alignment
  if (position.endsWith("left")) {
    styles.left = `${edgeDistance + offsetX}px`;
  } else if (position.endsWith("center")) {
    styles.left = "50%";
  } else if (position.endsWith("right")) {
    styles.right = `${edgeDistance - offsetX}px`;
  }

  // Center transform for middle positions
  let transformParts = [];
  if (position.startsWith("middle")) {
    transformParts.push(`translateY(calc(-50% + ${offsetY}px))`);
  }
  if (position.endsWith("center")) {
    transformParts.push(`translateX(calc(-50% + ${offsetX}px))`);
  }

  if (transformParts.length > 0) {
    styles.transform = transformParts.join(" ");
  }

  return styles;
};

const Preview: React.FC<PreviewProps> = ({
  layers,
  text,
  textColor,
  backgroundColor,
  textPosition,
  textScale,
}) => {
  const textStyle = getTextPositionStyles(textPosition);
  const scaleTransform = `scale(${textScale})`;
  textStyle.transform = textStyle.transform
    ? `${textStyle.transform} ${scaleTransform}`
    : scaleTransform;

  return (
    <div
      style={{
        width: "256px",
        minWidth: "256px",
        height: "256px",
        backgroundColor,
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Render icon layers */}
      {layers
        .filter((layer) => layer.visible)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((layer) => {
          const IconComponent =
            layer.iconSource === "icon" && (TablerIcons as any)[layer.selectedIcon]
              ? (TablerIcons as any)[layer.selectedIcon]
              : TablerIcons.IconQuestionMark;

          const iconPositionStyle = getIconPositionStyles(layer.position, layer.offsetX, layer.offsetY);
          const iconTransforms = [
            iconPositionStyle.transform || "",
            `scale(${layer.scale})`,
            `rotate(${layer.rotation}deg)`,
          ].filter(Boolean);

          const finalIconStyle = {
            ...iconPositionStyle,
            transform: iconTransforms.join(" "),
            zIndex: layer.zIndex,
          };

          return (
            <div key={layer.id} style={finalIconStyle}>
              {layer.iconSource === "image" && layer.uploadedImage ? (
                <img
                  src={layer.uploadedImage}
                  alt={layer.name}
                  style={{ width: "128px", height: "auto" }}
                />
              ) : (
                <div style={{ color: layer.color }}>
                  <IconComponent size={128} />
                </div>
              )}
            </div>
          );
        })}

      {/* Render text */}
      <div
        style={{
          ...textStyle,
          color: textColor,
          fontSize: "32px",
          fontWeight: "bold",
          wordBreak: "break-word",
          zIndex: 1000, // Keep text on top
        }}
        className="w-full min-w-full"
      >
        <div>{text}</div>
      </div>
    </div>
  );
};

export default Preview;
