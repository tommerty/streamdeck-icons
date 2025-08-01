export type IconPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface IconLayer {
  id: string;
  name: string;
  iconSource: "icon" | "image";
  selectedIcon: string;
  uploadedImage: string | null;
  color: string;
  scale: number;
  rotation: number;
  position: IconPosition;
  offsetX: number; // Fine-tune horizontal position (-100 to 100)
  offsetY: number; // Fine-tune vertical position (-100 to 100)
  visible: boolean;
  zIndex: number;
}

export const createDefaultLayer = (id: string, name: string): IconLayer => ({
  id,
  name,
  iconSource: "icon",
  selectedIcon: "IconHome",
  uploadedImage: null,
  color: "#ffffff",
  scale: 1,
  rotation: 0,
  position: "middle-center",
  offsetX: 0,
  offsetY: 0,
  visible: true,
  zIndex: 0,
});
