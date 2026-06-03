import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Token, WebResultUser, UserUpdate } from "@en/common/user";
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

    // 点击完成保存之后更新用户信息
    const updateUser = (params: UserUpdate) => {
      user.value!.name = params.name as string;
      user.value!.email = params.email;
      user.value!.address = params.address;
      user.value!.bio = params.bio;
      user.value!.avatar = params.avatar;
      user.value!.isTimingTask = params.isTimingTask;
      user.value!.timingTaskTime = params.timingTaskTime;
    };

    // 在设置界面默认获取的值
    const getUpdateUserInfo = computed<UserUpdate>(() => {
      return { 
        name: user.value!.name,
        email: user.value!.email,
        address: user.value!.address,
        bio: user.value!.bio,
        avatar: user.value!.avatar,
        isTimingTask: user.value!.isTimingTask,
        timingTaskTime: user.value!.timingTaskTime,
      };
    });

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
      updateUser,
      getUpdateUserInfo,
    };
  },
  { persist: true },
);
