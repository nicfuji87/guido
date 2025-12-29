// vite.config.ts
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
var vite_config_default = defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "@radix-ui/react-avatar", "@radix-ui/react-dropdown-menu"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "utils-vendor": ["lucide-react", "class-variance-authority"]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdFJlZnJlc2ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QtcmVmcmVzaCdcclxuXHJcbi8vIEFJIGRldiBub3RlOiBWaXRlIDIgKyBSZWFjdCAxNi4xNCArIFRTIDMuNFxyXG4vLyBCdW5kbGUgc2l6ZSBvdGltaXphZG8gY29tIGNvZGUgc3BsaXR0aW5nXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0UmVmcmVzaCgpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6ICcvc3JjJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBBSSBkZXYgbm90ZTogUHJveHkgcmVtb3ZpZG8gLSBhZ29yYSB1c2Egd2ViaG9vayBuOG4gZGlyZXRvXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAvLyBTZXBhcmFyIGJpYmxpb3RlY2FzIGdyYW5kZXMgZW0gY2h1bmtzIHByXHUwMEYzcHJpb3NcclxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAndWktdmVuZG9yJzogWydmcmFtZXItbW90aW9uJywgJ0ByYWRpeC11aS9yZWFjdC1hdmF0YXInLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnXSxcclxuICAgICAgICAgICdzdXBhYmFzZS12ZW5kb3InOiBbJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyddLFxyXG4gICAgICAgICAgJ3V0aWxzLXZlbmRvcic6IFsnbHVjaWRlLXJlYWN0JywgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSddXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQXVtZW50YXIgbGltaXRlIHBhcmEgcmVkdXppciB3YXJuaW5ncyAob3BjaW9uYWwpXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMFxyXG4gIH1cclxufSlcclxuXHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxrQkFBa0I7QUFJekIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQyxpQkFBaUIsMEJBQTBCLCtCQUErQjtBQUFBLFVBQ3hGLG1CQUFtQixDQUFDLHVCQUF1QjtBQUFBLFVBQzNDLGdCQUFnQixDQUFDLGdCQUFnQiwwQkFBMEI7QUFBQSxRQUM3RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQSx1QkFBdUI7QUFBQSxFQUN6QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
