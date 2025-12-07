import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebar = ref({
    opened: true,
    withoutAnimation: false
  })
  const device = ref('desktop')

  function toggleSidebar() {
    sidebar.value.opened = !sidebar.value.opened
  }

  function closeSidebar({ withoutAnimation = false } = {}) {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  function openSidebar({ withoutAnimation = false } = {}) {
    sidebar.value.opened = true
    sidebar.value.withoutAnimation = withoutAnimation
  }

  function toggleDevice(d) {
    device.value = d
  }

  return {
    sidebar,
    device,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleDevice
  }
})
