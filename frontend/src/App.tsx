import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Sweets from '@/pages/Sweets';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/sweets" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/sweets"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Sweets />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </QueryClientProvider>
    );
}

export default App;
