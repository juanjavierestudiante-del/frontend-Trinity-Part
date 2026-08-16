// Modo estricto de React.
import { StrictMode } from "react";

// API de React para renderizar la aplicación.
import { createRoot } from "react-dom/client";

// TanStack Query.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Estilos globales.
import "./index.css";

// Componente principal.
import App from "./App";

// Configuración global de TanStack Query.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reintenta una vez si la consulta falla.
      refetchOnWindowFocus: false, // No vuelve a consultar al regresar a la pestaña.
    },
  },
});

// Obtiene el elemento raíz.
const root = document.getElementById("root");

// Verifica que exista.
if (!root) {
  throw new Error("No se encontró el elemento con id='root'.");
}

// Renderiza la aplicación.
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);