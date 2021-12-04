<template>
  <div class="registerFaces">
    <div>顔写真を登録してください</div>
    <input type="file" accept="image/*" multiple @change="onImageChanged" />
    <div class="preview">
      <img class="preview-image" v-for="(imageUrl, i) in imageUrls" :key="i" :src="imageUrl" />
    </div>
    <button class="submitButton" @click="submit" :disabled="!canRegister" :class="{ active: canRegister }">送信する</button>
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

    const submit = async () => {
      if (!canRegister.value) return
      const data = await Promise.all(files.value.map(file => getBase64(file)))
      const body = { data, user_id: currentUserStore.currentUser.id }
      axios.post(`${process.env.VUE_APP_API_ROOT}/register_faces`, body).then(res => {
        router.replace({ name: 'Mypage' })
      })
    }
    return {
      imageUrls,
      onImageChanged,
      canRegister,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
.preview {
  &-image {
    width: 200px;
    margin: 10px;
  }
}

.submitButton {
  padding: 20px;
  &.active {
    background-color: rgb(69, 221, 69);
  }
}
</style>
