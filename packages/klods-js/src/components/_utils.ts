// Internal utilities shared across component builders. Not exported from the public API.

// Converts a label string to a stable, URL-safe id segment.
// "Email address" → "email-address", "First name" → "first-name"
// Falls back to a djb2 hash when the label produces no alphanumeric slug
// (e.g. empty string or all-symbol text), keeping IDs deterministic.
export function slugId(prefix: string, text: string): string {
  const safe = text ?? "";
  const slug = safe
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug) return `${prefix}-${slug}`;
  let h = 5381;
  for (let i = 0; i < safe.length; i++) h = ((h << 5) + h + safe.charCodeAt(i)) | 0;
  return `${prefix}-${(h >>> 0).toString(36)}`;
}
