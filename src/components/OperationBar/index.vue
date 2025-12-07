<template>
  <div class="operation-bar">
    <div class="operation-bar-container">
      <!-- 左侧区域：标题和信息 -->
      <div class="operation-bar-left">
        <!-- 标题 -->
        <div class="operation-bar-title">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- 表格信息区域 -->
        <div class="operation-info">
          <!-- 总数统计 -->
          <span v-if="showTotal && total !== undefined" class="total-info"> 共 {{ total }} 条数据 </span>

          <!-- 选择信息 -->
          <span v-if="hasSelected" class="selected-info"> 已选择 {{ selectedCount }} 项 </span>

          <!-- 自定义信息插槽 -->
          <slot name="info"></slot>
        </div>
      </div>

      <!-- 右侧区域：操作按钮 -->
      <div class="operation-bar-right">
        <a-space :size="4">
          <slot name="actions"></slot>

          <!-- 内置刷新按钮 -->
          <a-tooltip title="刷新">
            <a-button v-if="showRefresh" type="text" title="刷新" class="refresh-btn" @click="handleRefresh">
              <ReloadOutlined />
            </a-button>
          </a-tooltip>

          <!-- 密度控制按钮 -->
          <a-tooltip title="密度">
            <a-dropdown v-if="showDensity" trigger="click" placement="bottomRight">
              <a-button type="text" title="密度" class="density-btn">
                <ColumnHeightOutlined />
              </a-button>
              <template #overlay>
                <a-menu :selected-keys="[tableSize]" @click="handleDensityChange">
                  <a-menu-item key="small">
                    <span>紧凑</span>
                  </a-menu-item>
                  <a-menu-item key="middle">
                    <span>中等</span>
                  </a-menu-item>
                  <a-menu-item key="large">
                    <span>宽松</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-tooltip>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ReloadOutlined, ColumnHeightOutlined } from '@ant-design/icons-vue'

// Props 定义
const props = defineProps({
  // 标题文本
  title: {
    type: String,
    default: ''
  },
  // 选中的项目数量
  selectedCount: {
    type: Number,
    default: 0
  },
  // 数据总数
  total: {
    type: Number,
    default: undefined
  },
  // 是否显示总数统计
  showTotal: {
    type: Boolean,
    default: false
  },
  // 是否显示刷新按钮
  showRefresh: {
    type: Boolean,
    default: true
  },
  // 是否显示密度控制按钮
  showDensity: {
    type: Boolean,
    default: true
  },
  // 表格尺寸
  tableSize: {
    type: String,
    default: 'middle',
    validator: (value) => ['small', 'middle', 'large'].includes(value)
  }
})

// 事件定义
const emit = defineEmits(['refresh', 'density-change'])

// 计算属性
const hasSelected = computed(() => props.selectedCount > 0)

// 方法
const handleRefresh = () => {
  emit('refresh')
}

const handleDensityChange = ({ key }) => {
  emit('density-change', key)
}
</script>

<style lang="less" scoped>
.operation-bar {
  padding: 16px 0;

  &-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    max-width: calc(100% - 200px);
    flex: 1;

    .operation-bar-title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
      font-size: 16px;
    }
  }

  &-right {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }
}

.operation-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 14px;

  .total-info {
    color: rgba(0, 0, 0, 0.65);
  }

  .selected-info {
    color: #1890ff;
    background: #e6f7ff;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
}

.refresh-btn,
.density-btn {
  padding: 0 4px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;

  &:hover {
    color: #1890ff;
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .operation-bar {
    &-container {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    &-left {
      max-width: 100%;
      order: 1;
    }

    &-right {
      order: 2;
      justify-content: flex-start;
    }

    .operation-info {
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
}
</style>
