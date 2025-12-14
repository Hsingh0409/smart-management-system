import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI, CreateSweetData } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const categories = ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Caramel', 'Toffee'];

export default function CreateSweetForm() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateSweetData>({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        description: '',
        imageUrl: '',
    });
    const [error, setError] = useState('');

    const createMutation = useMutation({
        mutationFn: sweetsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
            setFormData({
                name: '',
                category: '',
                price: 0,
                quantity: 0,
                description: '',
                imageUrl: '',
            });
            setError('');
        },
        onError: (error: any) => {
            setError(error.response?.data?.error?.message || 'Failed to create sweet');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.category || formData.price <= 0 || formData.quantity < 0) {
            setError('Please fill in all required fields correctly');
            return;
        }

        createMutation.mutate(formData);
    };

    const handleChange = (field: keyof CreateSweetData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Sweet</CardTitle>
                <CardDescription>Add a new sweet to the catalog</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    {createMutation.isSuccess && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                            Sweet created successfully! 🎉
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Chocolate Bar"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange('category', value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
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

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price || ''}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                placeholder="2.99"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity || ''}
                                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                                placeholder="100"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Delicious chocolate bar..."
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Creating...' : 'Create Sweet'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
