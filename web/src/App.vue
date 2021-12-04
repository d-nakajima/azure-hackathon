<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/login">ログイン</router-link> | -->
    </div>
    <router-view/>
  </div>
</template>

<script>
import { computed, defineComponent, provide, watch } from 'vue'
import { useCurrentUser, useCurrentUserKey } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const router = useRouter()
    const currentUserStore = useCurrentUser()
    provide(useCurrentUserKey, currentUserStore)
    return {}
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
