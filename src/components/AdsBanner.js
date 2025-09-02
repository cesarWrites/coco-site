'use client'; // Optional for Next.js App Router (use only if needed)

import { useEffect } from 'react';

export default function AdsBanner() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Adsense error:', e);
      }
    }
  }, []);

  return (
    <div className="my-4 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXX"  // <-- Replace with your actual client ID
        data-ad-slot="YYYYYYY"           // <-- Replace with your actual ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
