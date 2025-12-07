<template>
  <div class="layout">
    <!-- 背景层 -->
    <div class="layout-bg-list">
      <img src="./images/bg1.webp" class="bg-img-1" />
      <img src="./images/bg2.webp" class="bg-img-2" />
      <img src="./images/bg3.webp" class="bg-img-3" />
    </div>

    <a-layout class="layout-has-sider" style="min-height: 100%; flex-direction: row">
      <!-- 左侧导航栏占位 -->
      <div
        :style="{
          width: collapsed ? '64px' : '256px',
          overflow: 'hidden',
          flex: collapsed ? '0 0 64px' : '0 0 256px',
          'max-width': collapsed ? '64px' : '256px',
          'min-width': collapsed ? '64px' : '256px',
          transition: '0.2s'
        }"
      ></div>

      <!-- 左侧导航栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        theme="light"
        width="256"
        :collapsed-width="64"
        class="sider sider-fixed-mix sider-fixed"
      >
        <!-- 菜单折叠按钮 -->
        <div class="sider-collapsed-button" @click="toggleCollapsed">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
            :class="{ collapsed: collapsed }"
          >
            <path
              d="M6.432 7.967a.448.448 0 01-.318.133h-.228a.46.46 0 01-.318-.133L2.488 4.85a.305.305 0 010-.43l.427-.43a.293.293 0 01.42 0L6 6.687l2.665-2.699a.299.299 0 01.426 0l.42.431a.305.305 0 010 .43L6.432 7.967z"
            ></path>
          </svg>
        </div>

        <!-- 菜单 -->
        <a-menu
          v-model:open-keys="openKeys"
          :selected-keys="selectedKeys"
          mode="inline"
          :items="menuItems"
          class="nav-menu"
          @click="handleMenuClick"
        />
      </a-layout-sider>

      <!-- 主体布局 -->
      <div class="layout-container">
        <!-- 顶部占位 -->
        <div class="header-placeholder"></div>

        <!-- 顶部导航栏 -->
        <a-layout-header class="layout-header">
          <div class="global-header">
            <!-- LOGO区域 -->
            <div class="global-header-logo">
              <a>
                <img src="/src/assets/logo.svg" alt="logo" class="logo-img" />
                <h1 class="logo-text">后台管理模板</h1>
              </a>
            </div>

            <div style="flex: 1 1 0%"></div>

            <!-- 右侧功能区 - 用户下拉菜单 -->
            <div class="global-header-right-content">
              <a-dropdown trigger="hover" placement="bottomRight">
                <div class="user-avatar-wrapper">
                  <span class="user-name">管理员</span>
                  <a-avatar shape="square" :size="28" :src="avatarUrl" />
                </div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleLogout">
                      <LogoutOutlined />
                      <span style="margin-inline-start: 8px">退出登录</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>

        <!-- 内容区 -->
        <a-layout-content class="layout-content">
          <div class="page-container">
            <a-page-header class="page-container-warp-page-header">
              <!-- 面包屑 -->
              <SmartBreadcrumb />

              <!-- 页面标题 -->
              <div class="ant-page-header-heading">
                <div class="ant-page-header-heading-left">
                  <span class="ant-page-header-heading-title" :title="currentPageTitle">{{ currentPageTitle }}</span>
                </div>
              </div>
            </a-page-header>

            <div class="grid-content">
              <div class="grid-content-children">
                <div class="page-container-children-container">
                  <router-view />
                </div>
              </div>
            </div>
          </div>
        </a-layout-content>
      </div>
    </a-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import SmartBreadcrumb from '@/components/SmartBreadcrumb'
import { useMenu } from './composables/useMenu.js'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 侧边栏折叠状态
const collapsed = computed({
  get: () => !appStore.sidebar.opened,
  set: (val) => {
    if (val) {
      appStore.closeSidebar()
    } else {
      appStore.openSidebar()
    }
  }
})

