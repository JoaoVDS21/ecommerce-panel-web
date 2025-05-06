'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BannerForm from '@/components/banners/banner-form'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/banner-service';
import { Banner } from '@/types/banner';

export default function EditBannerPage() {
  const params = useParams();
  const bannerId = params.id as string;
  
  const { data: banner, isLoading, error } = useQuery<Banner>({
    queryKey: ['banner', bannerId],
    queryFn: () => bannerService.get(bannerId),
    enabled: !!bannerId && bannerId !== 'novo',
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-700">
        Erro ao carregar banner. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/banners">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Banner</h1>
      </div>
      
      <BannerForm params={{id: bannerId}} />
    </div>
  );
}