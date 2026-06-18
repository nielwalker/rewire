export type AppStatus =
  | "idle"
  | "image-detected"
  | "reading"
  | "decoded"
  | "generating"
  | "ready"
  | "no-qr"
  | "error";

export type ProcessedImage = {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
};

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};
