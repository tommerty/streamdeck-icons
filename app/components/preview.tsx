import React from "react";
import * as TablerIcons from "@tabler/icons-react";
import { type TextPosition } from "~/components/text-position-control";

interface PreviewProps {
  icon?: string;
  image?: string | null;
  text: string;
  textColor: string;
  backgroundColor: string;
  iconColor: string;
  textPosition: TextPosition;
  textScale: number;
  iconScale: number;
  iconRotation: number;
}

const getPositionStyles = (position: TextPosition): React.CSSProperties => {
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

const Preview: React.FC<PreviewProps> = ({
  icon,
  image,
  text,
  textColor,
  backgroundColor,
  iconColor,
  textPosition,
  textScale,
  iconScale,
  iconRotation,
}) => {
  const IconComponent =
    (icon && (TablerIcons as any)[icon]) || TablerIcons.IconQuestionMark;

  const textStyle = getPositionStyles(textPosition);
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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${iconScale}) rotate(${iconRotation}deg)`,
        }}
      >
        {image ? (
          <img
            src={image}
            alt="Uploaded Icon"
            style={{ width: "128px", height: "auto" }}
          />
        ) : (
          <div style={{ color: iconColor }}>
            <IconComponent size={128} />
          </div>
        )}
      </div>
      <div
        style={{
          ...textStyle,
          color: textColor,
          fontSize: "32px",
          fontWeight: "bold",
          wordBreak: "break-word",
        }}
        className="w-full min-w-full"
      >
        <div>{text}</div>
      </div>
    </div>
  );
};

export default Preview;
