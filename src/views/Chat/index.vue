<template>
  <div class="w-[1200px] mx-auto flex mt-10">
    <Conversations @onGetRole="getRole" />
    <Bubble :list="list" @on-send-message="sendMessage" />
  </div>
</template>
<script setup lang="ts">
import Conversations from "./components/Conversations.vue";
import Bubble from "./components/Bubble.vue";
import { ref } from "vue";
import { getChatHistory } from "@/apis/chat";
import { useUserStore } from "@/stores/user";
import type {
  ChatDto,
  ChatMessageList,
  ChatRoleType,
  ChatMessage,
} from "@en/common/chat/index.ts";
import { sse, CHAT_URL } from "@/apis/sse/index";
const userStore = useUserStore();
const list = ref<ChatMessageList>([]);
const userId = userStore.user?.id;
const role = ref<ChatRoleType>("normal");
const getRole = async (params: ChatRoleType) => {
  role.value = params;
  const res = await getChatHistory(userId!, role.value);
  list.value = res.data;
};
const sendMessage = (
  message: string,
  deepThink: boolean,
  webSearch: boolean,
) => {
  list.value.push({ role: "human", content: message, type: "chat" });
  list.value.push({ role: "ai", content: "", type: "chat" });
  sse<ChatMessage, ChatDto>(
    CHAT_URL,
    "POST",
    {
      role: role.value,
      content: message,
      userId: userId!,
      deepThink,
      webSearch,
    },
    (data) => {
      list.value[list.value.length - 1].content += data.content;
    },
  );
};
</script>
