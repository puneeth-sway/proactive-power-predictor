
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import ContractorDashboard from "./pages/ContractorDashboard";
import InstallerDashboard from "./pages/InstallerDashboard";
import UserSelection from "./pages/UserSelection";
import RoleBasedRoute from "./components/RoleBasedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserSelection />} />
          <Route path="/dashboard" element={
            <RoleBasedRoute allowedRoles={['homeowner', 'contractor']}>
              <Dashboard />
            </RoleBasedRoute>
          } />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contractor" element={
            <RoleBasedRoute allowedRoles={['contractor']}>
              <ContractorDashboard />
            </RoleBasedRoute>
          } />
          <Route path="/installer" element={
            <RoleBasedRoute allowedRoles={['installer']}>
              <InstallerDashboard />
            </RoleBasedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
