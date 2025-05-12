// This function is required for static export with dynamic routes
export function generateStaticParams() {
  // Since texts are generated dynamically, we return an empty array
  // The actual routes will be handled by Netlify's dynamic paths
  return [];
}
