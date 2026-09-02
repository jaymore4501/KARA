/**
 * Utility helper to resolve image and static asset paths across local dev and GitHub Pages subpaths.
 */
export function getAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // Detect GitHub Actions or production environment or client pathname subpath
  let basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!basePath && typeof window !== "undefined" && window.location.pathname.startsWith("/KARA")) {
    basePath = "/KARA";
  }
  
  return `${basePath}${cleanPath}`;
}
