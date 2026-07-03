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
import { Tracker } from "@en/tracker";

const tracker = new Tracker({
  baseUrl: "/api/v1",
  uv: {
    api: "/tracker/uv",
    updateApi: "/tracker/update-uv",
  },
  pv: {
    api: "/tracker/pv",
  },
  event: {
    api: "/tracker/event",
  },
  error: {
    api: "/tracker/error",
  },
  performance: {
    api: "/tracker/performance",
  },
});

const userStore = useUserStore();
const { connect, disconnect } = useSocket();
watch(
  () => userStore.user?.id,
  (newVal) => {
    if (newVal) {
      tracker.setUserId(newVal);
      connect();
    } else {
      disconnect();
    }
  },
  { immediate: true },
);
</script>
