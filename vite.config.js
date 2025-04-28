import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'catalogo-filmes', // 👈 Adicione esta linha (substitua pelo nome do seu repositório)
});