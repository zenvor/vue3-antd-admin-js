<template>
  <div class="login-container">
    <!-- 语言选择器 -->
    <div class="lang-selector" data-lang>
      <!-- 语言选择器占位 -->
    </div>

    <div class="login-content">
      <!-- 登录表单 -->
      <div class="login-form-wrapper">
        <div class="form-login-header">
          <!-- <span class="form-login-logo">
            <img alt="logo" src="@/assets/logo.svg" class="logo" />
          </span> -->
          <span class="form-login-title">Vue3 Antd Admin JS</span>
        </div>

        <!-- 描述 - 暂时空着 -->
        <div class="form-login-desc"></div>

        <a-form :model="formData" class="login-form" size="large" @finish="submitForm">
          <a-alert
            v-if="loginState.status === 'error'"
            message="账户或密码错误"
            type="error"
            show-icon
            class="error-alert"
          />

          <!-- 账户密码登录 -->
          <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
            <a-input v-model:value="formData.username" placeholder="用户名" size="large">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="formData.password" placeholder="密码" size="large">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- 记住密码 -->
          <div class="login-options">
            <a-checkbox v-model:checked="formData.rememberPassword"> 记住密码 </a-checkbox>
          </div>

          <!-- 登录按钮 -->
          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" :loading="loading" class="login-btn" block>
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入
import { reactive, ref, onMounted } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

// 路由实例
const router = useRouter()
const userStore = useUserStore()

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  rememberPassword: false
})

// 登录状态
const loginState = reactive({
  status: ''
})

// 本地存储键名
const REMEMBER_PASSWORD_KEY = 'app_remember_password'
const SAVED_USERNAME_KEY = 'app_saved_username'
const SAVED_PASSWORD_KEY = 'app_saved_password'

/** 组件挂载时检查是否有保存的账号密码 */
onMounted(() => {
  const rememberPassword = localStorage.getItem(REMEMBER_PASSWORD_KEY) === 'true'
  if (rememberPassword) {
    const savedUsername = localStorage.getItem(SAVED_USERNAME_KEY)
    const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY)

    if (savedUsername && savedPassword) {
      formData.username = savedUsername
      formData.password = savedPassword
      formData.rememberPassword = true
    }
  }
})

/** 保存或清除记住的密码 */
const handleRememberPassword = () => {
  if (formData.rememberPassword) {
    // 保存账号密码
    localStorage.setItem(REMEMBER_PASSWORD_KEY, 'true')
    localStorage.setItem(SAVED_USERNAME_KEY, formData.username)
    localStorage.setItem(SAVED_PASSWORD_KEY, formData.password)
  } else {
    // 清除保存的账号密码
    localStorage.removeItem(REMEMBER_PASSWORD_KEY)
    localStorage.removeItem(SAVED_USERNAME_KEY)
    localStorage.removeItem(SAVED_PASSWORD_KEY)
  }
}

/** 处理登录提交 */
const submitForm = async (values) => {
  loading.value = true
  loginState.status = '' // 清除之前的错误状态

  // 处理记住密码
  handleRememberPassword()

  try {
    await userStore.login(values)
    router.push('/')
  } catch {
    loginState.status = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-image: url('@/assets/images/login-background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.lang-selector {
  width: 42px;
  height: 42px;
  line-height: 42px;
  position: fixed;
  right: 16px;
  top: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.login-content {
  flex: 1;
  padding: 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form-wrapper {
  min-width: 280px;
  max-width: 75vw;
  width: 328px;
}

.form-login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  line-height: 44px;

  .form-login-logo {
    width: 44px;
    height: 44px;
    margin-inline-end: 16px;
    vertical-align: top;

    img {
      width: 100%;
    }
  }

  .form-login-title {
    position: relative;
    inset-block-start: 2px;
    font-weight: 600;
    font-size: 33px;
  }
}

.form-login-desc {
  text-align: center;
  margin-block-start: 12px;
  margin-block-end: 40px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.login-form {
  .login-tabs {
    margin-bottom: 24px;

    :deep(.ant-tabs-tab) {
      font-size: 16px;
    }
  }

  .error-alert {
    margin-bottom: 24px;
  }

  .captcha-wrapper {
    display: flex;
    gap: 8px;

    .captcha-input {
      flex: 1;
    }

    .captcha-btn {
      flex-shrink: 0;
      min-width: 120px;
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .forgot-password {
      color: #1890ff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .login-btn {
    height: 40px;
    font-size: 16px;
    margin-bottom: 24px;
  }

  .other-login {
    text-align: center;

    .other-login-text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-bottom: 16px;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 80px;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.06);
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }

    .social-icons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }
}

.social-action {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-form-wrapper {
    width: 95vw;
    max-width: 328px;
  }

  .form-login-header {
    .title {
      font-size: 24px;
      line-height: 32px;
    }
  }

  .other-login {
    .other-login-text {
      &::before,
      &::after {
        width: 60px;
      }
    }
  }
}
</style>
