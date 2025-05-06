'use client';

import { ShelfForm } from '@/components/shelves/shelf-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function newShelfPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/shelves">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nova Prateleira</h1>
      </div>
      
      <ShelfForm />
    </div>
  );
}
