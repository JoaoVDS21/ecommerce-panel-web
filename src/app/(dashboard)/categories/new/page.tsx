'use client';

import { CategoryForm } from '@/components/categories/category-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function newCategoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nova Categoria</h1>
      </div>
      
      <CategoryForm />
    </div>
  );
}
