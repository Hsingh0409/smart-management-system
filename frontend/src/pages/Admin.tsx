import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI, Sweet } from '@/services/api';
import CreateSweetForm from '@/components/CreateSweetForm';
import EditSweetDialog from '@/components/EditSweetDialog';
import RestockDialog from '@/components/RestockDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Package, Loader2 } from 'lucide-react';

export default function Admin() {
    const queryClient = useQueryClient();
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);

    const { data: sweets, isLoading } = useQuery({
        queryKey: ['sweets'],
        queryFn: sweetsAPI.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: sweetsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
                <p className="text-muted-foreground">
                    Manage your sweet shop inventory
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <CreateSweetForm />
                </div>

                <div>
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-2xl font-bold mb-4">Manage Sweets</h2>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : sweets && sweets.length > 0 ? (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {sweets.map((sweet) => (
                                        <div
                                            key={sweet._id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{sweet.name}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                                    <span>{sweet.category}</span>
                                                    <span>${sweet.price.toFixed(2)}</span>
                                                    <span className={sweet.quantity === 0 ? 'text-red-500 font-medium' : ''}>
                                                        Stock: {sweet.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setRestockingSweet(sweet)}
                                                    title="Restock"
                                                >
                                                    <Package className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setEditingSweet(sweet)}
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDelete(sweet._id, sweet.name)}
                                                    disabled={deleteMutation.isPending}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    No sweets yet. Create your first sweet to get started!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {editingSweet && (
                <EditSweetDialog
                    sweet={editingSweet}
                    open={!!editingSweet}
                    onOpenChange={(open) => !open && setEditingSweet(null)}
                />
            )}

            {restockingSweet && (
                <RestockDialog
                    sweet={restockingSweet}
                    open={!!restockingSweet}
                    onOpenChange={(open) => !open && setRestockingSweet(null)}
                />
            )}
        </div>
    );
}
