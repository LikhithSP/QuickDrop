// This function is required for static export with dynamic routes
export function generateStaticParams() {
  // Since files are generated dynamically, we return an empty array
  // The actual files will be handled by Netlify's dynamic paths
  return [];
}
