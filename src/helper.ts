export function showUserError(message: string) {
  alert(message);
}

/**
 * Converts a PNG/JPEG data URL into a pure black version, keeping the
 * original transparency: dark pixels become black, light pixels become
 * transparent. Returns the original URL if conversion is not possible.
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

  const threshold = 130;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    const luminance =
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = luminance < threshold ? alpha : 0;
  }

  ctx.putImageData(pixelData, 0, 0);
  return canvas.toDataURL("image/png");
}
