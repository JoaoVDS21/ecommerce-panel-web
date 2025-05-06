'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Banner } from '@/types/banner'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '@/services/banner-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import Image from 'next/image';

interface BannerListProps {
  banners: Banner[];
}

export function BannersList({ banners }: BannerListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bannerToDelete, setBannerToDelete] = useState<string | number | null>(null);

  const { mutate: deleteBanner } = useMutation({
    mutationFn: (id: string | number) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner excluído', {
        description: 'O banner foi excluído com sucesso.'
      });
      setBannerToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir', {
        description: 'Não foi possível excluir o banner.'
      });
    },
  });

  const handleDelete = (id: string | number) => {
    setBannerToDelete(id);
  };

  const confirmExclude = () => {
    if (bannerToDelete) {
      deleteBanner(bannerToDelete);
    }
  };

  // Redirecionar para a tela de edição
  const handleRowClick = (id: number) => {
    router.push(`/dashboard/banners/${id}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Preview</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="w-24">Posição</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum banner encontrado.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow 
                  key={banner.id} 
                  onClick={() => handleRowClick(banner.id)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>
                    <div className="relative w-16 h-10 rounded-md overflow-hidden">
                      <Image
                        src={banner.imageUrl} 
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>{banner.position}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "outline"}>
                      {banner.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/banners/${banner.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!bannerToDelete} onOpenChange={(open: boolean) => !open && setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir prateleira</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta prateleira? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExclude} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}