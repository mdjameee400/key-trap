import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const AppRoutes = () => {
    const { user, loading } = useAuth();
    if (loading) return null;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <Toaster position="top-center" richColors />
            <AppRoutes />
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
