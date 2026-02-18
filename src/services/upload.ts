import { getStoredToken } from "./api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Static assets might be served from a different base (without /api)
const STATIC_BASE_URL = import.meta.env.VITE_STATIC_BASE_URL || BASE_URL?.replace('/api', '') || '';

// Helper function to normalize image URLs
export const getImageUrl = (url: string): string => {
  if (!url) return "";
  
  // If it's already a full URL (http:// or https://), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If the URL contains /uploads/, it's likely a static file path
  // Static files are usually served from root, not /api
  if (url.includes('/uploads/')) {
    const staticBase = STATIC_BASE_URL?.endsWith("/") ? STATIC_BASE_URL.slice(0, -1) : STATIC_BASE_URL;
    
    // Remove /api from the path if it's present (e.g., /api/uploads/ -> /uploads/)
    let cleanPath = url.startsWith("/api/") ? url.replace("/api", "") : url;
    
    // Ensure path starts with /
    if (!cleanPath.startsWith("/")) {
      cleanPath = `/${cleanPath}`;
    }
    
    return `${staticBase}${cleanPath}`;
  }
  
  // For other paths, use BASE_URL (with /api)
  const baseUrl = BASE_URL?.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  
  // If it starts with /, it's a relative path from root - prepend BASE_URL
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }
  
  // Otherwise, assume it's a relative path and prepend BASE_URL with /
  return `${baseUrl}/${url}`;
};

export const uploadSingleImage = async (
  section: string,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const headers: Record<string, string> = {};
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${BASE_URL}/upload/${section}/single`,
    {
      method: "POST",
      headers,
      body: formData
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  console.log("Upload API response:", data); // Debug: see what API returns
  console.log("Original URL from API:", data.url); // Debug: see original URL
  
  // Normalize the URL before returning
  const normalizedUrl = getImageUrl(data.url);
  console.log("Normalized URL:", normalizedUrl); // Debug: see final URL
  return normalizedUrl;
};
