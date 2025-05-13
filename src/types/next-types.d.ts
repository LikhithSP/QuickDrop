// Types for Next.js 15 dynamic route params
declare module 'next' {
  export interface PageProps {
    params?: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[]>;
  }
}
