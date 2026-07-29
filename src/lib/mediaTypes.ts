/**
 * What Sam actually shoots, and what the browser can show.
 *
 * His drive holds JPEGs alongside Canon RAW (.cr2/.cr3), edit masters
 * (.tif/.psd) and video (.mp4/.mov). All of those are deliverable to a client,
 * but only some can be rendered in a browser — RAW and PSD cannot, so they are
 * listed with a file card rather than a broken <img>.
 *
 * Deliberately excluded: .cos/.cop/.cof/.cot, which are Canon DPP sidecar
 * recipes rather than photographs, and would otherwise be uploaded in bulk.
 */

/** Renders in an <img> tag. */
export const PREVIEWABLE_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

/** Renders in a <video> tag. */
export const VIDEO_EXTS = [".mp4", ".mov", ".m4v", ".webm"];

/** Deliverable, but no browser preview — shown as a file card. */
export const NON_PREVIEW_EXTS = [
  ".cr2", ".cr3", ".nef", ".arw", ".raf", ".orf", ".dng", // camera RAW
  ".tif", ".tiff", ".psd", ".heic", ".heif",
];

export const ALL_UPLOAD_EXTS = [
  ...PREVIEWABLE_IMAGE_EXTS,
  ...VIDEO_EXTS,
  ...NON_PREVIEW_EXTS,
];

const extOf = (name: string) => {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
};

/**
 * Browsers report an empty MIME type for RAW files, so acceptance is decided by
 * extension. Matching on `file.type` alone silently dropped every .cr2.
 */
export const isAcceptedUpload = (fileName: string) =>
  ALL_UPLOAD_EXTS.includes(extOf(fileName));

export const isVideo = (fileName: string) => VIDEO_EXTS.includes(extOf(fileName));

export const isPreviewableImage = (fileName: string) =>
  PREVIEWABLE_IMAGE_EXTS.includes(extOf(fileName));

/** react-dropzone accept map. Empty-string keys cover types the browser can't name. */
export const DROPZONE_ACCEPT: Record<string, string[]> = {
  "image/*": [...PREVIEWABLE_IMAGE_EXTS, ".heic", ".heif", ".tif", ".tiff"],
  "video/*": VIDEO_EXTS,
  // RAW and PSD have no reliable MIME type, so they are matched by extension.
  "application/octet-stream": [
    ".cr2", ".cr3", ".nef", ".arw", ".raf", ".orf", ".dng", ".psd",
  ],
};
