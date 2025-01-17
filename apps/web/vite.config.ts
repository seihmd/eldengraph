import dsv from '@rollup/plugin-dsv';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  //https://ja.vitejs.dev/guide/static-deploy.html#github-pages
  base: "/eldengraph/",
  plugins: [react(), dsv({
    processRow: (row) => {
      Object.keys(row).forEach((key) => {
        if (key === "﻿id") {
          row['id'] = row[key];
        }
        if (key === "﻿from") {
          row['from'] = row[key];
        }
      });
    }
  })],
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  }
})
