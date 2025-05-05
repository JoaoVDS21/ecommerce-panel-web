'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShelfForm } from '@/components/shelves/shelf-form'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { shelfService } from '@/services/shelf-service';
import { Shelf } from '@/types/shelf';

export default function EditShelfPage() {
  const params = useParams();
  const shelfId = params.id as string;
  
  const { data: shelf, isLoading, error } = useQuery<Shelf>({
    queryKey: ['shelf', shelfId],
    queryFn: () => shelfService.get(shelfId),
    enabled: !!shelfId && shelfId !== 'novo',
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
        Erro ao carregar prateleira. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/shelves">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Prateleira</h1>
      </div>
      
      <ShelfForm shelf={shelf} />
    </div>
  );
}