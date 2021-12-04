<template>
  <div>
    <template v-if="currentUserId == null">
      <p>ログイン</p>
      <input v-model="name" placeholder="input user name" />
      <button @click="login(name)">ログイン</button>
    </template>
    <template v-else>
      <p>ログイン中</p>
      <p>currentUserId: {{ currentUserId }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { ref } from '@vue/reactivity'
import axios from 'axios'
import { useCurrentUserKey, CurrentUserStore, User } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const name = ref(null)
    const router = useRouter()
    const currentUserStore = inject(useCurrentUserKey) as CurrentUserStore

    const redirectByStatus = () => {
      if (currentUserStore.currentUser?.id == null) return
      if (currentUserStore.currentUser.faceRegistered) {
        router.push({ name: 'Mypage' })
      } else {
        router.push({ name: 'RegisterFaces' })
      }
    }

    const login = (name: any) => {
      axios.post(`${process.env.VUE_APP_API_ROOT}/auth`, { name }).then(res => {
        currentUserStore.setCurrentUser(res.data.user as User)
        redirectByStatus()
      })
    }

    redirectByStatus()

    return {
      name,
      login,
      currentUserId: currentUserStore.currentUser.id
    }
  }
})
</script>
