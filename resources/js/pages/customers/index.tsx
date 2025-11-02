import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Pencil, Trash2, Plus, Users, ExternalLink, Phone, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Customer {
    id: number;
    name: string;
    rfc: string;
    address?: string;
    phone?: string;
    website?: string;
}

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

interface CustomersProps {
    customers: PaginatedCustomers;
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/customers',
    },
];

export default function Customers({ customers: paginatedCustomers, success }: CustomersProps) {
    const customers = paginatedCustomers.data;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        rfc: '',
        address: '',
        phone: '',
        website: '',
    });

    const openCreateDialog = () => {
        setEditingCustomer(null);
        setFormData({
            name: '',
            rfc: '',
            address: '',
            phone: '',
            website: '',
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            rfc: customer.rfc,
            address: customer.address || '',
            phone: customer.phone || '',
            website: customer.website || '',
        });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (customer: Customer) => {
        setCustomerToDelete(customer);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            router.put(`/customers/${editingCustomer.id}`, formData, {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            router.post('/customers', formData, {
                onSuccess: () => setIsDialogOpen(false),
            });
        }
    };

    const handleDelete = () => {
        if (customerToDelete) {
            router.delete(`/customers/${customerToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setCustomerToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
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
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle className="text-xl">Usuarios</CardTitle>
                                    <CardDescription className="mt-1">
                                        Gestiona los usuarios registrados
                                    </CardDescription>
                                </div>
                            </div>
                            <Button onClick={openCreateDialog} size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Nuevo
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">

                        {!customers || customers.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Users className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium mb-1">No hay usuarios registrados</p>
                                <p className="text-xs text-muted-foreground mb-3">Agrega tu primer usuario</p>
                                <Button onClick={openCreateDialog} size="sm">
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Agregar Usuario
                                </Button>
                            </div>
                        ) : (
                    <>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Nombre</TableHead>
                                    <TableHead className="w-[120px]">RFC</TableHead>
                                    <TableHead className="w-[180px]">Dirección</TableHead>
                                    <TableHead className="w-[110px]">Teléfono</TableHead>
                                    <TableHead className="w-[100px]">Web</TableHead>
                                    <TableHead className="w-[140px] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {customer.rfc}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{customer.address || '-'}</TableCell>
                                        <TableCell className="text-sm">
                                            {customer.phone ? (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    <span>{customer.phone}</span>
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {customer.website ? (
                                                <a
                                                    href={customer.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Link
                                                </a>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-row gap-1 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(customer)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(customer)}
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
                    {paginatedCustomers.last_page > 1 && (
                        <div className="flex flex-row items-center justify-between mt-3">
                            <div className="text-xs text-muted-foreground">
                                {customers.length} de {paginatedCustomers.total} usuarios
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(`/customers?page=${paginatedCustomers.current_page - 1}`)}
                                    disabled={paginatedCustomers.current_page === 1}
                                >
                                    Anterior
                                </Button>
                                <span className="text-xs">
                                    Pág. {paginatedCustomers.current_page} / {paginatedCustomers.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(`/customers?page=${paginatedCustomers.current_page + 1}`)}
                                    disabled={paginatedCustomers.current_page === paginatedCustomers.last_page}
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
                                {editingCustomer ? (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Editar Usuario
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Nuevo Usuario
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCustomer
                                    ? 'Modifica la información del usuario'
                                    : 'Completa los datos del nuevo usuario'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-sm">Nombre *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nombre completo"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="rfc" className="text-sm">RFC *</Label>
                                    <Input
                                        id="rfc"
                                        placeholder="XAXX010101000"
                                        value={formData.rfc}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rfc: e.target.value.toUpperCase(),
                                            })
                                        }
                                        maxLength={13}
                                        className="font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="address" className="text-sm">Dirección</Label>
                                    <Input
                                        id="address"
                                        placeholder="Calle, número, colonia"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-sm">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="5512345678"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="website" className="text-sm">Sitio Web</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://ejemplo.com"
                                        value={formData.website}
                                        onChange={(e) =>
                                            setFormData({ ...formData, website: e.target.value })
                                        }
                                    />
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
                                        {editingCustomer ? 'Guardar' : 'Crear'}
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
                                ¿Eliminar usuario?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás a punto de eliminar a <strong>{customerToDelete?.name}</strong>.
                                Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex flex-row gap-2 w-full sm:w-auto">
                                <AlertDialogCancel onClick={() => setCustomerToDelete(null)}>
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
