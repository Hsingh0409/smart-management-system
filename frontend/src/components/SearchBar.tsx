import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    q: string;
    category: string;
    minPrice: string;
    maxPrice: string;
}

const categories = [
    'All Categories',
    'Chocolate',
    'Candy',
    'Gummy',
    'Hard Candy',
    'Lollipop',
    'Caramel',
    'Toffee',
];

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        q: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            onSearch(filters);
        }, 300);

        return () => clearTimeout(debounce);
    }, [filters, onSearch]);

    const handleChange = (key: keyof SearchFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <Label htmlFor="search" className="mb-2 block">
                        Search
                    </Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search sweets..."
                            value={filters.q}
                            onChange={(e) => handleChange('q', e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="category" className="mb-2 block">
                        Category
                    </Label>
                    <Select
                        value={filters.category}
                        onValueChange={(value) =>
                            handleChange('category', value === 'All Categories' ? '' : value)
                        }
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="All Categories" />
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

                <div>
                    <Label className="mb-2 block">Price Range</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
