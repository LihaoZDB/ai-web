<template>
  <div
    v-if="isShowLogin"
    class="fixed inset-0 bg-black opacity-30 filter blur-sm z-40"
  />
  <Transition name="fade">
    <div
      v-if="isShowLogin"
      class="fixed inset-30 flex items-center justify-center z-50"
    >
      <div
        class="w-[1200px] h-[700px] bg-white rounded-[20px] shadow-2xl overflow-hidden flex"
      >
        <!-- 左侧 3D 模型区域 -->
        <ModelViewer ref="modelViewerRef" @change-type="changeType" />

        <!-- 右侧登录表单区域 -->
        <div class="flex-1 flex flex-col justify-center px-12 py-10 bg-white">
          <LoginForm v-if="loginType === 'login'" />
          <RegisterForm v-if="loginType === 'register'" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import ModelViewer from "./ModelViewer.vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import { ref, inject } from "vue";
import { IS_SHOWLOGIN } from "./type.ts";
import type { LOGIN_TYPE } from "./type.ts";
const isShowLogin = inject(IS_SHOWLOGIN, ref(false)); // 是否显示登录表单
const loginType = ref<LOGIN_TYPE>("login");
const changeType = (type: LOGIN_TYPE) => {
  loginType.value = type;
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    isShowLogin.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
