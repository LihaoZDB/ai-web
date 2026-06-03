import { IS_SHOWLOGIN } from "../components/Login/type.ts";
import { ref, inject } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

export const useLogin = () => {
  const isShowLogin = inject(IS_SHOWLOGIN, ref(false));
  const userStore = useUserStore();
  const router = useRouter();
  const login = () => {
    return new Promise((resolve, reject) => {
      if (userStore.getUser) {
        resolve(true);
      } else {
        isShowLogin.value = true; // 显示登陆弹窗
        reject(false);
      }
    });
  };

  const logout = () => {
    userStore.logout();
    router.push("/");
  };

  const hide = () => {
    isShowLogin.value = false;
  };

  return {
    login,
    hide,
    logout,
  };
};
