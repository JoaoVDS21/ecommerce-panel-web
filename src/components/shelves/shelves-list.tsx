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
import { Shelf } from '@/types/shelf'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shelfService } from '@/services/shelf-service';
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

interface ShelfListProps {
  shelves: Shelf[];
}

export function ShelvesList({ shelves }: ShelfListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [shelfToDelete, setShelfToDelete] = useState<string | number | null>(null);

  const { mutate: deleteShelf } = useMutation({
    mutationFn: (id: string | number) => shelfService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
      toast.success('Prateleira excluída', {
        description: 'A prateleira foi excluída com sucesso.'
      });
      setShelfToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir', {
        description: 'Não foi possível excluir a prateleira.'
      });
    },
  });

  const handleDelete = (id: string | number) => {
    setShelfToDelete(id);
  };

  const confirmExclude = () => {
    if (shelfToDelete) {
      deleteShelf(shelfToDelete);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead className='w-24'>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shelves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum prateleira encontrada.
                </TableCell>
              </TableRow>
            ) : (
              shelves.map((shelf) => (
                <TableRow key={shelf.id}>
                  <TableCell>{shelf.title}</TableCell>
                  <TableCell>{shelf.position}</TableCell>
                  <TableCell>
                    <Badge variant={shelf.isActive ? "default" : "outline"}>
                      {shelf.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/shelves/${shelf.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(shelf.id)}
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

      <AlertDialog open={!!shelfToDelete} onOpenChange={(open: boolean) => !open && setShelfToDelete(null)}>
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