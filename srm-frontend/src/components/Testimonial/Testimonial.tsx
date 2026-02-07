'use client';

import Image from 'next/image';
import './Testimonial.scss';

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
  imageUrl?: string;
}

export default function Testimonial({
  quote,
  author,
  company,
  imageUrl,
}: TestimonialProps) {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">{quote}</p>
      <div className="testimonial-footer">
        {imageUrl && (
          <div className="testimonial-avatar">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={author}
              width={40}
              height={40}
              priority
            />
          </div>
        )}
        <div className="testimonial-info">
          <div className="testimonial-author">{author}</div>
          <div className="testimonial-company">{company}</div>
        </div>
      </div>
    </div>
  );
}
