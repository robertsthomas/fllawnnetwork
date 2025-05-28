'use client';

import { useEffect } from 'react';
import { Card } from '~/components/ui/card';

export default function GoogleAdCard() {
  useEffect(() => {
    try {
      // Load the AdSense script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8923397311432151';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Initialize the ad
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading AdSense:', error);
    }
  }, []);

  return (
    <Card className="h-full overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="+2t+rl+2h-1m-4u"
        data-ad-client="ca-pub-8923397311432151"
        data-ad-slot="3056933785"
      />
    </Card>
  );
} 