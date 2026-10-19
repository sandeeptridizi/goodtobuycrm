import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';
// Initializes firebase-admin with serviceAccountKey.json. That service account has
// Storage Object Admin on the GCS bucket, so no separate key is needed.
import '../db/index.js';

const DATA_URL_PATTERN = /^data:(image\/(jpeg|jpg|png|webp|heic|heif|gif));base64,(.+)$/;

function getBucket() {
  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME is not set in backend/.env');
  }
  return getStorage().bucket(bucketName);
}

export class InvalidImageError extends Error {}

// Uploads a base64 data URL (what FileReader.readAsDataURL produces) to the
// bucket and returns its public URL. Anything that is already a URL is returned
// unchanged, so edits that resend existing images don't re-upload them, and old
// records that still hold base64 aren't touched until they are re-saved.
export async function uploadImage(image: string, folder: string): Promise<string> {
  if (/^https?:\/\//.test(image)) return image;

  const match = image.match(DATA_URL_PATTERN);
  if (!match) throw new InvalidImageError('Invalid image data');

  const [, contentType, ext, base64] = match;
  const fileName = `${folder}/${Date.now()}-${randomUUID()}.${ext === 'jpeg' ? 'jpg' : ext}`;
  const bucket = getBucket();

  await bucket.file(fileName).save(Buffer.from(base64, 'base64'), {
    contentType,
    resumable: false,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export function uploadImages(images: unknown, folder: string): Promise<string[]> {
  if (!Array.isArray(images)) return Promise.resolve([]);
  return Promise.all(images.map((img) => uploadImage(String(img), folder)));
}
