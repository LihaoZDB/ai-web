<template>
  <RouterView />
  <Search />
  <Login />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Search from "./components/Search/index.vue";
import Login from "./components/Login/index.vue";
import { provide, ref, watch } from "vue";
import { IS_SHOWLOGIN } from "./components/Login/type.ts";
provide(IS_SHOWLOGIN, ref(false));
import { useUserStore } from "./stores/user";
import { useSocket } from "./hooks/useSocket";
const userStore = useUserStore();
const { connect, disconnect } = useSocket();
watch(
  () => userStore.user?.id,
  (newVal) => {
    if (newVal) {
      connect();
    } else {
      disconnect();
    }
  },
  { immediate: true },
);
</script>
