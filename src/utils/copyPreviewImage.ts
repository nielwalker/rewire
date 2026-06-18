function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load preview image."));
    image.src = src;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth || !line) {
      line = nextLine;
      continue;
    }

    lines.push(line);
    line = word;
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function measureParagraphHeight(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
) {
  return wrapText(context, text, maxWidth).length * lineHeight;
}

function drawParagraph(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  for (const line of wrapText(context, text, maxWidth)) {
    context.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Unable to create preview image."));
    }, "image/png");
  });
}

export async function copyPreviewImage(element: HTMLDivElement): Promise<void> {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("Image clipboard copying is not supported in this browser.");
  }

  const rect = element.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const scale = Math.max(window.devicePixelRatio || 1, 3);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create preview canvas.");
  }

  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);

  const background = await loadImage("/dc.png");
  const qrImage = element.querySelector("img");
  const qr = qrImage?.src ? await loadImage(qrImage.src) : null;
  const paragraphs = Array.from(element.querySelectorAll("p"));
  const [title, description, warning] = paragraphs.map((paragraph) => paragraph.textContent?.trim() || "");

  drawCoverImage(context, background, width, height);
  context.fillStyle = "rgba(2, 6, 23, 0.45)";
  context.fillRect(0, 0, width, height);

  const padding = 16;
  const qrSize = 245;
  const gap = 16;
  const textX = padding;
  const textMaxWidth = Math.max(180, width - padding * 2 - gap - qrSize);
  const qrX = width - padding - qrSize;
  const qrY = (height - qrSize) / 2;

  context.fillStyle = "#ffffff";
  context.fillRect(qrX, qrY, qrSize, qrSize);

  if (qr) {
    context.drawImage(qr, qrX, qrY, qrSize, qrSize);
  }

  context.textBaseline = "top";

  context.font = '600 24px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  const titleHeight = measureParagraphHeight(context, title, textMaxWidth, 30);
  context.font = '16px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  const descriptionHeight = measureParagraphHeight(context, description, textMaxWidth, 24);
  context.font = 'italic 13px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  const warningHeight = measureParagraphHeight(context, warning, textMaxWidth, 24);
  const textBlockHeight = titleHeight + 8 + descriptionHeight + 8 + warningHeight;
  let y = Math.max(padding, (height - textBlockHeight) / 2);

  context.fillStyle = "#f1f5f9";
  context.font = '600 24px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  y = drawParagraph(context, title, textX, y, textMaxWidth, 30);

  y += 8;
  context.fillStyle = "#cbd5e1";
  context.font = '16px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  y = drawParagraph(context, description, textX, y, textMaxWidth, 24);

  y += 8;
  context.fillStyle = "#ef4444";
  context.font = 'italic 13px "gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif';
  drawParagraph(context, warning, textX, y, textMaxWidth, 24);

  const blob = await canvasToBlob(canvas);
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
