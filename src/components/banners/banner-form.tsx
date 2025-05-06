'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Upload } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { bannerService } from '@/services/banner-service'
import { BannerFormData } from '@/types/banner'
import { toast } from 'sonner'
import { Label } from '../ui/label'

// Tipo de dados para o banner
interface Banner {
  id: string
  title: string
  position: number
  isActive: boolean
}

// Schema de validação do formulário
const bannerSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  position: z.coerce.number().int().positive({ message: 'Posição deve ser um número positivo' }),
  isActive: z.boolean()
})

type BannerFormValues = z.infer<typeof bannerSchema>

export default function BannerForm({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()
  const [imageFile, setImageFile] = useState<Blob | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isNew = id === 'new'

  // Buscar dados do banner para edição
  const { data: banner, isLoading } = useQuery({
    queryKey: ['banner', id],
    queryFn: () => bannerService.get(id),
    enabled: !isNew
  })

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      position: 1,
      isActive: true
    }
  })

  // Atualizar formulário quando os dados do banner são carregados
  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        position: banner.position,
        isActive: banner.isActive
      })
      setImagePreview(banner.imageUrl)
    }
  }, [banner, form])

  // Mutação para criar ou atualizar o banner
  const { mutate: saveBanner, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      if (banner?.id) {
        return bannerService.update(banner.id, data);
      } else {
        return bannerService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(banner ? 'Banner atualizado' : 'Banner criado', {
        description: banner 
          ? 'O banner foi atualizado com sucesso.' 
          : 'O banner foi criado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      router.push('/dashboard/banners');
    },
    onError: (error) => {
      console.error('Erro ao salvar banner:', error);
      toast.error('Erro ao salvar', {
        description: 'Ocorreu um erro ao salvar o banner.'
      });
    },
  });

  // Manipular envio do formulário
  const onSubmit = (values: BannerFormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => formData.append(key, value?.toString() || ''));

    const imageFileTreated = imageFile
      ? imageFile
      : !imageFile && imagePreview
        ? undefined
        : '';
        
    imageFileTreated !== undefined && formData.append('image', imageFileTreated);
    
    saveBanner(formData)
  }

  // Simular upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    setImageFile(file || null)
    setImagePreview(file ? URL.createObjectURL(file) : '')
  }

  const goBack = () => {
    router.push('/dashboard/banners')
  }

  return (
    <div className="container">
      {isLoading ? (
        <div>Carregando dados do banner...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do banner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-2'>
                  <Label>Imagem</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                        id="image-upload"
                      />
                    </div>
                    
                    {imagePreview && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="relative h-40 w-full">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {!imagePreview && (
                      <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p>Faça upload de uma imagem para o banner</p>
                      </div>
                    )}
                    <FormMessage />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posição</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Status</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Banner está ativo para exibição?
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={goBack}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                  >
                    {isPending ? 'Salvando...' : 'Salvar Banner'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}