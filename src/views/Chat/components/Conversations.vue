<template>
  <div
    class="p-5 rounded-[5px] w-[256px] bg-purple-50 border border-right-1 border-t-0 border-b-0 border-l-0 border-gray-200"
  >
    <div
      @click="changeActive(value)"
      :class="{ 'bg-purple-300': active === value.id }"
      class="rounded-[5px] p-2 transition-all duration-300"
      v-for="value in chatMode"
      :key="value.id"
    >
      <div class="text-sm cursor-pointer p-2 px-4 text-gray-700">
        {{ value.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChatMode, ChatModeList } from "@en/common/chat";
import { getChatMode } from "@/apis/chat";
const emits = defineEmits(["onGetRole"]);
const chatMode = ref<ChatModeList>([]); // 消息模式列表
const active = ref<string | null>(null);

const changeActive = (value: any) => {
  active.value = value.id;
  const role = chatMode.value.find((item: any) => item.id === value.id)?.role;
  emits("onGetRole", role);
};

const getChatModeList = async () => {
  const { data } = await getChatMode();
  chatMode.value = data;
  active.value = chatMode.value[0].id;
  emits("onGetRole", chatMode.value[0].role);
};

onMounted(() => {
  getChatModeList();
});
</script>
