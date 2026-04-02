import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
        checkout_success: resolve(__dirname, "src/checkout/success.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html"),
      },
    },
  },

  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "checkout/success.html", // ✅ ruta relativa a root
          dest: ".", // ✅ se copia a dist/checkout/success.html
        },
      ],
    }),
  ],
});