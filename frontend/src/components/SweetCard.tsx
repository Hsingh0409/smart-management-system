import { useState } from 'react';
import { Sweet } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package } from 'lucide-react';

interface SweetCardProps {
    sweet: Sweet;
    onPurchase: (sweetId: string, quantity: number) => void;
    isPurchasing?: boolean;
}

export default function SweetCard({ sweet, onPurchase, isPurchasing }: SweetCardProps) {
    const [quantity, setQuantity] = useState(1);

    const handlePurchase = () => {
        if (quantity > 0 && quantity <= sweet.quantity) {
            onPurchase(sweet._id, quantity);
        }
    };

    const isOutOfStock = sweet.quantity === 0;
    const isInvalidQuantity = quantity < 1 || quantity > sweet.quantity;

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
                {sweet.imageUrl && (
                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-4">
                        <img
                            src={sweet.imageUrl}
                            alt={sweet.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <CardTitle className="line-clamp-1">{sweet.name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
                        {sweet.category}
                    </span>
                    <span className="text-lg font-bold text-primary">
                        ${sweet.price.toFixed(2)}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {sweet.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {sweet.description}
                    </p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className={isOutOfStock ? 'text-red-500 font-medium' : ''}>
                        {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 w-full">
                    <Input
                        type="number"
                        min="1"
                        max={sweet.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        disabled={isOutOfStock || isPurchasing}
                        className="w-20"
                    />
                    <Button
                        onClick={handlePurchase}
                        disabled={isOutOfStock || isInvalidQuantity || isPurchasing}
                        className="flex-1"
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isPurchasing ? 'Purchasing...' : 'Purchase'}
                    </Button>
                </div>
                {isInvalidQuantity && !isOutOfStock && (
                    <p className="text-xs text-red-500 text-center">
                        Quantity must be between 1 and {sweet.quantity}
                    </p>
                )}
            </CardFooter>
        </Card>
    );
}
