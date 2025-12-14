import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI, Sweet } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RestockDialogProps {
    sweet: Sweet;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RestockDialog({ sweet, open, onOpenChange }: RestockDialogProps) {
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(10);
    const [error, setError] = useState('');

    const restockMutation = useMutation({
        mutationFn: (qty: number) => sweetsAPI.restock(sweet._id, qty),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
            onOpenChange(false);
            setQuantity(10);
            setError('');
        },
        onError: (error: any) => {
            setError(error.response?.data?.error?.message || 'Failed to restock');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (quantity < 1) {
            setError('Quantity must be at least 1');
            return;
        }

        restockMutation.mutate(quantity);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Restock Sweet</DialogTitle>
                        <DialogDescription>
                            Add inventory for {sweet.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="restock-quantity">Quantity to Add</Label>
                            <Input
                                id="restock-quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Current stock: {sweet.quantity} | After restock: {sweet.quantity + quantity}
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={restockMutation.isPending}>
                            {restockMutation.isPending ? 'Restocking...' : 'Restock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
