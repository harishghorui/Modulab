'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface ProjectDetailProps {
  description: string;
}

export default function ProjectDetail({ description }: ProjectDetailProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // Sanitize HTML on the client side to avoid hydration mismatch 
    // and ensure security
    setSanitizedHtml(DOMPurify.sanitize(description));
  }, [description]);

  return (
    <div 
      className="prose prose-blue dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
