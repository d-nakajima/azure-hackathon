<template>
  <div>
    <div>マイページ</div>
    <div>
      <div>ポイント</div>
      <div>笑顔作成ポイント: {{ smileMakerPoint }}</div>
      <div>自分の笑顔ポイント: {{ ownSmilePoint }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios'
import { defineComponent, inject, ref } from 'vue'
import { useCurrentUserKey, CurrentUserStore } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const router = useRouter()
    const currentUserStore = inject(useCurrentUserKey) as CurrentUserStore

    if (!currentUserStore.currentUser.id) {
      router.replace({ name: 'Login' })
    } else if (currentUserStore.currentUser.faceRegistered) {
      router.replace({ name: 'RegisterFaces' })
    }

    const ownSmilePoint = ref(null)
    const smileMakerPoint = ref(null)
    axios.get(`${process.env.VUE_APP_API_ROOT}/my_status`).then((res) => {
      const data = res.data
      ownSmilePoint.value = data.own_smile_point
      smileMakerPoint.value = data.smile_maker_point
    }).catch((e) => {
      console.log(e)
    })

    return {
      ownSmilePoint,
      smileMakerPoint
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
