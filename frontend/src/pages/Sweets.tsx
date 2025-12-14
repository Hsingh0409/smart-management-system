import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI } from '@/services/api';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import SweetCard from '@/components/SweetCard';
import { Loader2, Candy } from 'lucide-react';

export default function Sweets() {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<SearchFilters>({
        q: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    // Fetch sweets based on search filters
    const { data: sweets, isLoading, error } = useQuery({
        queryKey: ['sweets', filters],
        queryFn: async () => {
            const hasFilters = filters.q || filters.category || filters.minPrice || filters.maxPrice;

            if (hasFilters) {
                return sweetsAPI.search({
                    q: filters.q || undefined,
                    category: filters.category || undefined,
                    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
                    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
                });
            }

            return sweetsAPI.getAll();
        },
    });

    // Purchase mutation
    const purchaseMutation = useMutation({
        mutationFn: ({ sweetId, quantity }: { sweetId: string; quantity: number }) =>
            sweetsAPI.purchase(sweetId, quantity),
        onSuccess: () => {
            // Refetch sweets to update quantities
            queryClient.invalidateQueries({ queryKey: ['sweets'] });
        },
    });

    const handlePurchase = (sweetId: string, quantity: number) => {
        purchaseMutation.mutate({ sweetId, quantity });
    };

    const handleSearch = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center space-x-2">
                    <Candy className="h-8 w-8 text-primary" />
                    <span>Sweets Catalog</span>
                </h1>
                <p className="text-muted-foreground">
                    Browse our delicious collection of sweets
                </p>
            </div>

            <SearchBar onSearch={handleSearch} />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                    Failed to load sweets. Please try again later.
                </div>
            )}

            {purchaseMutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                    Purchase failed: {(purchaseMutation.error as any)?.response?.data?.error?.message || 'Please try again'}
                </div>
            )}

            {purchaseMutation.isSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-4 mb-6">
                    Purchase successful! 🎉
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading sweets...</span>
                </div>
            ) : sweets && sweets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sweets.map((sweet) => (
                        <SweetCard
                            key={sweet._id}
                            sweet={sweet}
                            onPurchase={handlePurchase}
                            isPurchasing={purchaseMutation.isPending}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <Candy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
                    <p className="text-muted-foreground">
                        {filters.q || filters.category || filters.minPrice || filters.maxPrice
                            ? 'Try adjusting your search filters'
                            : 'Check back later for new sweets'}
                    </p>
                </div>
            )}
        </div>
    );
}
