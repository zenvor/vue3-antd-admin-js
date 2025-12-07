# Vue3 Antd Admin JS

一个简洁、现代的 Vue 3 + Ant Design Vue (JavaScript版本) 后台管理模板。

## 项目特点

- Vue 3 + Vite: 最新的前端技术栈
- Ant Design Vue: 企业级 UI 组件库
- 动态路由: 基于角色的动态路由和菜单生成
- 状态管理: 集成 Pinia 进行全局状态管理
- 权限控制: 完善的 Token 验证和路由守卫
- 规范化: 清晰的代码组织和工程化配置

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## 测试账户

### 超级管理员
- 用户名: admin
- 密码: 任意

### 普通用户
- 用户名: user
- 密码: 任意

## 开发指南

### 添加新页面
1. 在 src/views/ 创建页面组件
2. 在 src/router/index.js 的 asyncRoutes 中添加路由配置
3. 在 meta 中配置 title、icon 和 roles

### 状态管理
使用 Pinia store 管理状态：
- useUserStore: 用户信息和登录
- useAppStore: 应用配置和布局状态
- usePermissionStore: 路由和权限

### 常用命令
- npm run dev: 启动开发服务器
- npm run build: 生产环境构建
- npm run lint: 代码检查
- npm run format: 代码格式化