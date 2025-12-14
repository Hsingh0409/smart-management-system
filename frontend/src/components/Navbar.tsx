import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, Candy, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuthStore();

    return (
        <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link
                            to={isAuthenticated ? '/sweets' : '/'}
                            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                            <Candy className="h-6 w-6" />
                            <span>Sweet Shop</span>
                        </Link>

                        {isAuthenticated && (
                            <nav className="hidden md:flex items-center space-x-4">
                                <Link
                                    to="/sweets"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Catalog
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Admin</span>
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>

                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <p className="font-medium">{user?.email}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {user?.role}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
