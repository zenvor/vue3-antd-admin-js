<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic title="日访问数" :value="statistics.todayVisits" :value-style="{ color: '#1890ff' }">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic title="注册用户数" :value="statistics.totalUsers" :value-style="{ color: '#52c41a' }">
            <template #prefix>
              <TeamOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic title="总完成数" :value="statistics.monthlyOrders" :value-style="{ color: '#faad14' }">
            <template #prefix>
              <ShoppingOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="总数据"
            :value="statistics.totalRevenue"
            :precision="0"
            :value-style="{ color: '#f5222d' }"
          >
            <template #prefix>
              <DollarOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { UserOutlined, TeamOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons-vue'

// 统计数据
const statistics = reactive({
  todayVisits: 1234,
  totalUsers: 5678,
  monthlyOrders: 890,
  totalRevenue: 123456.78
})
</script>

<style lang="less" scoped>
.dashboard-container {
  .stat-card {
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    :deep(.ant-statistic-title) {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }

    :deep(.ant-statistic-content) {
      font-size: 24px;
      font-weight: 600;
    }
  }

  :deep(.ant-card) {
    border-radius: 8px;
  }
}
</style>
