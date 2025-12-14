import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI, Sweet, UpdateSweetData } from '@/services/api';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const categories = ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Caramel', 'Toffee'];

interface EditSweetDialogProps {
    sweet: Sweet;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditSweetDialog({ sweet, open, onOpenChange }: EditSweetDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<UpdateSweetData>({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description,
        imageUrl: sweet.imageUrl,
    });
    const [error, setError] = useState('');

    const updateMutation = useMutation({
        mutationFn: (data: UpdateSweetData) => sweetsAPI.update(sweet._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
            onOpenChange(false);
            setError('');
        },
        onError: (error: any) => {
            setError(error.response?.data?.error?.message || 'Failed to update sweet');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        updateMutation.mutate(formData);
    };

    const handleChange = (field: keyof UpdateSweetData, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Sweet</DialogTitle>
                        <DialogDescription>
                            Update sweet information
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange('category', value)}
                            >
                                <SelectTrigger id="edit-category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price || ''}
                                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-quantity">Quantity</Label>
                                <Input
                                    id="edit-quantity"
                                    type="number"
                                    min="0"
                                    value={formData.quantity || ''}
                                    onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-imageUrl">Image URL</Label>
                            <Input
                                id="edit-imageUrl"
                                value={formData.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
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
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
