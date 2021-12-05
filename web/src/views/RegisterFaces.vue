<template>
  <div class="container">
    <div class="registerFaces">
      <div class="registerFaces-description">5枚以上の顔写真を登録してください</div>
      <input class="registerFaces-input" type="file" accept="image/*" multiple @change="onImageChanged" />
      <div class="registerFaces-preview">
        <img class="registerFaces-preview-image" v-for="(imageUrl, i) in imageUrls" :key="i" :src="imageUrl" />
      </div>
      <button class="registerFaces-submitButton" @click="submit" :disabled="!canRegister" :class="{ active: canRegister }">
        {{ onRegistering ? '登録中...' : '送信する' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useCurrentUserKey, CurrentUserStore } from '@/composables/useCurrentUser'

const getBase64 = (file:File) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

export default defineComponent({
  setup () {
    const router = useRouter()
    const currentUserStore = inject(useCurrentUserKey) as CurrentUserStore

    if (!currentUserStore.currentUser.id) {
      router.replace({ name: 'Login' })
      return
    }

    const files = ref<File[]>([])
    const onImageChanged = (e: any) => {
      files.value = Array.from(e.target.files)
    }

    const imageUrls = computed(() => {
      return files.value.map(file => URL.createObjectURL(file))
    })

    const canRegister = computed(() => {
      return files.value.length >= 1
    })

    const onRegistering = ref(false)
    const submit = async () => {
      if (!canRegister.value) return
      if (onRegistering.value) return
      onRegistering.value = true
      if (!canRegister.value) return
      const data = await Promise.all(files.value.map(file => getBase64(file)))
      const body = { data, user_id: currentUserStore.currentUser.id }
      axios.post(`${process.env.VUE_APP_API_ROOT}/register_faces`, body).then(res => {
        router.replace({ name: 'Mypage' })
      }).catch(() => {
        window.alert('エラーが発生しました')
        onRegistering.value = false
      })
    }
    return {
      imageUrls,
      onImageChanged,
      canRegister,
      submit,
      onRegistering
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  background: $logo-background;
  height: 100%;
  width: 100%;
  overflow: scroll;
}

.registerFaces {
  padding: 50px;
  &-description {
    margin: 15px;
  }
  &-input {
    margin: 15px;
  }
  &-preview {
    display: flex;
    flex-direction: column;
    margin: auto;
    &-image {
      width: 200px;
      margin: 10px auto;
    }
  }
  &-submitButton {
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
</style>
