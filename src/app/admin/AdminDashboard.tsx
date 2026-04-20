'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Project saved successfully');
      
      // Clear the query parameter without adding to history
      const newPath = window.location.pathname;
      router.replace(newPath);
    }
  }, [searchParams, router]);

  return null;
}
