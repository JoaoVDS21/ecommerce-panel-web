'use client';

import BannerForm from '@/components/banners/banner-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function newBannerPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/banners">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Novo Banner</h1>
      </div>
      
      <BannerForm params={{id: 'new'}}/>
    </div>
  );
}
