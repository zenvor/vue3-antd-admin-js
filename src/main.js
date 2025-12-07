import { createApp, h } from 'vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './router/guard'
import { Spin, message } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

// 设置 message 的最大数量为 1
message.config({ maxCount: 1 })

// 全局设置 Spin 的默认指示器为 LoadingOutlined（对象形式 { indicator }）
Spin.setDefaultIndicator({
  indicator: h(LoadingOutlined, { class: 'anticon-spin', style: { fontSize: '24px' } })
})

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
