import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { type Token, type WebResultUser } from "@en/common/user";
export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<WebResultUser | null>(null);
    const setUser = (params: WebResultUser) => {
      user.value = params;
    };    

    // 获取访问令牌和刷新令牌
    const getAccessToken = computed(() => user.value?.token.accessToken);
    const getRefreshToken = computed(() => user.value?.token.refreshToken);
    // 更新访问令牌
    const updateToken = (newToken: Token) => {
      user.value!.token = newToken;
    };

    // 获取用户信息
    const getUser = computed(() => user.value);
    const logout = () => {
      user.value = null;
    };
    return {
      user,
      setUser,
      getUser,
      logout,
      getAccessToken,
      getRefreshToken,
      updateToken,
    };
  },
  { persist: true },
);
