import { resolve } from "path";
import { defineConfig } from "vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        final_project: resolve(__dirname, "src/final-project/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
        checkout_success: resolve(__dirname, "src/checkout/success.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html"),
      },
    },
  },


  //this is causing a break in the build process, if using this please make sure that if you are using this part of the code, that it does not interfere with the build process, and works with the rest of the code
  // also before submitting to the main branch, please make sure that if you are using a section of code, that it works with everything else before merging, 
  
  // plugins: [
  //   viteStaticCopy({
  //     targets: [
  //       {
  //         src: "checkout/success.html", // ✅ ruta relativa a root
  //         dest: ".", // ✅ se copia a dist/checkout/success.html
  //       },
  //     ],
  //   }),
  // ],
});
