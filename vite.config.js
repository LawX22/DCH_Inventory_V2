import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "84f9-64-224-132-165.ngrok-free.app" // Add your current Ngrok URL here
    ],
    host: "0.0.0.0", // Allow external access
    port: 5173, // Default Vite port, change if needed
  }
});