// 切换侧边栏
const toggleCollapsed = () => {
  appStore.toggleSidebar()
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

// 用户头像
const avatarUrl = computed(() => userStore.avatar)

// 菜单逻辑
const { menuItems, selectedKeys, openKeys, currentPageTitle, handleMenuClick } = useMenu()
</script>

<style lang="less" scoped>
/* 样式常量定义 */
@header-height: 56px;
@primary-color: #1890ff;
@border-color: rgba(5, 5, 5, 0.06);
@text-color-disabled: rgba(0, 0, 0, 0.25);
@background-color: #fff;

/* 最外层布局容器 */
.layout {
  display: flex;
  background-color: transparent;
  width: 100%;

  .ant-layout {
    width: 100%;
    background: transparent;
  }

  /* 背景层 */
  .layout-bg-list {
    pointer-events: none;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(@background-color, #f5f5f5 28%);

    .bg-img-1 {
      position: absolute;
      left: 85px;
      bottom: 100px;
      height: 303px;
    }

    .bg-img-2 {
      position: absolute;
      bottom: -68px;
      right: -45px;
      height: 303px;
    }

    .bg-img-3 {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 331px;
    }
  }
}

/* 左侧导航栏 */
.sider {
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  background: transparent;
  margin-right: 1px;
  transition:
    all 0.2s,
    background 0s;

  &.sider-fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100%;
  }

  &.sider-fixed-mix {
    height: calc(100% - @header-height);
    top: @header-height;
  }

  /* 菜单折叠按钮 */
  .sider-collapsed-button {
    position: absolute;
    top: 18px;
    z-index: 100;
    width: 24px;
    height: 24px;
    text-align: center;
    border-radius: 40px;
    right: -13px;
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: @text-color-disabled;
    background-color: @background-color;
    box-shadow:
      0 2px 8px -2px rgba(0, 0, 0, 0.05),
      0 1px 4px -1px rgba(25, 15, 15, 0.07),
      0 0 1px 0 rgba(0, 0, 0, 0.08);

    &:hover {
      color: @primary-color;
      box-shadow:
        0 4px 12px -4px rgba(0, 0, 0, 0.1),
        0 2px 6px -2px rgba(25, 15, 15, 0.12),
        0 0 2px 0 rgba(0, 0, 0, 0.12);
    }

    svg {
      transition: transform 0.3s ease;
      transform: rotate(90deg);

      &.collapsed {
        transform: rotate(-90deg);
      }
    }
  }
}

/* 主体布局容器 */
.layout-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background-color: transparent;
}

/* 顶部占位 */
.header-placeholder {
  height: @header-height;
  background-color: transparent;
  z-index: 19;
}

/* 顶部导航栏 */
.layout-header {
  height: @header-height;
  line-height: @header-height;
  z-index: 200;
  width: 100%;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 1px solid @border-color;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  .global-header {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 16px;
    height: @header-height;
    box-sizing: border-box;
    background: transparent;

    /* LOGO区域 */
    .global-header-logo {
      margin-right: 16px;

      a {
        display: flex;
        align-items: center;
        height: 100%;
        min-height: 22px;
        font-size: 20px;
      }

      .logo-img {
        height: 28px;
        width: 28px;
      }

      .logo-text {
        height: 32px;
        margin: 0 0 0 8px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.88);
        font-size: 18px;
        line-height: 32px;
      }
    }

    /* 右侧功能区 */
    .global-header-right-content {
      height: 100%;
      display: flex;
      align-items: center;

      .user-avatar-wrapper {
        display: flex;
        align-items: center;
        height: 44px;
        padding: 8px;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }

        .user-name {
          margin: 0 8px;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
      }
    }
  }
}

/* 主内容区域 */
.layout-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
  position: relative;

  .page-container-warp-page-header {
    padding: 8px 40px 16px 40px;
  }

  .ant-page-header-heading {
    padding-top: 8px;
  }

  .grid-content-children {
    .page-container-children-container {
      padding: 0 40px 32px;
    }
  }
}

/* Ant Design 组件样式覆盖 */
:deep(.ant-layout-sider-children) {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 8px;
  border-right: 1px solid @border-color;
  margin-right: -1px;
}

:deep(.ant-menu) {
  border-right: 0 !important;
  height: 100% !important;
  background: transparent !important;

  .ant-menu-item {
    padding-left: 16px !important;
    border-radius: 6px;

    &.ant-menu-item-only-child {
      padding-left: 32px !important;
    }

    &:hover {
      background-color: #f5f5f5;
      color: @primary-color;
    }

    &:active,
    &.ant-menu-item-selected:active {
      background-color: rgba(0, 0, 0, 0.04) !important;
      color: #000000 !important;
    }

    &.ant-menu-item-selected {
      background-color: rgba(0, 0, 0, 0.04) !important;
      color: #000000 !important;
    }
  }

  .ant-menu-submenu {
    .ant-menu-submenu-title {
      padding-left: 16px !important;
    }
  }

  &.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover,
  &.ant-menu-light > .ant-menu:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover {
    background-color: rgba(0, 0, 0, 0.03) !important;
  }
}

:deep(.ant-menu-inline-collapsed) {
  .ant-menu-item {
    padding-left: 12px !important;
  }

  .ant-menu-submenu {
    .ant-menu-submenu-title {
      padding-left: 12px !important;
    }
  }
}

:deep(.ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline) {
  background: transparent;
}

:deep(.ant-page-header .ant-page-header-content) {
  padding-top: 0 !important;
}
</style>
