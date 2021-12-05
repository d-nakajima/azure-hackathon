<template>
  <div class="container">
    <div class="login">
      <img class="login-logo" src="@/assets/images/logo.png" />
      <div class="login-form">
        <input class="login-form-textBox" v-model="name" placeholder="input user name (>= 5 chars)" />
        <span class="login-form-button" :disabled="!canSubmit" :class="{ active: canSubmit }" @click="login(name)">
          {{ submitting ? '送信中...' : 'ログイン' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue'
import { ref } from '@vue/reactivity'
import axios from 'axios'
import { useCurrentUserKey, CurrentUserStore, User } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
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

    const name = ref('')
    const canSubmit = computed(() => name.value.length >= 5)
    const submitting = ref(false)
    const login = (name: any) => {
      if (!canSubmit.value) return
      submitting.value = true
      axios.post(`${process.env.VUE_APP_API_ROOT}/auth`, { name }).then(res => {
        currentUserStore.setCurrentUser(res.data.user as User)
        submitting.value = false
        redirectByStatus()
      })
    }

    redirectByStatus()

    return {
      name,
      canSubmit,
      submitting,
      login,
      currentUserId: currentUserStore.currentUser.id
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  background: $logo-background;
  height: 100%;
}
.login {
  padding: 50px;
  &-title {
    margin: 20px;
    font-size: 24px;
  }
  &-form {
    margin: 20px;
    text-align: center;
    &-textBox {
      display: block;
      height: 32px;
      width: 100%;
      max-width: 480px;
      margin: auto;
    }
    &-button {
      margin-top: 50px;
      padding: 20px 40px;
      display: inline-block;
      border-radius: 10px;
      background: $disable;
      color: $gray;
      &.active {
        color: $black;
        background: $button-background-active;
        box-shadow: 1px 1px 2px $black;
        pointer-events: inherit;
      }
    }
  }
  &-logo {
    margin-top: 100px;
    width: 80%;
    max-width: 300px;
  }
}
</style>
