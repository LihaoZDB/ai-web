import { IS_SHOWLOGIN } from "../components/Login/type.ts";
import { ref, inject } from "vue";

export const useLogin = () => {
  const isShowLogin = inject(IS_SHOWLOGIN, ref(false));

  const login = () => {
    isShowLogin.value = true;
  };

  const hide = () => {
    isShowLogin.value = false;
  };

  return {
    login,
    hide,
  };
};
