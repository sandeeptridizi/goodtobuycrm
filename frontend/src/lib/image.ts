const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Downscales a photo to at most 1920px on its longest side and re-encodes it as
// JPEG, turning a 4-8 MB phone photo into a few hundred KB so several fit in one
// request. Falls back to the original file if the browser can't decode it (e.g.
// HEIC on desktop Chrome).
export async function compressImage(file: File): Promise<string> {
  const original = await readAsDataURL(file);

  try {
    const img = new Image();
    img.src = original;
    await img.decode();

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    return compressed.length < original.length ? compressed : original;
  } catch {
    return original;
  }
}
