<template>
  <div class="container">
    <div class="mypage">
      <img class="mypage-logo" src="@/assets/images/logo.png" />
      <div class="mypage-data">
        <div class="mypage-data-title">あなたの得笑い度</div>
        <div class="mypage-data-value">{{ smileMakerPoint?.toFixed(3) || 3.2810 }}</div>
      </div>
      <!-- <div class="mypage-data">
        <div class="mypage-data-item">あなたは</div>
        <div class="mypage-data-item">{{ smileMakerPoint }}</div>
      </div>
        <div>自分の笑顔ポイント: {{ ownSmilePoint }}</div>
      </div> -->
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
    } else if (!currentUserStore.currentUser.faceRegistered) {
      router.replace({ name: 'RegisterFaces' })
    }

    const ownSmilePoint = ref(null)
    const smileMakerPoint = ref(null)
    axios.get(`${process.env.VUE_APP_API_ROOT}/my_status?userId=${currentUserStore.currentUser.id}`).then((res) => {
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
.container {
  background: $logo-background;
  height: 100%;
  width: 100%;
  overflow: scroll;
}
.mypage {
  &-logo {
    margin-top: 100px;
    width: 80%;
    max-width: 300px;
  }
  &-data {
    margin-top: 50px;
    &-title {
      font-size: 24px;
      color: $white;
      font-weight: bold;
    }
    &-value {
      margin: 20px;
      font-size: 36px;
      color: $white;
      font-weight: bold;
    }
  }
}
</style>
