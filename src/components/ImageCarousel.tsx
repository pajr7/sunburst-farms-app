"use client";

import { useState, useRef, useCallback } from "react";

interface CarouselImage {
  image_url: string;
  position: number;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  title: string;
  showCounter?: boolean;
}

export default function ImageCarousel({ images, title, showCounter = false }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(index, sorted.length - 1)));
  }, [sorted.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    touchDeltaX.current = dx;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    const threshold = 40;
    if (touchDeltaX.current < -threshold) {
      setCurrent((c) => Math.min(c + 1, sorted.length - 1));
    } else if (touchDeltaX.current > threshold) {
      setCurrent((c) => Math.max(c - 1, 0));
    }
    touchDeltaX.current = 0;
    isSwiping.current = false;
  }, [sorted.length]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (sorted.length <= 1) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      goTo(current - 1);
    } else {
      goTo(current + 1);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [current, goTo, sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <div
      className="relative w-full aspect-square overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={sorted.length > 1 ? handleClick : undefined}
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {sorted.map((img, i) => (
          <img
            key={img.image_url}
            src={img.image_url}
            alt={`${title} ${i + 1}`}
            className="w-full h-full object-cover shrink-0"
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>

      {sorted.length > 1 && (
        <>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {sorted.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: i === current ? "white" : "rgba(255,255,255,0.5)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>

          {showCounter && (
            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
            >
              {current + 1}/{sorted.length}
            </div>
          )}

          {current > 0 && (
            <div
              className="flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full items-center justify-center cursor-pointer"
              style={{ background: "rgba(255,255,255,0.85)" }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(current - 1); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </div>
          )}
          {current < sorted.length - 1 && (
            <div
              className="flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full items-center justify-center cursor-pointer"
              style={{ background: "rgba(255,255,255,0.85)" }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(current + 1); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}
