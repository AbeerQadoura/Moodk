
import React, { useEffect } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot, format = 'auto', className = '', label = true }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      {label && (
        <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">
          Space Sponsored by Partners
        </span>
      )}
      <div className="w-full overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 min-h-[90px] flex items-center justify-center">
        {/* AdSense Code Placeholder */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-0000000000000000" // Replace with actual ID
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
