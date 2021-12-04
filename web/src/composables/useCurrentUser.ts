import { reactive, InjectionKey } from 'vue'

export type User = {
  id: number | null,
  name: string,
  faceRegistered: boolean
}

export const useCurrentUser = () => {
  const currentUser = reactive<User>({
    id: null,
    name: '',
    faceRegistered: false
  })
  const setCurrentUser = (user: User) => {
    currentUser.id = user.id
    currentUser.name = user.name
    currentUser.faceRegistered = user.faceRegistered
  }

  return {
    currentUser,
    setCurrentUser
  }
}

export type CurrentUserStore = ReturnType<typeof useCurrentUser>
export const useCurrentUserKey : InjectionKey<CurrentUserStore> = Symbol('CurrentUserStore')
