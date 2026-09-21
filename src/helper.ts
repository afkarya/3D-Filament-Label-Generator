export function showUserError(message: string) {
  alert(message);
}

/**
 * Converts a PNG/JPEG data URL into a pure black version for printing:
 * any baked-in background colour (detected from the logo border) is
 * removed and every remaining pixel is turned opaque black. Logos with a
 * transparent background keep their shape as solid black. Returns the
 * original URL if conversion is not possible.
 */
export async function logoToBlack(dataUrl: string): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.addEventListener("load", () => resolve());
    img.addEventListener("error", () =>
      reject(new Error("Failed to load logo image")),
    );
    img.src = dataUrl;
  });

  const width = img.width;
  const height = img.height;
  if (!width || !height) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0);
  const pixelData = ctx.getImageData(0, 0, width, height);
  const data = pixelData.data;

  // ---- Detect a baked-in background from the border pixels ----
  const borderR: number[] = [];
  const borderG: number[] = [];
  const borderB: number[] = [];
  let borderOpaque = 0;
  let borderTotal = 0;
  const sample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    borderTotal++;
    if (data[i + 3] === 0) return;
    borderOpaque++;
    borderR.push(data[i]);
    borderG.push(data[i + 1]);
    borderB.push(data[i + 2]);
  };
  for (let x = 0; x < width; x++) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    sample(0, y);
    sample(width - 1, y);
  }

  const median = (values: number[]) => {
    values.sort((a, b) => a - b);
    return values[values.length / 2];
  };

  // If most of the border is opaque, assume that colour is the background.
  const hasBackground =
    borderOpaque > 0 && borderOpaque / borderTotal > 0.7;
  const bg = hasBackground
    ? { r: median(borderR), g: median(borderG), b: median(borderB) }
    : null;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;

    if (bg) {
      const dr = data[i] - bg.r;
      const dg = data[i + 1] - bg.g;
      const db = data[i + 2] - bg.b;
      const distance =
        Math.sqrt(dr * dr + dg * dg + db * db) / (255 * Math.sqrt(3));
      if (distance < 0.4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }
    }

    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 255;
  }

  ctx.putImageData(pixelData, 0, 0);
  return canvas.toDataURL("image/png");
}