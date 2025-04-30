'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/categories/category-form'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category-service';
import { Category } from '@/types/category';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  
  const { data: category, isLoading, error } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoryService.get(categoryId),
    enabled: !!categoryId && categoryId !== 'novo',
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
        Erro ao carregar produto. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Categoria</h1>
      </div>
      
      <CategoryForm category={category} />
    </div>
  );
}