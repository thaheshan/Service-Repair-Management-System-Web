'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './ImageCarousel.scss';

interface CarouselSlide {
  id: string;
  imageUrl: string;
  alt: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
}

export default function ImageCarousel({
  slides,
  autoplay = true,
  interval = 5000,
}: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoplay || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  if (slides.length === 0) return null;

  const goToSlide = (index: number) => {
    setCurrentSlide(index % slides.length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-track">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <Image
                src={slide.imageUrl || "/placeholder.svg"}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="carousel-image"
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}
    </div>
  );
}
