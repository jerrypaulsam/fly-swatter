'use client';

import { useEffect } from 'react';

type AdUnitProps = {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layout?: string;
};

export default function AdUnit({ slotId, format = 'auto', layout }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error', err);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center my-4">
      <div className="overflow-hidden border border-gray-200 bg-gray-50 min-h-[100px] w-full flex justify-center relative">
        <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="pub-2145921063892640" /* REPLACE WITH YOUR ID */
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
            data-ad-layout={layout}
        />
        <span className="text-[10px] text-gray-400 absolute bottom-0 right-1 bg-white px-1">Advertisement</span>
      </div>
    </div>
  );
}