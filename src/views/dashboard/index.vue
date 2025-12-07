<template>
  <div class="dashboard-container">
    <!-- 头部欢迎区域 -->
    <a-card :bordered="false" class="header-card mb-4">
      <div class="header-content">
        <div class="avatar">
          <a-avatar :size="72" :src="userStore.avatar" />
        </div>
        <div class="content">
          <div class="title">{{ timeFix }}，{{ userStore.name }}，祝你开心每一天！</div>
          <div class="desc">前端开发专家 | 某某某事业群－某某技术部－平台架构组</div>
        </div>
        <div class="extra-content">
          <div class="stat-item">
            <p>项目数</p>
            <p>56</p>
          </div>
          <div class="stat-item">
            <p>团队内排名</p>
            <p>8 / 24</p>
          </div>
          <div class="stat-item">
            <p>项目访问</p>
            <p>2,223</p>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 统计卡片区域 -->
    <a-row :gutter="[16, 16]" class="mb-4">
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

    <!-- 内容区域 -->
    <a-row :gutter="[16, 16]">
      <!-- 左侧内容 -->
      <a-col :xs="24" :lg="16">
        <!-- 进行中的项目 -->
        <a-card title="进行中的项目" :bordered="false" class="mb-4 project-card">
          <template #extra>
            <a href="#">全部项目</a>
          </template>
          <a-card-grid v-for="item in projects" :key="item.title" class="project-grid">
            <a-card-meta>
              <template #title>
                <div class="card-title">
                  <a-avatar :size="24" :src="item.logo" />
                  <span class="ml-2">{{ item.title }}</span>
                </div>
              </template>
              <template #description>
                <div class="card-desc">{{ item.description }}</div>
              </template>
            </a-card-meta>
            <div class="project-item">
              <span class="author">{{ item.author }}</span>
              <span class="datetime">{{ item.time }}</span>
            </div>
          </a-card-grid>
        </a-card>

        <!-- 动态 -->
        <a-card title="动态" :bordered="false" class="mb-4">
          <a-list item-layout="horizontal" :data-source="activities">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :src="item.user.avatar" />
                  </template>
                  <template #title>
                    <span>{{ item.user.name }}</span
                    >&nbsp; <span class="event">{{ item.event }}</span
                    >&nbsp; <a href="#">{{ item.project }}</a
                    >&nbsp;
                    <span>{{ item.projectDesc }}</span>
                  </template>
                  <template #description>
                    <span>{{ item.time }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- 右侧内容 -->
      <a-col :xs="24" :lg="8">
        <!-- 快捷导航 -->
        <a-card title="快捷导航" :bordered="false" class="mb-4 quick-nav">
          <a-card-grid v-for="item in quickNavs" :key="item.title">
            <span class="flex flex-col items-center">
              <component :is="item.icon" :style="{ fontSize: '24px', color: item.color }" />
              <span class="mt-2">{{ item.title }}</span>
            </span>
          </a-card-grid>
        </a-card>

        <!-- 指数 -->
        <a-card title="XX 指数" :bordered="false" class="mb-4">
          <div class="chart-wrapper">
            <div class="flex justify-between mb-2">
              <span>文档</span>
              <span>80%</span>
            </div>
            <a-progress :percent="80" status="active" />

            <div class="flex justify-between mb-2 mt-4">
              <span>设计</span>
              <span>65%</span>
            </div>
            <a-progress :percent="65" status="active" stroke-color="#52c41a" />

            <div class="flex justify-between mb-2 mt-4">
              <span>代码</span>
              <span>90%</span>
            </div>
            <a-progress :percent="90" status="active" stroke-color="#f5222d" />
          </div>
        </a-card>

        <!-- 团队 -->
        <a-card title="团队" :bordered="false" class="mb-4 team-card">
          <a-row :gutter="36">
            <a-col v-for="item in team" :key="item.name" :span="12" class="mb-4">
              <div class="flex items-center">
                <a-avatar :src="item.avatar" size="small" />
                <span class="ml-2">{{ item.name }}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  DollarOutlined,
  DashboardOutlined,
  SettingOutlined,
  FormOutlined,
  TableOutlined,
  ProfileOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const userStore = useUserStore()

// 获取当前时间状态
const timeFix = computed(() => {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
})

// 统计数据
const statistics = reactive({
  todayVisits: 1234,
  totalUsers: 5678,
  monthlyOrders: 890,
  totalRevenue: 123456.78
})

// 项目数据
const projects = [
  {
    title: 'Vue Admin Pro',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    description: '那是一种内在的东西， 他们到达不了，也无法触及的',
    author: '科学搬砖组',
    time: '9小时前'
  },
  {
    title: 'Ant Design Vue',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    author: '全组都是吴彦祖',
    time: '2年前'
  },
  {
    title: 'Vite Pro',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    author: '中二少女团',
    time: '3小时前'
  },
  {
    title: 'React Admin',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    author: '程序员日常',
    time: '5天前'
  },
  {
    title: 'Angular Pro',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    description: '凛冬将至',
    author: '高逼格设计天团',
    time: '7年前'
  },
  {
    title: 'Bootstrap',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    description: '生命就像一盒巧克力，结果往往出人意料',
    author: '骗你来学计算机',
    time: '12年前'
  }
]

// 动态数据
const activities = [
  {
    id: 1,
    user: {
      name: '曲丽丽',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    event: '在',
    project: '高逼格设计天团',
    projectDesc: '新建项目 六月迭代',
    time: '几秒前'
  },
  {
    id: 2,
    user: {
      name: '付小小',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
    },
    event: '在',
    project: '六月迭代',
    projectDesc: '发布了 留言',
    time: '2天前'
  },
  {
    id: 3,
    user: {
      name: '林东东',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
    },
    event: '在',
    project: '中二少女团',
    projectDesc: '新建项目 六月迭代',
    time: '2天前'
  }
]

// 快捷导航
const quickNavs = [
  { title: '首页', icon: DashboardOutlined, color: '#1890ff' },
  { title: '系统管理', icon: SettingOutlined, color: '#52c41a' },
  { title: '表单页', icon: FormOutlined, color: '#faad14' },
  { title: '列表页', icon: TableOutlined, color: '#f5222d' },
  { title: '详情页', icon: ProfileOutlined, color: '#13c2c2' },
  { title: '结果页', icon: CheckCircleOutlined, color: '#722ed1' }
]

// 团队
const team = [
  { name: '科学搬砖组', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png' },
  { name: '全组都是吴彦祖', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' },
  { name: '中二少女团', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png' },
  { name: '程序员日常', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png' },
  { name: '高逼格设计天团', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png' },
  { name: '骗你来学计算机', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png' }
]
</script>

<style lang="less" scoped>
.dashboard-container {
  .mb-4 {
    margin-bottom: 16px;
  }
  .ml-2 {
    margin-left: 8px;
  }
  .mt-2 {
    margin-top: 8px;
  }
  .mt-4 {
    margin-top: 16px;
  }
  .flex {
    display: flex;
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-between {
    justify-content: space-between;
  }

  .header-card {
    .header-content {
      display: flex;
      align-items: center;

      .avatar {
        flex: 0 1 72px;
        margin-right: 24px;
      }

      .content {
        flex: 1;
        .title {
          font-size: 20px;
          line-height: 28px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 12px;
        }
        .desc {
          color: rgba(0, 0, 0, 0.45);
        }
      }

      .extra-content {
        display: flex;
        justify-content: flex-end;
        min-width: 242px;

        .stat-item {
          position: relative;
          padding: 0 32px;
          text-align: center;

          &:after {
            position: absolute;
            top: 8px;
            right: 0;
            width: 1px;
            height: 40px;
            background-color: #e8e8e8;
            content: '';
          }

          &:last-child {
            padding-right: 0;
            &:after {
              display: none;
            }
          }

          p:first-child {
            margin-bottom: 4px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
          }

          p:last-child {
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 30px;
            line-height: 38px;
          }
        }
      }

      @media screen and (max-width: 768px) {
        display: block;
        .content {
          margin-bottom: 16px;
        }
        .extra-content {
          display: none;
        }
      }
    }
  }

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

  .project-card {
    :deep(.ant-card-grid) {
      width: 33.33%;
      padding: 24px;
      box-shadow: none;
      border: 1px solid #f0f0f0;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1;
        position: relative;
        border-color: transparent;
      }
    }

    @media screen and (max-width: 992px) {
      :deep(.ant-card-grid) {
        width: 50%;
      }
    }

    @media screen and (max-width: 576px) {
      :deep(.ant-card-grid) {
        width: 100%;
      }
    }

    .card-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      display: flex;
      align-items: center;

      span {
        line-height: 24px;
        height: 24px;
        display: inline-block;
      }
    }

    .card-desc {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      overflow: hidden;
      margin-top: 8px;
      line-height: 22px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .project-item {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.45);

      .author {
        flex: 1;
        font-size: 12px;
      }

      .datetime {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }

  .quick-nav {
    :deep(.ant-card-grid) {
      width: 33.33%;
      text-align: center;
      padding: 24px 0;
      cursor: pointer;
      box-shadow: none;
      border: 1px solid #f0f0f0;

      &:hover {
        position: relative;
        z-index: 1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: transparent;
      }
    }
  }

  :deep(.ant-card) {
    border-radius: 8px;
  }
}
</style>
