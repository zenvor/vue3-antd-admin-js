import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(() => {
  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: []
    },
    plugins: [
      vue(),
      // 自动按需引入组件（保留 Ant Design Vue 解析器）
      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [AntDesignVueResolver({ importStyle: false })]
      })
    ],

    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
      extensions: ['.js', '.vue', '.json']
    },

    css: {
      preprocessorOptions: {
        less: { javascriptEnabled: true }
      }
    }
  }
})
