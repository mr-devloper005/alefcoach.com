"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContentImage } from "@/components/shared/content-image";

type LightboxImageProps = {
  src: string;
  alt: string;
  hint?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  quality?: number;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
  priority?: boolean;
};

export function LightboxImage({
  src,
  alt,
  hint = "Click to enlarge",
  className,
  imageClassName,
  sizes,
  quality,
  intrinsicWidth,
  intrinsicHeight,
  priority,
}: LightboxImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group relative block h-full w-full cursor-zoom-in overflow-hidden ${className || ""}`}
          aria-label={`Open image: ${alt}`}
        >
          <ContentImage
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            className={imageClassName}
            intrinsicWidth={intrinsicWidth}
            intrinsicHeight={intrinsicHeight}
            priority={priority}
          />
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white opacity-0 transition duration-200 group-hover:opacity-100">
            {hint}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-5xl border-0 bg-black/95 p-3 shadow-2xl sm:p-4"
        showCloseButton
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
          <ContentImage
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            quality={90}
            className="object-contain"
            intrinsicWidth={1920}
            intrinsicHeight={1200}
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
