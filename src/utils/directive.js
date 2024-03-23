import { useStore } from "@/store"

export default function auth(app) {
  app.directive('auth', {
    mounted(el, binding) {
      const userStore = useStore().user
      //若用户权限列表中不存在该权限，则移除该组件
      if (!userStore.HasPerms(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })
}