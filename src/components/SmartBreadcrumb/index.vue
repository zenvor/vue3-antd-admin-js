<!-- components/SmartBreadcrumb.vue -->
<template>
  <div v-if="breadcrumbs.length > 1" class="smart-breadcrumb">
    <!-- 简洁的原生面包屑实现 -->
    <nav class="breadcrumb-nav">
      <ol class="breadcrumb-list">
        <li v-for="(item, index) in displayBreadcrumbs" :key="index" class="breadcrumb-item">
          <template v-if="item.path && !item.disabled">
            <router-link :to="item.path" class="breadcrumb-link">
              <component :is="item.icon" v-if="showIcon && item.icon" class="breadcrumb-icon" />
              {{ item.title }}
            </router-link>
          </template>
          <template v-else>
            <span class="breadcrumb-current">
              <component :is="item.icon" v-if="showIcon && item.icon" class="breadcrumb-icon" />
              {{ item.title }}
            </span>
          </template>
          <span v-if="index < displayBreadcrumbs.length - 1" class="breadcrumb-separator">{{ separator }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  separator: {
    type: String,
    default: '/'
  },
  showIcon: {
    type: Boolean,
    default: false // 默认不显示图标，保持简洁
  },
  maxLength: {
    type: Number,
    default: 5
  }
})

const route = useRoute()

// 面包屑状态管理
const manualBreadcrumbs = ref([])
const useManualMode = ref(false)

// 自动生成面包屑
const autoBreadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)
  const breadcrumbs = []

  matched.forEach((match, index) => {
    const meta = match.meta
    const isLast = index === matched.length - 1

    breadcrumbs.push({
      path: isLast ? route.path : match.path,
      title: meta.title,
      icon: meta.icon,
      disabled: isLast,
      meta
    })
  })

  return breadcrumbs
})

// 当前显示的面包屑
const breadcrumbs = computed(() => {
  return useManualMode.value ? manualBreadcrumbs.value : autoBreadcrumbs.value
})

// 处理超长面包屑
const displayBreadcrumbs = computed(() => {
  const items = breadcrumbs.value
  if (items.length <= props.maxLength) {
    return items
  }

  // 超过最大长度时，保留首尾，中间用省略号
  const first = items[0]
  const last = items[items.length - 1]
  const middle = items.slice(1, -1)

  if (middle.length > 2) {
    return [first, { title: '...', disabled: true, path: '' }, ...middle.slice(-1), last]
  }

  return items
})

// 路由变化时重置为自动模式
watch(
  () => route.fullPath,
  () => {
    useManualMode.value = false
  }
)
</script>

<style scoped>
.smart-breadcrumb {
  margin: 0;
  padding-top: 18px;
}

.breadcrumb-nav {
  font-size: 14px;
  line-height: 1.3;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  margin: 0 -4px;
  padding: 0 4px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  border-radius: 3px;
  font-weight: 400;
}

.breadcrumb-link:hover {
  color: rgba(0, 0, 0, 0.88);
  background-color: rgba(0, 0, 0, 0.06);
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  padding: 2px 4px;
}

.breadcrumb-icon {
  margin-right: 4px;
  font-size: 12px;
  opacity: 0.8;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: #ccc;
  font-size: 12px;
  user-select: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-breadcrumb {
    padding: 4px 0;
  }

  .breadcrumb-nav {
    font-size: 13px;
  }

  .breadcrumb-separator {
    margin: 0 4px;
  }
}
</style>
