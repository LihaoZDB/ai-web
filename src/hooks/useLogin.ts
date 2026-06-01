import { IS_SHOWLOGIN } from "../components/Login/type.ts";
import { ref, inject } from "vue";
import { useUserStore } from "@/stores/user";

export const useLogin = () => {
  const isShowLogin = inject(IS_SHOWLOGIN, ref(false));
  const userStore = useUserStore();
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

  const hide = () => {
    isShowLogin.value = false;
  };

  return {
    login,
    hide,
  };
};
