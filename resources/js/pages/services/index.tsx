import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Pencil, Trash2, Plus, FileText, CheckCircle, AlertTriangle, FilePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ServicesProps {
    posts: PaginatedPosts;
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/services',
    },
];

export default function Services({ posts: paginatedPosts, success }: ServicesProps) {
    const posts = paginatedPosts?.data || [];
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
    });

    const openCreateDialog = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            body: '',
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            body: post.body,
        });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (post: Post) => {
        setPostToDelete(post);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentPage = paginatedPosts?.current_page || 1;
        
        if (editingPost) {
            router.put(`/services/${editingPost.id}`, {
                ...formData,
                userId: editingPost.userId,
                page: currentPage,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        } else {
            router.post('/services', {
                ...formData,
                userId: 1,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                },
            });
        }
    };

    const handleDelete = () => {
        if (postToDelete) {
            const currentPage = paginatedPosts?.current_page || 1;
            router.delete(`/services/${postToDelete.id}`, {
                data: { page: currentPage },
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setPostToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios - Publicaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                {success && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-400">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}
                
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle className="text-xl">Publicaciones</CardTitle>
                                    <CardDescription className="mt-1">
                                        Gestiona publicaciones desde JSONPlaceholder
                                    </CardDescription>
                                </div>
                            </div>
                            <Button onClick={openCreateDialog} size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Nueva
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">

                        {posts.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium mb-1">No hay publicaciones</p>
                                <p className="text-xs text-muted-foreground mb-3">Crea tu primera publicación</p>
                                <Button onClick={openCreateDialog} size="sm">
                                    <FilePlus className="h-4 w-4 mr-1" />
                                    Agregar Publicación
                                </Button>
                            </div>
                        ) : (
                        <>
                        <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">ID</TableHead>
                                <TableHead className="w-[250px]">Título</TableHead>
                                <TableHead>Contenido</TableHead>
                                <TableHead className="w-[140px] text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            #{post.id}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">{post.title}</TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-muted-foreground text-xs">
                                            {post.body}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditDialog(post)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteDialog(post)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                        </div>
                
                        {/* Paginación */}
                        {paginatedPosts && paginatedPosts.last_page > 1 && (
                    <div className="flex flex-row items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                            {posts.length} de {paginatedPosts.total} publicaciones
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(`/services?page=${paginatedPosts.current_page - 1}`)}
                                disabled={paginatedPosts.current_page === 1}
                            >
                                Anterior
                            </Button>
                            <span className="text-xs">
                                Pág. {paginatedPosts.current_page} / {paginatedPosts.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(`/services?page=${paginatedPosts.current_page + 1}`)}
                                disabled={paginatedPosts.current_page === paginatedPosts.last_page}
                            >
                                Siguiente
                            </Button>
                        </div>
                        </div>
                        )}
                        </>
                        )}
                    </CardContent>
                </Card>

                {/* Modal Crear/Editar */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {editingPost ? (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Editar Publicación
                                    </>
                                ) : (
                                    <>
                                        <FilePlus className="h-4 w-4" />
                                        Nueva Publicación
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {editingPost
                                    ? 'Modifica la información de la publicación'
                                    : 'Completa los datos de la nueva publicación'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className="text-sm">Título *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Título descriptivo"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="body" className="text-sm">Contenido *</Label>
                                    <Textarea
                                        id="body"
                                        placeholder="Escribe el contenido..."
                                        value={formData.body}
                                        onChange={(e) =>
                                            setFormData({ ...formData, body: e.target.value })
                                        }
                                        required
                                        rows={5}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.body.length} caracteres
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <div className="flex flex-row gap-2 w-full sm:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        {editingPost ? 'Guardar' : 'Crear'}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Confirmar Eliminación */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                ¿Eliminar publicación?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás a punto de eliminar la publicación <strong>"{postToDelete?.title}"</strong>.
                                Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex flex-row gap-2 w-full sm:w-auto">
                                <AlertDialogCancel onClick={() => setPostToDelete(null)}>
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Eliminar
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
