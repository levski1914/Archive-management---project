import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Това трябва да е / ако сайтът ти е на коренния адрес, или поддиректория ако е нужно
  css: {
    postcss: "./postcss.config.js", // Увери се, че този файл съществува
  },
  build: {
    target: "esnext", // Поставя съвременен target, за да гарантира, че Vite генерира модерен код
  },
});
