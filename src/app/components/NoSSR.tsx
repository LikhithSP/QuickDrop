'use client';

import { useEffect, useState, ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
}

export default function NoSSR({ children }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null; // Return empty during SSR
  }
  
  return <>{children}</>; // Render children once mounted on client
}
